import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateRolInput, UpdateRolInput } from '../validators/rol';

export async function getAllRoles(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.search && {
      OR: [
        { nombre_rol: { contains: String(query.search) } },
        { descripcion: { contains: String(query.search) } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.rol.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_creacion: 'desc' },
    }),
    prisma.rol.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getRolById(id: number) {
  const rol = await prisma.rol.findUnique({
    where: { id_rol: id },
  });

  if (!rol) {
    throw new NotFoundError('Rol no encontrado');
  }

  return rol;
}

export async function createRol(input: CreateRolInput) {
  const existing = await prisma.rol.findUnique({
    where: { nombre_rol: input.nombre_rol },
  });

  if (existing) {
    throw new ConflictError('Ya existe un rol con ese nombre');
  }

  return prisma.rol.create({
    data: {
      nombre_rol: input.nombre_rol,
      descripcion: input.descripcion,
      estado: input.estado,
      permisos: JSON.stringify(input.permisos),
    },
  });
}

export async function updateRol(id: number, input: UpdateRolInput) {
  await getRolById(id);

  const data: Record<string, unknown> = {};
  if (input.nombre_rol) data.nombre_rol = input.nombre_rol;
  if (input.descripcion !== undefined) data.descripcion = input.descripcion;
  if (input.estado) data.estado = input.estado;
  if (input.permisos) data.permisos = JSON.stringify(input.permisos);

  return prisma.rol.update({
    where: { id_rol: id },
    data,
  });
}

export async function deleteRol(id: number) {
  await getRolById(id);

  // Verificar si hay usuarios con este rol
  const usuariosCount = await prisma.usuario.count({
    where: { id_rol: id },
  });

  if (usuariosCount > 0) {
    throw new ConflictError('No se puede eliminar: hay usuarios asignados a este rol');
  }

  return prisma.rol.delete({
    where: { id_rol: id },
  });
}
