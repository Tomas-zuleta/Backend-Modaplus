import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { UnauthorizedError, ConflictError } from '../errors';
import type { LoginInput, RegisterInput } from '../validators/auth';

export async function login(input: LoginInput) {
  const usuario = await prisma.usuario.findUnique({
    where: { correo: input.correo },
    include: { rol: true },
  });

  if (!usuario) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  if (usuario.estado !== 'Activo') {
    throw new UnauthorizedError('Usuario inactivo');
  }

  const isValid = await comparePassword(input.contrasena, usuario.contrasena_hash);
  if (!isValid) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  // Actualizar último acceso
  await prisma.usuario.update({
    where: { id_usuario: usuario.id_usuario },
    data: { ultimo_acceso: new Date() },
  });

  const payload = {
    id: usuario.id_usuario,
    correo: usuario.correo,
    id_rol: usuario.id_rol,
    rol: usuario.rol.nombre_rol,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: usuario.id_usuario });

  return {
    accessToken,
    refreshToken,
    user: {
      id: usuario.id_usuario,
      correo: usuario.correo,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      rol: usuario.rol.nombre_rol,
      id_rol: usuario.id_rol,
    },
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const { verifyRefreshToken } = await import('../utils/jwt');
  const payload = verifyRefreshToken(refreshToken);

  const usuario = await prisma.usuario.findUnique({
    where: { id_usuario: payload.id },
    include: { rol: true },
  });

  if (!usuario || usuario.estado !== 'Activo') {
    throw new UnauthorizedError('Usuario no válido');
  }

  const accessToken = generateAccessToken({
    id: usuario.id_usuario,
    correo: usuario.correo,
    id_rol: usuario.id_rol,
    rol: usuario.rol.nombre_rol,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
  });

  return { accessToken };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.usuario.findUnique({
    where: { correo: input.correo },
  });

  if (existing) {
    throw new ConflictError('Ya existe un usuario con ese correo');
  }

  const hashedPassword = await hashPassword(input.contrasena);

  const usuario = await prisma.usuario.create({
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

  const payload = {
    id: usuario.id_usuario,
    correo: usuario.correo,
    id_rol: usuario.id_rol,
    rol: usuario.rol.nombre_rol,
    nombres: usuario.nombres,
    apellidos: usuario.apellidos,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ id: usuario.id_usuario });

  return {
    accessToken,
    refreshToken,
    user: {
      id: usuario.id_usuario,
      correo: usuario.correo,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      rol: usuario.rol.nombre_rol,
    },
  };
}
