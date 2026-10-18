import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../errors';
import { getPaginationOptions, createPaginatedResult } from '../utils/pagination';
import type {
  CreateCategoriaInput,
  CreateColorInput,
  CreateTallaInput,
  CreateProductoInput,
  CreateVarianteInput,
} from '../validators/catalogo';

// ============ CATEGORÍAS ============

export async function getAllCategorias(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.search && {
      nombre_categoria: { contains: String(query.search) },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.categoria.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_creacion: 'desc' },
    }),
    prisma.categoria.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getCategoriaById(id: number) {
  const categoria = await prisma.categoria.findUnique({
    where: { id_categoria: id },
  });

  if (!categoria) {
    throw new NotFoundError('Categoría no encontrada');
  }

  return categoria;
}

export async function createCategoria(input: CreateCategoriaInput) {
  const existing = await prisma.categoria.findUnique({
    where: { nombre_categoria: input.nombre_categoria },
  });

  if (existing) {
    throw new ConflictError('Ya existe una categoría con ese nombre');
  }

  return prisma.categoria.create({ data: input });
}

export async function updateCategoria(id: number, input: Partial<CreateCategoriaInput>) {
  await getCategoriaById(id);
  return prisma.categoria.update({
    where: { id_categoria: id },
    data: input,
  });
}

export async function deleteCategoria(id: number) {
  await getCategoriaById(id);

  const productosCount = await prisma.producto.count({
    where: { id_categoria: id },
  });

  if (productosCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene productos asociados');
  }

  return prisma.categoria.delete({
    where: { id_categoria: id },
  });
}

// ============ COLORES ============

export async function getAllColores(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.search && {
      nombre_color: { contains: String(query.search) },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.color.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id_color: 'asc' },
    }),
    prisma.color.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getColorById(id: number) {
  const color = await prisma.color.findUnique({
    where: { id_color: id },
  });

  if (!color) {
    throw new NotFoundError('Color no encontrado');
  }

  return color;
}

export async function createColor(input: CreateColorInput) {
  const existing = await prisma.color.findUnique({
    where: { nombre_color: input.nombre_color },
  });

  if (existing) {
    throw new ConflictError('Ya existe un color con ese nombre');
  }

  return prisma.color.create({
    data: {
      ...input,
      codigos_hex: input.codigos_hex ? JSON.stringify(input.codigos_hex) : null,
    },
  });
}

export async function updateColor(id: number, input: Partial<CreateColorInput>) {
  await getColorById(id);
  const data: Record<string, unknown> = { ...input };
  if (input.codigos_hex) {
    data.codigos_hex = JSON.stringify(input.codigos_hex);
  }
  return prisma.color.update({
    where: { id_color: id },
    data,
  });
}

export async function deleteColor(id: number) {
  await getColorById(id);

  const variantesCount = await prisma.variante.count({
    where: { id_color: id },
  });

  if (variantesCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene variantes asociadas');
  }

  return prisma.color.delete({
    where: { id_color: id },
  });
}

// ============ TALLAS ============

export async function getAllTallas(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.search && {
      nombre_talla: { contains: String(query.search) },
    }),
  };

  const [data, total] = await Promise.all([
    prisma.talla.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id_talla: 'asc' },
    }),
    prisma.talla.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getTallaById(id: number) {
  const talla = await prisma.talla.findUnique({
    where: { id_talla: id },
  });

  if (!talla) {
    throw new NotFoundError('Talla no encontrada');
  }

  return talla;
}

export async function createTalla(input: CreateTallaInput) {
  const existing = await prisma.talla.findUnique({
    where: { nombre_talla: input.nombre_talla },
  });

  if (existing) {
    throw new ConflictError('Ya existe una talla con ese nombre');
  }

  return prisma.talla.create({ data: input });
}

export async function updateTalla(id: number, input: Partial<CreateTallaInput>) {
  await getTallaById(id);
  return prisma.talla.update({
    where: { id_talla: id },
    data: input,
  });
}

export async function deleteTalla(id: number) {
  await getTallaById(id);

  const variantesCount = await prisma.variante.count({
    where: { id_talla: id },
  });

  if (variantesCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene variantes asociadas');
  }

  return prisma.talla.delete({
    where: { id_talla: id },
  });
}

// ============ PRODUCTOS ============

export async function getAllProductos(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.id_categoria && { id_categoria: parseInt(String(query.id_categoria)) }),
    ...(query.genero && { genero: String(query.genero) }),
    ...(query.search && {
      OR: [
        { nombre_producto: { contains: String(query.search) } },
        { referencia: { contains: String(query.search) } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        variantes: {
          include: {
            talla: true,
            color: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_creacion: 'desc' },
    }),
    prisma.producto.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getProductoById(id: number) {
  const producto = await prisma.producto.findUnique({
    where: { id_producto: id },
    include: {
      categoria: true,
      variantes: {
        include: {
          talla: true,
          color: true,
        },
      },
    },
  });

  if (!producto) {
    throw new NotFoundError('Producto no encontrado');
  }

  return producto;
}

export async function createProducto(input: CreateProductoInput) {
  const existing = await prisma.producto.findUnique({
    where: { referencia: input.referencia },
  });

  if (existing) {
    throw new ConflictError('Ya existe un producto con esa referencia');
  }

  return prisma.producto.create({
    data: {
      ...input,
      imagenes_urls: input.imagenes_urls ? JSON.stringify(input.imagenes_urls) : null,
    },
    include: { categoria: true },
  });
}

export async function updateProducto(id: number, input: Partial<CreateProductoInput>) {
  await getProductoById(id);
  const data: Record<string, unknown> = { ...input };
  if (input.imagenes_urls) {
    data.imagenes_urls = JSON.stringify(input.imagenes_urls);
  }
  return prisma.producto.update({
    where: { id_producto: id },
    data,
    include: { categoria: true },
  });
}

export async function deleteProducto(id: number) {
  await getProductoById(id);

  const variantesCount = await prisma.variante.count({
    where: { id_producto: id },
  });

  if (variantesCount > 0) {
    throw new ConflictError('No se puede eliminar: tiene variantes asociadas');
  }

  return prisma.producto.delete({
    where: { id_producto: id },
  });
}

// ============ VARIANTES ============

export async function getAllVariantes(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    ...(query.estado && { estado: String(query.estado) }),
    ...(query.id_producto && { id_producto: parseInt(String(query.id_producto)) }),
    ...(query.id_talla && { id_talla: parseInt(String(query.id_talla)) }),
    ...(query.id_color && { id_color: parseInt(String(query.id_color)) }),
  };

  const [data, total] = await Promise.all([
    prisma.variante.findMany({
      where,
      include: {
        producto: true,
        talla: true,
        color: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id_variante: 'asc' },
    }),
    prisma.variante.count({ where }),
  ]);

  return createPaginatedResult(data, total, { page, limit });
}

export async function getVarianteById(id: number) {
  const variante = await prisma.variante.findUnique({
    where: { id_variante: id },
    include: {
      producto: true,
      talla: true,
      color: true,
    },
  });

  if (!variante) {
    throw new NotFoundError('Variante no encontrada');
  }

  return variante;
}

export async function createVariante(input: CreateVarianteInput) {
  const existing = await prisma.variante.findUnique({
    where: {
      id_producto_id_talla_id_color: {
        id_producto: input.id_producto,
        id_talla: input.id_talla,
        id_color: input.id_color,
      },
    },
  });

  if (existing) {
    throw new ConflictError('Ya existe una variante con esa combinación');
  }

  return prisma.variante.create({
    data: input,
    include: {
      producto: true,
      talla: true,
      color: true,
    },
  });
}

export async function updateVariante(id: number, input: Partial<CreateVarianteInput>) {
  await getVarianteById(id);
  return prisma.variante.update({
    where: { id_variante: id },
    data: input,
    include: {
      producto: true,
      talla: true,
      color: true,
    },
  });
}

export async function deleteVariante(id: number) {
  await getVarianteById(id);
  return prisma.variante.update({
    where: { id_variante: id },
    data: { estado: 'Inactivo' },
  });
}

// ============ CATÁLOGO PÚBLICO (TIENDA) ============

export async function getCatalogoPublico(query: Record<string, unknown>) {
  const { page, limit } = getPaginationOptions(query);
  const where = {
    estado: 'Activo',
    ...(query.id_categoria && { id_categoria: parseInt(String(query.id_categoria)) }),
    ...(query.genero && { genero: String(query.genero) }),
    ...(query.search && {
      OR: [
        { nombre_producto: { contains: String(query.search) } },
        { descripcion: { contains: String(query.search) } },
      ],
    }),
  };

  const [data, total] = await Promise.all([
    prisma.producto.findMany({
      where,
      include: {
        categoria: true,
        variantes: {
          where: { estado: 'Activo', stock_actual: { gt: 0 } },
          include: {
            talla: true,
            color: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { fecha_creacion: 'desc' },
    }),
    prisma.producto.count({ where }),
  ]);

  // Filtrar productos sin variantes disponibles
  const filtered = data.filter((p) => p.variantes.length > 0);

  return createPaginatedResult(filtered, total, { page, limit });
}
