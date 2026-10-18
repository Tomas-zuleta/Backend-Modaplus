import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateDevolucionInput } from '../validators/devolucion';

export async function getAllDevoluciones(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.id_cliente && { id_cliente: parseInt(String(query.id_cliente)) }),
  };

  const [data, total] = await Promise.all([
    prisma.devolucion.findMany({
      where,
      include: {
        venta: true,
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
      orderBy: { fecha_devolucion: 'desc' },
    }),
    prisma.devolucion.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getDevolucionById(id: number) {
  const devolucion = await prisma.devolucion.findUnique({
    where: { id_devolucion: id },
    include: {
      venta: true,
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

  if (!devolucion) {
    throw new NotFoundError('Devolución no encontrada');
  }

  return devolucion;
}

export async function createDevolucion(input: CreateDevolucionInput) {
  // Verificar venta
  const venta = await prisma.venta.findUnique({
    where: { id_venta: input.id_venta },
    include: { detalles: true },
  });

  if (!venta) {
    throw new NotFoundError('Venta no encontrada');
  }

  if (venta.estado !== 'COMPLETADA') {
    throw new ConflictError('Solo se pueden devolver ventas completadas');
  }

  // Verificar que los detalles correspondan a la venta
  for (const detalle of input.detalles) {
    const ventaDetalle = venta.detalles.find((d) => d.id_variante === detalle.id_variante);
    if (!ventaDetalle) {
      throw new ConflictError(`La variante ${detalle.id_variante} no está en la venta`);
    }
    if (detalle.cantidad > ventaDetalle.cantidad) {
      throw new ConflictError(`Cantidad a devolver excede la cantidad vendida`);
    }
  }

  return prisma.devolucion.create({
    data: {
      id_venta: input.id_venta,
      id_cliente: venta.id_cliente,
      motivo: input.motivo,
      tipo_respuesta: input.tipo_respuesta,
      detalles: {
        create: input.detalles.map((d) => ({
          id_variante: d.id_variante,
          cantidad: d.cantidad,
        })),
      },
    },
    include: {
      venta: true,
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
}

export async function updateDevolucionEstado(id: number, estado: string, observacion?: string) {
  const devolucion = await prisma.devolucion.findUnique({
    where: { id_devolucion: id },
    include: { detalles: true },
  });

  if (!devolucion) {
    throw new NotFoundError('Devolución no encontrada');
  }

  if (devolucion.estado !== 'PENDIENTE') {
    throw new ConflictError('Solo se pueden actualizar devoluciones pendientes');
  }

  // Si se aprueba, devolver stock
  if (estado === 'APROBADA') {
    return prisma.$transaction(async (tx) => {
      for (const detalle of devolucion.detalles) {
        await tx.variante.update({
          where: { id_variante: detalle.id_variante },
          data: {
            stock_actual: {
              increment: detalle.cantidad,
            },
          },
        });
      }

      return tx.devolucion.update({
        where: { id_devolucion: id },
        data: {
          estado,
          fecha_estado: new Date(),
        },
        include: {
          venta: true,
          cliente: true,
          detalles: true,
        },
      });
    });
  }

  return prisma.devolucion.update({
    where: { id_devolucion: id },
    data: {
      estado,
      fecha_estado: new Date(),
    },
    include: {
      venta: true,
      cliente: true,
      detalles: true,
    },
  });
}
