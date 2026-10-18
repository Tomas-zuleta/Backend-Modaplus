import { z } from 'zod';

export const createClienteSchema = z.object({
  tipo_documento: z.string().min(2).max(10).default('CC'),
  identificacion: z.string().min(5, 'Identificación requerida').max(20),
  nombres: z.string().min(2, 'Nombres requeridos').max(100),
  apellidos: z.string().min(2, 'Apellidos requeridos').max(100),
  telefono: z.string().min(7, 'Teléfono inválido').max(20),
  correo: z.string().email('Correo inválido'),
  direccion: z.string().max(200).optional(),
  contrasena: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .optional(),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateClienteSchema = z.object({
  tipo_documento: z.string().min(2).max(10).optional(),
  nombres: z.string().min(2).max(100).optional(),
  apellidos: z.string().min(2).max(100).optional(),
  telefono: z.string().min(7).max(20).optional(),
  correo: z.string().email().optional(),
  direccion: z.string().max(200).optional(),
  estado: z.enum(['Activo', 'Inactivo']).optional(),
});

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
