import { Router } from 'express';
import * as devolucionController from '../controllers/devolucionController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createDevolucionSchema, updateDevolucionEstadoSchema } from '../validators/devolucion';

const router = Router();

router.use(authenticate);

router.get('/', authorize('devoluciones', 'view'), devolucionController.getAll);
router.get('/:id', authorize('devoluciones', 'view'), devolucionController.getById);
router.post('/', authorize('devoluciones', 'create'), validate({ body: createDevolucionSchema }), devolucionController.create);
router.patch('/:id/estado', authorize('devoluciones', 'edit'), validate({ body: updateDevolucionEstadoSchema }), devolucionController.updateEstado);

export default router;
