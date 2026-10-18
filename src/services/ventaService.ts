import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateVentaInput } from '../validators/venta';

export async function getAllVentas(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.origen && { origen: String(query.origen) }),
    ...(query.id_cliente && { id_cliente: parseInt(String(query.id_cliente)) }),
    ...(query.fecha_desde && query.fecha_hasta && {
      fecha_venta: {
        gte: new Date(String(query.fecha_desde)),
        lte: new Date(String(query.fecha_hasta)),
      },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.venta.findMany({
      where,
      include: {
        cliente: true,
        detalles: {
          include: {
            variante: {
              include: {
                producto: true,
                talla: true,
                color: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_venta: 'desc' },
    }),
    prisma.venta.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getVentaById(id: number) {
  const venta = await prisma.venta.findUnique({
    where: { id_venta: id },
    include: {
      cliente: true,
      detalles: {
        include: {
          variante: {
            include: {
              producto: true,
              talla: true,
              color: true,
            },
          },
        },
      },
    },
  });

  if (!venta) {
    throw new NotFoundError('Venta no encontrada');
  }

  return venta;
}

export async function createVenta(input: CreateVentaInput) {
  // Verificar cliente
  const cliente = await prisma.cliente.findUnique({
    where: { id_cliente: input.id_cliente },
  });

  if (!cliente) {
    throw new NotFoundError('Cliente no encontrado');
  }

  // Calcular totales y verificar stock
  let subtotal = 0;
  for (const detalle of input.detalles) {
    const variante = await prisma.variante.findUnique({
      where: { id_variante: detalle.id_variante },
    });

    if (!variante) {
      throw new NotFoundError(`Variante ${detalle.id_variante} no encontrada`);
    }

    if (variante.estado !== 'Activo') {
      throw new ConflictError(`La variante ${detalle.id_variante} no está activa`);
    }

    if (variante.stock_actual < detalle.cantidad) {
      throw new ConflictError(
        `Stock insuficiente para ${variante.producto.nombre_producto}. Disponible: ${variante.stock_actual}`,
      );
    }

    subtotal += detalle.cantidad * detalle.precio_unitario;
  }

  const total = subtotal - input.descuento;

  // Crear venta en transacción
  const venta = await prisma.$transaction(async (tx) => {
    // Descontar stock
    for (const detalle of input.detalles) {
      await tx.variante.update({
        where: { id_variante: detalle.id_variante },
        data: {
          stock_actual: {
            decrement: detalle.cantidad,
          },
        },
      });
    }

    // Crear venta
    return tx.venta.create({
      data: {
        id_cliente: input.id_cliente,
        metodo_pago: input.metodo_pago,
        subtotal,
        descuento: input.descuento,
        total_venta: total,
        origen: input.origen,
        detalles: {
          create: input.detalles.map((d) => ({
            id_variante: d.id_variante,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
            subtotal: d.cantidad * d.precio_unitario,
          })),
        },
      },
      include: {
        cliente: true,
        detalles: {
          include: {
            variante: {
              include: {
                producto: true,
                talla: true,
                color: true,
              },
            },
          },
        },
      },
    });
  });

  return venta;
}

export async function anularVenta(id: number, motivo: string) {
  const venta = await prisma.venta.findUnique({
    where: { id_venta: id },
    include: { detalles: true },
  });

  if (!venta) {
    throw new NotFoundError('Venta no encontrada');
  }

  if (venta.estado === 'ANULADA') {
    throw new ConflictError('La venta ya está anulada');
  }

  // Restaurar stock en transacción
  return prisma.$transaction(async (tx) => {
    for (const detalle of venta.detalles) {
      await tx.variante.update({
        where: { id_variante: detalle.id_variante },
        data: {
          stock_actual: {
            increment: detalle.cantidad,
          },
        },
      });
    }

    return tx.venta.update({
      where: { id_venta: id },
      data: { estado: 'ANULADA' },
      include: {
        cliente: true,
        detalles: {
          include: {
            variante: {
              include: {
                producto: true,
                talla: true,
                color: true,
              },
            },
          },
        },
      },
    });
  });
}
