import { Router } from 'express';
import * as proveedorController from '../controllers/proveedorController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createProveedorSchema, updateProveedorSchema } from '../validators/proveedor';

const router = Router();

router.use(authenticate);

router.get('/', authorize('proveedores', 'view'), proveedorController.getAll);
router.get('/:id', authorize('proveedores', 'view'), proveedorController.getById);
router.post('/', authorize('proveedores', 'create'), validate({ body: createProveedorSchema }), proveedorController.create);
router.put('/:id', authorize('proveedores', 'edit'), validate({ body: updateProveedorSchema }), proveedorController.update);
router.delete('/:id', authorize('proveedores', 'delete'), proveedorController.remove);

export default router;
