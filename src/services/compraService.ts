import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateCompraInput } from '../validators/compra';

export async function getAllCompras(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.id_proveedor && { id_proveedor: parseInt(String(query.id_proveedor)) }),
  };

  const [data, total] = await Promise.all([
    prisma.compra.findMany({
      where,
      include: {
        proveedor: true,
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
      orderBy: { fecha_compra: 'desc' },
    }),
    prisma.compra.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getCompraById(id: number) {
  const compra = await prisma.compra.findUnique({
    where: { id_compra: id },
    include: {
      proveedor: true,
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

  if (!compra) {
    throw new NotFoundError('Compra no encontrada');
  }

  return compra;
}

export async function createCompra(input: CreateCompraInput) {
  // Verificar proveedor
  const proveedor = await prisma.proveedor.findUnique({
    where: { id_proveedor: input.id_proveedor },
  });

  if (!proveedor) {
    throw new NotFoundError('Proveedor no encontrado');
  }

  // Verificar número de factura único
  const existingFactura = await prisma.compra.findFirst({
    where: { numero_factura_proveedor: input.numero_factura_proveedor },
  });

  if (existingFactura) {
    throw new ConflictError('Ya existe una compra con ese número de factura');
  }

  // Crear compra en transacción
  const compra = await prisma.$transaction(async (tx) => {
    // Aumentar stock
    for (const detalle of input.detalles) {
      const variante = await tx.variante.findUnique({
        where: { id_variante: detalle.id_variante },
      });

      if (!variante) {
        throw new NotFoundError(`Variante ${detalle.id_variante} no encontrada`);
      }

      await tx.variante.update({
        where: { id_variante: detalle.id_variante },
        data: {
          stock_actual: {
            increment: detalle.cantidad,
          },
        },
      });
    }

    return tx.compra.create({
      data: {
        id_proveedor: input.id_proveedor,
        numero_factura_proveedor: input.numero_factura_proveedor,
        iva: input.iva,
        tipo_pago: input.tipo_pago,
        detalles: {
          create: input.detalles.map((d) => ({
            id_variante: d.id_variante,
            cantidad: d.cantidad,
            costo_unitario: d.costo_unitario,
          })),
        },
      },
      include: {
        proveedor: true,
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

  return compra;
}

export async function anularCompra(id: number) {
  const compra = await prisma.compra.findUnique({
    where: { id_compra: id },
    include: { detalles: true },
  });

  if (!compra) {
    throw new NotFoundError('Compra no encontrada');
  }

  if (compra.estado === 'Anulada') {
    throw new ConflictError('La compra ya está anulada');
  }

  return prisma.$transaction(async (tx) => {
    // Reducir stock
    for (const detalle of compra.detalles) {
      await tx.variante.update({
        where: { id_variante: detalle.id_variante },
        data: {
          stock_actual: {
            decrement: detalle.cantidad,
          },
        },
      });
    }

    return tx.compra.update({
      where: { id_compra: id },
      data: { estado: 'Anulada' },
    });
  });
}
