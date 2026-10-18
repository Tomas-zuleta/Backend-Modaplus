import { prisma } from '../config/database';

export async function getDashboardMetrics() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Ventas del mes
  const ventasMes = await prisma.venta.aggregate({
    where: {
      fecha_venta: { gte: startOfMonth },
      estado: 'COMPLETADA',
    },
    _sum: { total_venta: true },
    _count: true,
  });

  // Ventas del año
  const ventasAnio = await prisma.venta.aggregate({
    where: {
      fecha_venta: { gte: startOfYear },
      estado: 'COMPLETADA',
    },
    _sum: { total_venta: true },
  });

  // Compras del mes
  const comprasMes = await prisma.compra.aggregate({
    where: {
      fecha_compra: { gte: startOfMonth },
      estado: 'Activa',
    },
    _sum: { id_compra: true },
    _count: true,
  });

  // Total productos activos
  const totalProductos = await prisma.producto.count({
    where: { estado: 'Activo' },
  });

  // Total clientes activos
  const totalClientes = await prisma.cliente.count({
    where: { estado: 'Activo' },
  });

  // Total proveedores activos
  const totalProveedores = await prisma.proveedor.count({
    where: { estado: 'Activo' },
  });

  // Productos con stock bajo
  const productosStockBajo = await prisma.variante.findMany({
    where: {
      estado: 'Activo',
      stock_actual: { lte: prisma.variante.fields.stock_minimo },
    },
    include: {
      producto: true,
      talla: true,
      color: true,
    },
    take: 10,
  });

  // Ventas por mes (últimos 6 meses)
  const ventasPorMes = await prisma.$queryRaw`
    SELECT
      strftime('%Y-%m', fecha_venta) as mes,
      SUM(total_venta) as total,
      COUNT(*) as cantidad
    FROM ventas
    WHERE estado = 'COMPLETADA'
      AND fecha_venta >= date('now', '-6 months')
    GROUP BY strftime('%Y-%m', fecha_venta)
    ORDER BY mes ASC
  `;

  // Ventas por origen
  const ventasPorOrigen = await prisma.venta.groupBy({
    by: ['origen'],
    where: { estado: 'COMPLETADA' },
    _sum: { total_venta: true },
    _count: true,
  });

  // Devoluciones pendientes
  const devolucionesPendientes = await prisma.devolucion.count({
    where: { estado: 'PENDIENTE' },
  });

  // Planes separe activos
  const planesSepareActivos = await prisma.planSepare.count({
    where: { estado: 'ACTIVO' },
  });

  // Abonos del mes
  const abonosMes = await prisma.abonoSepare.aggregate({
    where: { fecha_abono: { gte: startOfMonth } },
    _sum: { valor_abono: true },
  });

  return {
    ventasMes: ventasMes._sum.total_venta || 0,
    ventasMesCount: ventasMes._count,
    ventasAnio: ventasAnio._sum.total_venta || 0,
    comprasMesCount: comprasMes._count,
    totalProductos,
    totalClientes,
    totalProveedores,
    productosStockBajo,
    ventasPorMes,
    ventasPorOrigen,
    devolucionesPendientes,
    planesSepareActivos,
    abonosMes: abonosMes._sum.valor_abono || 0,
  };
}

export async function getPerformanceIndicators() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Ventas mes actual
  const ventasActual = await prisma.venta.aggregate({
    where: {
      fecha_venta: { gte: startOfMonth, lte: endOfMonth },
      estado: 'COMPLETADA',
    },
    _sum: { total_venta: true },
    _count: true,
  });

  // Ventas mes anterior
  const ventasAnterior = await prisma.venta.aggregate({
    where: {
      fecha_venta: { gte: startOfLastMonth, lte: endOfLastMonth },
      estado: 'COMPLETADA',
    },
    _sum: { total_venta: true },
    _count: true,
  });

  // Tasa de crecimiento
  const ventasActualTotal = ventasActual._sum.total_venta || 0;
  const ventasAnteriorTotal = ventasAnterior._sum.total_venta || 0;
  const tasaCrecimiento = ventasAnteriorTotal > 0
    ? ((ventasActualTotal - ventasAnteriorTotal) / ventasAnteriorTotal) * 100
    : 0;

  // Ticket promedio
  const ticketPromedio = ventasActual._count > 0
    ? ventasActualTotal / ventasActual._count
    : 0;

  // Productos más vendidos
  const productosMasVendidos = await prisma.detalleVenta.groupBy({
    by: ['id_variante'],
    _sum: { cantidad: true },
    orderBy: { _sum: { cantidad: 'desc' } },
    take: 5,
  });

  // Detalles de productos más vendidos
  const productosDetallados = await Promise.all(
    productosMasVendidos.map(async (p) => {
      const variante = await prisma.variante.findUnique({
        where: { id_variante: p.id_variante },
        include: {
          producto: true,
          talla: true,
          color: true,
        },
      });
      return {
        ...p,
        variante,
      };
    }),
  );

  // Ventas por método de pago
  const ventasPorMetodoPago = await prisma.venta.groupBy({
    by: ['metodo_pago'],
    where: {
      fecha_venta: { gte: startOfMonth },
      estado: 'COMPLETADA',
    },
    _sum: { total_venta: true },
    _count: true,
  });

  // Categorías más vendidas
  const ventasPorCategoria = await prisma.$queryRaw`
    SELECT
      c.nombre_categoria,
      SUM(dv.cantidad) as cantidad,
      SUM(dv.subtotal) as total
    FROM detalle_ventas dv
    JOIN variantes v ON dv.id_variante = v.id_variante
    JOIN productos p ON v.id_producto = p.id_producto
    JOIN categorias c ON p.id_categoria = c.id_categoria
    JOIN ventas vent ON dv.id_venta = vent.id_venta
    WHERE vent.estado = 'COMPLETADA'
      AND vent.fecha_venta >= date('now', '-30 days')
    GROUP BY c.id_categoria
    ORDER BY total DESC
    LIMIT 5
  `;

  return {
    ventasActual: ventasActualTotal,
    ventasAnterior: ventasAnteriorTotal,
    tasaCrecimiento,
    ticketPromedio,
    productosMasVendidos: productosDetallados,
    ventasPorMetodoPago,
    ventasPorCategoria,
  };
}
