import { z } from 'zod';

export const createPerdidaSchema = z.object({
  id_devolucion: z.number().int().positive(),
  id_variante: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  motivo: z.string().min(1),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
});

export const updatePerdidaSchema = z.object({
  cantidad: z.number().int().positive().optional(),
  motivo: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
});
