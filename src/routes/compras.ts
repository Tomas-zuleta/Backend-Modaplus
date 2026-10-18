import { Router } from 'express';
import * as compraController from '../controllers/compraController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createCompraSchema } from '../validators/compra';

const router = Router();

router.use(authenticate);

router.get('/', authorize('compras', 'view'), compraController.getAll);
router.get('/:id', authorize('compras', 'view'), compraController.getById);
router.post('/', authorize('compras', 'create'), validate({ body: createCompraSchema }), compraController.create);
router.post('/:id/anular', authorize('compras', 'annul'), compraController.anular);

export default router;
