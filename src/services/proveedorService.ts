import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateProveedorInput } from '../validators/proveedor';

export async function getAllProveedores(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.search && {
      OR: [
        { razon_social: { contains: String(query.search) } },
        { nit: { contains: String(query.search) } },
        { correo: { contains: String(query.search) } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.proveedor.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id_proveedor: 'asc' },
    }),
    prisma.proveedor.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getProveedorById(id: number) {
  const proveedor = await prisma.proveedor.findUnique({
    where: { id_proveedor: id },
  });

  if (!proveedor) {
    throw new NotFoundError('Proveedor no encontrado');
  }

  return proveedor;
}

export async function createProveedor(input: CreateProveedorInput) {
  const existing = await prisma.proveedor.findUnique({
    where: { nit: input.nit },
  });

  if (existing) {
    throw new ConflictError('Ya existe un proveedor con ese NIT');
  }

  return prisma.proveedor.create({ data: input });
}

export async function updateProveedor(id: number, input: Partial<CreateProveedorInput>) {
  await getProveedorById(id);
  return prisma.proveedor.update({
    where: { id_proveedor: id },
    data: input,
  });
}

export async function deleteProveedor(id: number) {
  await getProveedorById(id);

  const comprasCount = await prisma.compra.count({
    where: { id_proveedor: id },
  });

  if (comprasCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene compras asociadas');
  }

  return prisma.proveedor.update({
    where: { id_proveedor: id },
    data: { estado: 'Inactivo' },
  });
}
