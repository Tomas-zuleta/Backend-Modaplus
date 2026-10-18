import { Router } from 'express';
import * as ventaController from '../controllers/ventaController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createVentaSchema, anularVentaSchema } from '../validators/venta';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ventas', 'view'), ventaController.getAll);
router.get('/:id', authorize('ventas', 'view'), ventaController.getById);
router.post('/', authorize('ventas', 'create'), validate({ body: createVentaSchema }), ventaController.create);
router.post('/:id/anular', authorize('ventas', 'annul'), validate({ body: anularVentaSchema }), ventaController.anular);

export default router;
