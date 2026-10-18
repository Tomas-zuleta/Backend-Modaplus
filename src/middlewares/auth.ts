import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { prisma } from '../config/database';
import { hasPermission, isSuperAdmin, Module, PermissionAction } from '../utils/permissions';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export async function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token de acceso requerido');
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    // Verificar que el usuario sigue existiendo y activo
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: payload.id },
      include: { rol: true },
    });

    if (!usuario || usuario.estado !== 'Activo') {
      throw new UnauthorizedError('Usuario no encontrado o inactivo');
    }

    req.user = {
      id: usuario.id_usuario,
      correo: usuario.correo,
      id_rol: usuario.id_rol,
      rol: usuario.rol.nombre_rol,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Token inválido o expirado'));
    }
  }
}

export function authorize(module: Module, action: PermissionAction) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('No autenticado');
      }

      // Superadmin siempre tiene acceso
      if (isSuperAdmin(req.user.rol)) {
        return next();
      }

      const rol = await prisma.rol.findUnique({
        where: { id_rol: req.user.id_rol },
      });

      if (!rol) {
        throw new ForbiddenError('Rol no encontrado');
      }

      const { parsePermissions } = await import('../utils/permissions');
      const permissions = parsePermissions(rol.permisos);

      if (!hasPermission(permissions, module, action)) {
        throw new ForbiddenError(`No tienes permiso para ${action} en ${module}`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
