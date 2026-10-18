import { Request, Response, NextFunction } from 'express';
import * as catalogoService from '../services/catalogoService';

// Categorías
export async function getAllCategorias(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.getAllCategorias(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getCategoriaById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.getCategoriaById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.createCategoria(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.updateCategoria(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategoria(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await catalogoService.deleteCategoria(id);
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    next(error);
  }
}

// Colores
export async function getAllColores(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.getAllColores(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getColorById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.getColorById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createColor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.createColor(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateColor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.updateColor(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteColor(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await catalogoService.deleteColor(id);
    res.json({ success: true, message: 'Color eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

// Tallas
export async function getAllTallas(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.getAllTallas(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getTallaById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.getTallaById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createTalla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.createTalla(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateTalla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.updateTalla(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteTalla(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await catalogoService.deleteTalla(id);
    res.json({ success: true, message: 'Talla eliminada correctamente' });
  } catch (error) {
    next(error);
  }
}

// Productos
export async function getAllProductos(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.getAllProductos(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getProductoById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.getProductoById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createProducto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.createProducto(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateProducto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.updateProducto(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteProducto(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await catalogoService.deleteProducto(id);
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}

// Variantes
export async function getAllVariantes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.getAllVariantes(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getVarianteById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.getVarianteById(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function createVariante(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.createVariante(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function updateVariante(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const result = await catalogoService.updateVariante(id, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function deleteVariante(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    await catalogoService.deleteVariante(id);
    res.json({ success: true, message: 'Variante inactivada correctamente' });
  } catch (error) {
    next(error);
  }
}

// Catálogo público
export async function getCatalogoPublico(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = await catalogoService.getCatalogoPublico(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
