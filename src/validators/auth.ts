import { z } from 'zod';

export const loginSchema = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z.string().min(1, 'Contraseña requerida'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

export const registerSchema = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  nombres: z.string().min(2, 'Nombres requeridos').max(100),
  apellidos: z.string().min(2, 'Apellidos requeridos').max(100),
  telefono: z.string().min(7, 'Teléfono inválido').max(20).optional(),
  id_rol: z.number().int().positive().default(2),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
