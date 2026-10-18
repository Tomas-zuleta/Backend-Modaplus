import { Router } from 'express';
import * as catalogoController from '../controllers/catalogoController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import {
  createCategoriaSchema,
  updateCategoriaSchema,
  createColorSchema,
  updateColorSchema,
  createTallaSchema,
  updateTallaSchema,
  createProductoSchema,
  updateProductoSchema,
  createVarianteSchema,
  updateVarianteSchema,
} from '../validators/catalogo';

const router = Router();

// Catálogo público (sin autenticación)
router.get('/publico', catalogoController.getCatalogoPublico);

router.use(authenticate);

// Categorías
router.get('/categorias', authorize('categorias', 'view'), catalogoController.getAllCategorias);
router.get('/categorias/:id', authorize('categorias', 'view'), catalogoController.getCategoriaById);
router.post('/categorias', authorize('categorias', 'create'), validate({ body: createCategoriaSchema }), catalogoController.createCategoria);
router.put('/categorias/:id', authorize('categorias', 'edit'), validate({ body: updateCategoriaSchema }), catalogoController.updateCategoria);
router.delete('/categorias/:id', authorize('categorias', 'delete'), catalogoController.deleteCategoria);

// Colores
router.get('/colores', authorize('colores', 'view'), catalogoController.getAllColores);
router.get('/colores/:id', authorize('colores', 'view'), catalogoController.getColorById);
router.post('/colores', authorize('colores', 'create'), validate({ body: createColorSchema }), catalogoController.createColor);
router.put('/colores/:id', authorize('colores', 'edit'), validate({ body: updateColorSchema }), catalogoController.updateColor);
router.delete('/colores/:id', authorize('colores', 'delete'), catalogoController.deleteColor);

// Tallas
router.get('/tallas', authorize('tallas', 'view'), catalogoController.getAllTallas);
router.get('/tallas/:id', authorize('tallas', 'view'), catalogoController.getTallaById);
router.post('/tallas', authorize('tallas', 'create'), validate({ body: createTallaSchema }), catalogoController.createTalla);
router.put('/tallas/:id', authorize('tallas', 'edit'), validate({ body: updateTallaSchema }), catalogoController.updateTalla);
router.delete('/tallas/:id', authorize('tallas', 'delete'), catalogoController.deleteTalla);

// Productos
router.get('/productos', authorize('inventario', 'view'), catalogoController.getAllProductos);
router.get('/productos/:id', authorize('inventario', 'view'), catalogoController.getProductoById);
router.post('/productos', authorize('inventario', 'create'), validate({ body: createProductoSchema }), catalogoController.createProducto);
router.put('/productos/:id', authorize('inventario', 'edit'), validate({ body: updateProductoSchema }), catalogoController.updateProducto);
router.delete('/productos/:id', authorize('inventario', 'delete'), catalogoController.deleteProducto);

// Variantes
router.get('/variantes', authorize('inventario', 'view'), catalogoController.getAllVariantes);
router.get('/variantes/:id', authorize('inventario', 'view'), catalogoController.getVarianteById);
router.post('/variantes', authorize('inventario', 'create'), validate({ body: createVarianteSchema }), catalogoController.createVariante);
router.put('/variantes/:id', authorize('inventario', 'edit'), validate({ body: updateVarianteSchema }), catalogoController.updateVariante);
router.delete('/variantes/:id', authorize('inventario', 'delete'), catalogoController.deleteVariante);

export default router;
