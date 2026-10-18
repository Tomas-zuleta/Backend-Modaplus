import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type { CreateUsuarioInput, UpdateUsuarioInput } from '../validators/usuario';

export async function getAllUsuarios(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.id_rol && { id_rol: parseInt(String(query.id_rol)) }),
    ...(query.search && {
      OR: [
        { nombres: { contains: String(query.search) } },
        { apellidos: { contains: String(query.search) } },
        { correo: { contains: String(query.search) } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.usuario.findMany({
      where,
      include: { rol: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_creacion: 'desc' },
    }),
    prisma.usuario.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getUsuarioById(id: number) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
    include: { rol: true },
  });

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado');
  }

  return usuario;
}

export async function createUsuario(input: CreateUsuarioInput) {
  const existing = await prisma.usuario.findUnique({
    where: { correo: input.correo },
  });

  if (existing) {
    throw new ConflictError('Ya existe un usuario con ese correo');
  }

  const hashedPassword = await hashPassword(input.contrasena);

  return prisma.usuario.create({
    data: {
      correo: input.correo,
      contrasena_hash: hashedPassword,
      nombres: input.nombres,
      apellidos: input.apellidos,
      telefono: input.telefono,
      id_rol: input.id_rol,
    },
    include: { rol: true },
  });
}

export async function updateUsuario(id: number, input: UpdateUsuarioInput) {
  await getUsuarioById(id);

  const data: Record<string, unknown> = { ...input };
  delete data.contrasena;

  return prisma.usuario.update({
    where: { id_usuario: id },
    data,
    include: { rol: true },
  });
}

export async function updateContrasena(id: number, contrasenaActual: string, nuevaContrasena: string) {
  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: id },
  });

  if (!usuario) {
    throw new NotFoundError('Usuario no encontrado');
  }

  const isValid = await comparePassword(contrasenaActual, usuario.contrasena_hash);
  if (!isValid) {
    throw new ConflictError('Contraseña actual incorrecta');
  }

  const hashedPassword = await hashPassword(nuevaContrasena);

  return prisma.usuario.update({
    where: { id_usuario: id },
    data: { contrasena_hash: hashedPassword },
  });
}

export async function deleteUsuario(id: number) {
  await getUsuarioById(id);

  // No eliminar, solo inactivar
  return prisma.usuario.update({
    where: { id_usuario: id },
    data: { estado: 'Inactivo' },
    include: { rol: true },
  });
}
