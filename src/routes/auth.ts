import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middlewares';
import { authenticate } from '../middlewares/auth';
import { loginSchema, refreshTokenSchema, registerSchema } from '../validators/auth';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
router.post('/refresh-token', validate({ body: refreshTokenSchema }), authController.refreshToken);
router.post('/register', validate({ body: registerSchema }), authController.register);
router.get('/me', authenticate, authController.getMe);

export default router;
