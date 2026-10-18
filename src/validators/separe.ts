import { z } from 'zod';

export const detallePlanSepareSchema = z.object({
  id_variante: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  precio_unitario: z.number().positive(),
});

export const createPlanSepareSchema = z.object({
  id_cliente: z.number().int().positive(),
  fecha_vencimiento: z.string().or(z.date()),
  detalles: z.array(detallePlanSepareSchema).min(1),
});

export const updatePlanSepareEstadoSchema = z.object({
  estado: z.enum(['ACTIVO', 'FINALIZADO', 'VENCIDO', 'CANCELADO']),
});

export const createAbonoSchema = z.object({
  id_plan_separe: z.number().int().positive(),
  valor_abono: z.number().positive('Valor del abono debe ser positivo'),
  metodo_pago: z.string().min(2).max(50),
  observacion: z.string().max(500).optional(),
});

export type CreatePlanSepareInput = z.infer<typeof createPlanSepareSchema>;
export type CreateAbonoInput = z.infer<typeof createAbonoSchema>;
