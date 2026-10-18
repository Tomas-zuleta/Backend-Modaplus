import { Router } from 'express';
import * as usuarioController from '../controllers/usuarioController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createUsuarioSchema, updateUsuarioSchema, updateContrasenaSchema } from '../validators/usuario';

const router = Router();

router.use(authenticate);

router.get('/', authorize('usuarios', 'view'), usuarioController.getAll);
router.get('/:id', authorize('usuarios', 'view'), usuarioController.getById);
router.post('/', authorize('usuarios', 'create'), validate({ body: createUsuarioSchema }), usuarioController.create);
router.put('/:id', authorize('usuarios', 'edit'), validate({ body: updateUsuarioSchema }), usuarioController.update);
router.put('/:id/contrasena', authorize('usuarios', 'edit'), validate({ body: updateContrasenaSchema }), usuarioController.updateContrasena);
router.delete('/:id', authorize('usuarios', 'delete'), usuarioController.remove);

export default router;
