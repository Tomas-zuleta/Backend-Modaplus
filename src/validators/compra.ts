import { z } from 'zod';

export const detalleCompraSchema = z.object({
  id_variante: z.number().int().positive(),
  cantidad: z.number().int().positive(),
  costo_unitario: z.number().positive(),
});

export const createCompraSchema = z.object({
  id_proveedor: z.number().int().positive(),
  numero_factura_proveedor: z.string().min(1, 'Número de factura requerido').max(50),
  iva: z.number().min(0).max(100).default(19),
  tipo_pago: z.enum(['Contado', 'Crédito']).default('Contado'),
  detalles: z.array(detalleCompraSchema).min(1, 'Debe tener al menos un detalle'),
});

export const updateCompraEstadoSchema = z.object({
  estado: z.enum(['Activa', 'Anulada']),
});

export type CreateCompraInput = z.infer<typeof createCompraSchema>;
