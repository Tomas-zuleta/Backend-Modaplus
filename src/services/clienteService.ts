import { prisma } from '../config/database';
import { hashPassword } from '../utils/password';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateClienteInput, UpdateClienteInput } from '../validators/cliente';

export async function getAllClientes(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.search && {
      OR: [
        { nombres: { contains: String(query.search) } },
        { apellidos: { contains: String(query.search) } },
        { correo: { contains: String(query.search) } },
        { identificacion: { contains: String(query.search) } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.cliente.findMany({
      where,
      include: { rol: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_creacion: 'desc' },
    }),
    prisma.cliente.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getClienteById(id: number) {
  const cliente = await prisma.cliente.findUnique({
    where: { id_cliente: id },
    include: { rol: true },
  });

  if (!cliente) {
    throw new NotFoundError('Cliente no encontrado');
  }

  return cliente;
}

export async function getClienteByIdentificacion(identificacion: string) {
  return prisma.cliente.findFirst({
    where: { identificacion },
    include: { rol: true },
  });
}

export async function createCliente(input: CreateClienteInput) {
  const existingIdentificacion = await prisma.cliente.findUnique({
    where: { identificacion: input.identificacion },
  });

  if (existingIdentificacion) {
    throw new ConflictError('Ya existe un cliente con esa identificación');
  }

  const existingCorreo = await prisma.cliente.findUnique({
    where: { correo: input.correo },
  });

  if (existingCorreo) {
    throw new ConflictError('Ya existe un cliente con ese correo');
  }

  const data: Record<string, unknown> = { ...input };
  if (input.contrasena) {
    data.contrasena_hash = await hashPassword(input.contrasena);
    delete data.contrasena;
  }

  return prisma.cliente.create({
    data,
    include: { rol: true },
  });
}

export async function updateCliente(id: number, input: UpdateClienteInput) {
  await getClienteById(id);

  const data: Record<string, unknown> = { ...input };
  if (input.contrasena) {
    data.contrasena_hash = await hashPassword(input.contrasena);
    delete data.contrasena;
  }

  return prisma.cliente.update({
    where: { id_cliente: id },
    data,
    include: { rol: true },
  });
}

export async function deleteCliente(id: number) {
  await getClienteById(id);

  // Verificar si tiene ventas
  const ventasCount = await prisma.venta.count({
    where: { id_cliente: id },
  });

  if (ventasCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene ventas asociadas');
  }

  return prisma.cliente.update({
    where: { id_cliente: id },
    data: { estado: 'Inactivo' },
  });
}
