import { z } from 'zod';

export const createRolSchema = z.object({
  nombre_rol: z.string().min(2, 'Nombre requerido').max(100),
  descripcion: z.string().max(500).optional(),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
  permisos: z.record(z.string(), z.record(z.string(), z.boolean())).default({}),
});

export const updateRolSchema = z.object({
  nombre_rol: z.string().min(2).max(100).optional(),
  descripcion: z.string().max(500).optional(),
  estado: z.enum(['Activo', 'Inactivo']).optional(),
  permisos: z.record(z.string(), z.record(z.string(), z.boolean())).optional(),
});

export type CreateRolInput = z.infer<typeof createRolSchema>;
export type UpdateRolInput = z.infer<typeof updateRolSchema>;
