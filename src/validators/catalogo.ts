import { z } from 'zod';

// Categorías
export const createCategoriaSchema = z.object({
  nombre_categoria: z.string().min(2, 'Nombre requerido').max(100),
  descripcion: z.string().max(500).optional(),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateCategoriaSchema = createCategoriaSchema.partial();

// Colores
export const createColorSchema = z.object({
  nombre_color: z.string().min(2, 'Nombre requerido').max(100),
  codigo_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Código hex inválido'),
  codigos_hex: z.array(z.string()).optional(),
  es_multicolor: z.boolean().default(false),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateColorSchema = createColorSchema.partial();

// Tallas
export const createTallaSchema = z.object({
  nombre_talla: z.string().min(1, 'Nombre requerido').max(20),
  descripcion: z.string().max(100).optional(),
});

export const updateTallaSchema = createTallaSchema.partial();

// Productos
export const createProductoSchema = z.object({
  id_categoria: z.number().int().positive(),
  referencia: z.string().min(2, 'Referencia requerida').max(50),
  nombre_producto: z.string().min(2, 'Nombre requerido').max(200),
  descripcion: z.string().max(1000).optional(),
  genero: z.enum(['Mujer', 'Hombre']).optional(),
  imagen_url: z.string().url().optional(),
  imagenes_urls: z.array(z.string()).optional(),
  imagen_principal: z.number().int().min(0).default(0),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateProductoSchema = createProductoSchema.partial();

// Variantes
export const createVarianteSchema = z.object({
  id_producto: z.number().int().positive(),
  id_talla: z.number().int().positive(),
  id_color: z.number().int().positive(),
  precio_venta: z.number().positive('Precio debe ser positivo'),
  stock_actual: z.number().int().min(0).default(0),
  stock_minimo: z.number().int().min(0).default(0),
  stock_maximo: z.number().int().min(0).default(0),
  estado: z.enum(['Activo', 'Inactivo']).default('Activo'),
});

export const updateVarianteSchema = z.object({
  precio_venta: z.number().positive().optional(),
  stock_actual: z.number().int().min(0).optional(),
  stock_minimo: z.number().int().min(0).optional(),
  stock_maximo: z.number().int().min(0).optional(),
  estado: z.enum(['Activo', 'Inactivo']).optional(),
  motivo_baja: z.string().optional(),
});

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;
export type CreateColorInput = z.infer<typeof createColorSchema>;
export type CreateTallaInput = z.infer<typeof createTallaSchema>;
export type CreateProductoInput = z.infer<typeof createProductoSchema>;
export type CreateVarianteInput = z.infer<typeof createVarianteSchema>;
