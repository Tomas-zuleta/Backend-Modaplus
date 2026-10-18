import { Router } from 'express';
import * as rolController from '../controllers/rolController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createRolSchema, updateRolSchema } from '../validators/rol';

const router = Router();

router.use(authenticate);

router.get('/', authorize('roles', 'view'), rolController.getAll);
router.get('/:id', authorize('roles', 'view'), rolController.getById);
router.post('/', authorize('roles', 'create'), validate({ body: createRolSchema }), rolController.create);
router.put('/:id', authorize('roles', 'edit'), validate({ body: updateRolSchema }), rolController.update);
router.delete('/:id', authorize('roles', 'delete'), rolController.remove);

export default router;
