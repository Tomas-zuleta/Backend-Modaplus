import { z } from 'zod';

export const createUsuarioSchema = z.object({
  correo: z.string().email('Correo inválido'),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
  nombres: z.string().min(2, 'Nombres requeridos').max(100),
  apellidos: z.string().min(2, 'Apellidos requeridos').max(100),
  telefono: z.string().min(7).max(20).optional(),
  id_rol: z.number().int().positive(),
});

export const updateUsuarioSchema = z.object({
  correo: z.string().email('Correo inválido').optional(),
  nombres: z.string().min(2).max(100).optional(),
  apellidos: z.string().min(2).max(100).optional(),
  telefono: z.string().min(7).max(20).optional(),
  estado: z.enum(['Activo', 'Inactivo']).optional(),
  id_rol: z.number().int().positive().optional(),
});

export const updateContrasenaSchema = z.object({
  contrasena_actual: z.string().min(1, 'Contraseña actual requerida'),
  nueva_contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
