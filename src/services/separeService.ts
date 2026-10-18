import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreatePlanSepareInput, CreateAbonoInput } from '../validators/separe';

export async function getAllPlanesSepare(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.id_cliente && { id_cliente: parseInt(String(query.id_cliente)) }),
  };

  const [data, total] = await Promise.all([
    prisma.planSepare.findMany({
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
        abonos: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_inicio: 'desc' },
    }),
    prisma.planSepare.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getPlanSepareById(id: number) {
  const plan = await prisma.planSepare.findUnique({
    where: { id_plan_separe: id },
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
      abonos: true,
    },
  });

  if (!plan) {
    throw new NotFoundError('Plan separe no encontrado');
  }

  return plan;
}

export async function createPlanSepare(input: CreatePlanSepareInput) {
  // Verificar cliente
  const cliente = await prisma.cliente.findUnique({
    where: { id_cliente: input.id_cliente },
  });

  if (!cliente) {
    throw new NotFoundError('Cliente no encontrado');
  }

  // Verificar que no tenga un plan activo
  const existingActive = await prisma.planSepare.findFirst({
    where: {
      id_cliente: input.id_cliente,
      estado: 'ACTIVO',
    },
  });

  if (existingActive) {
    throw new ConflictError('El cliente ya tiene un plan separe activo');
  }

  // Calcular total y verificar stock
  let total = 0;
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
      throw new ConflictError(`Stock insuficiente para ${variante.producto.nombre_producto}`);
    }

    total += detalle.cantidad * detalle.precio_unitario;
  }

  return prisma.$transaction(async (tx) => {
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

    return tx.planSepare.create({
      data: {
        id_cliente: input.id_cliente,
        fecha_vencimiento: new Date(input.fecha_vencimiento),
        detalles: {
          create: input.detalles.map((d) => ({
            id_variante: d.id_variante,
            cantidad: d.cantidad,
            precio_unitario: d.precio_unitario,
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
}

export async function updatePlanSepareEstado(id: number, estado: string) {
  const plan = await prisma.planSepare.findUnique({
    where: { id_plan_separe: id },
  });

  if (!plan) {
    throw new NotFoundError('Plan separe no encontrado');
  }

  return prisma.planSepare.update({
    where: { id_plan_separe: id },
    data: {
      estado,
      fecha_estado: new Date(),
    },
  });
}

export async function createAbono(input: CreateAbonoInput) {
  const plan = await prisma.planSepare.findUnique({
    where: { id_plan_separe: input.id_plan_separe },
    include: {
      detalles: true,
      abonos: true,
    },
  });

  if (!plan) {
    throw new NotFoundError('Plan separe no encontrado');
  }

  if (plan.estado !== 'ACTIVO') {
    throw new ConflictError('El plan no está activo');
  }

  // Calcular saldo pendiente
  const totalPlan = plan.detalles.reduce((sum, d) => sum + d.cantidad * d.precio_unitario, 0);
  const totalAbonado = plan.abonos.reduce((sum, a) => sum + a.valor_abono, 0);
  const saldoPendiente = totalPlan - totalAbonado;

  if (input.valor_abono > saldoPendiente) {
    throw new ConflictError(`El abono excede el saldo pendiente (${saldoPendiente})`);
  }

  const abono = await prisma.abonoSepare.create({
    data: {
      id_plan_separe: input.id_plan_separe,
      valor_abono: input.valor_abono,
      metodo_pago: input.metodo_pago,
      observacion: input.observacion,
    },
  });

  // Si se completó el pago, finalizar plan
  const nuevoTotalAbonado = totalAbonado + input.valor_abono;
  if (nuevoTotalAbonado >= totalPlan) {
    await prisma.planSepare.update({
      where: { id_plan_separe: input.id_plan_separe },
      data: {
        estado: 'FINALIZADO',
        fecha_estado: new Date(),
      },
    });
  }

  return abono;
}

export async function getAbonosByPlan(planId: number) {
  return prisma.abonoSepare.findMany({
    where: { id_plan_separe: planId },
    orderBy: { fecha_abono: 'desc' },
  });
}
