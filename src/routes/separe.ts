import { Router } from 'express';
import * as separeController from '../controllers/separeController';
import { validate } from '../middlewares';
import { authenticate, authorize } from '../middlewares/auth';
import { createPlanSepareSchema, updatePlanSepareEstadoSchema, createAbonoSchema } from '../validators/separe';

const router = Router();

router.use(authenticate);

// Planes separe
router.get('/planes', authorize('separe', 'view'), separeController.getAllPlanes);
router.get('/planes/:id', authorize('separe', 'view'), separeController.getPlanById);
router.post('/planes', authorize('separe', 'create'), validate({ body: createPlanSepareSchema }), separeController.createPlan);
router.patch('/planes/:id/estado', authorize('separe', 'edit'), validate({ body: updatePlanSepareEstadoSchema }), separeController.updatePlanEstado);

// Abonos
router.get('/planes/:id/abonos', authorize('abonos', 'view'), separeController.getAbonosByPlan);
router.post('/abonos', authorize('abonos', 'create'), validate({ body: createAbonoSchema }), separeController.createAbono);

export default router;
