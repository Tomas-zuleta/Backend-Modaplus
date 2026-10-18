import { z } from 'zod';

export const createProveedorSchema = z.object({
  nit: z.string().min(5, 'NIT requerido').max(20),
  razon_social: z.string().min(2, 'Razón social requerida').max(200),
  contacto: z.string().max(100).optional(),
  contacto_telefono: z.string().min(7).max(20).optional(),
  contacto_correo: z.string().email().optional(),
  telefono: z.string().min(7, 'Teléfono requerido').max(20),
  correo: z.string().email('Correo inválido'),
  direccion: z.string().max(200).optional(),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateProveedorSchema = createProveedorSchema.partial();

export type CreateProveedorInput = z.infer<typeof createProveedorSchema>;
