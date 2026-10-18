import { Router } from 'express';
import * as clienteController from '../controllers/clienteController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createClienteSchema, updateClienteSchema } from '../validators/cliente';

const router = Router();

router.use(authenticate);

router.get('/', authorize('clientes', 'view'), clienteController.getAll);
router.get('/:id', authorize('clientes', 'view'), clienteController.getById);
router.post('/', authorize('clientes', 'create'), validate({ body: createClienteSchema }), clienteController.create);
router.put('/:id', authorize('clientes', 'edit'), validate({ body: updateClienteSchema }), clienteController.update);
router.delete('/:id', authorize('clientes', 'delete'), clienteController.remove);

export default router;
