import { Router } from 'express';
import * as perdidaController from '../controllers/perdidaController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createPerdidaSchema, updatePerdidaSchema } from '../validators/perdida';

const router = Router();

router.use(authenticate);

router.get('/', authorize('perdidas', 'view'), perdidaController.getAll);
router.get('/:id', authorize('perdidas', 'view'), perdidaController.getById);
router.post('/', authorize('perdidas', 'create'), validate({ body: createPerdidaSchema }), perdidaController.create);
router.put('/:id', authorize('perdidas', 'edit'), validate({ body: updatePerdidaSchema }), perdidaController.update);
router.delete('/:id', authorize('perdidas', 'delete'), perdidaController.delete);
router.post('/:id/anular', authorize('perdidas', 'annul'), perdidaController.annul);

export default router;
