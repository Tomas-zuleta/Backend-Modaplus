import { z } from 'zod';

export const detalleDevolucionSchema = z.object({
  id_variante: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});

export const createDevolucionSchema = z.object({
  id_venta: z.number().int().positive(),
  motivo: z.string().min(5, 'Motivo requerido').max(500),
  tipo_respuesta: z.enum(['SALDO A FAVOR', 'DEVOLUCIÓN DE DINERO', 'CAMBIO']),
  detalles: z.array(detalleDevolucionSchema).min(1),
});

export const updateDevolucionEstadoSchema = z.object({
  estado: z.enum(['PENDIENTE', 'APROBADA', 'RECHAZADA']),
  observacion: z.string().max(500).optional(),
});

export type CreateDevolucionInput = z.infer<typeof createDevolucionSchema>;
