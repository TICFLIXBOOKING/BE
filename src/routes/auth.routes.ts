import { AuthController } from '@/controllers';
import { loginSchema, registerSchema } from '@/validation/auth/authValidation';
import validator from '@/validation/validator';
import { Router } from 'express';

const router = Router();
router.post('/register', validator(registerSchema), AuthController.register);
router.patch('/verify', AuthController.verify);
router.post('/login', validator(loginSchema), AuthController.login);
router.post('/google/login', AuthController.loginGoogle);
router.get('/google/callback', AuthController.callBackGoogle);
router.post('/private/refresh', AuthController.refreshToken);
router.post('/private/logout', AuthController.logout);

export default router;
