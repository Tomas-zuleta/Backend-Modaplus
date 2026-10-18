import { z } from 'zod';

export const detalleVentaSchema = z.object({
  id_variante: z.number().int().positive(),
  cantidad: z.number().int().positive('Cantidad debe ser positiva'),
  precio_unitario: z.number().positive(),
});

export const createVentaSchema = z.object({
  id_cliente: z.number().int().positive(),
  metodo_pago: z.string().min(2, 'Método de pago requerido').max(50),
  descuento: z.number().min(0).default(0),
  origen: z.enum(['ADMIN', 'TIENDA_ONLINE']).default('ADMIN'),
  detalles: z.array(detalleVentaSchema).min(1, 'Debe tener al menos un detalle'),
});

export const updateVentaEstadoSchema = z.object({
  estado: z.enum(['COMPLETADA', 'ANULADA', 'PENDIENTE']),
});

export const anularVentaSchema = z.object({
  motivo: z.string().min(5, 'Motivo requerido').max(500),
});

export type CreateVentaInput = z.infer<typeof createVentaSchema>;
