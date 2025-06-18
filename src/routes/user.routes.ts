import { UserController } from '@/controllers';
import { authenticate } from '@/middlewares/authenticationMiddleware';
import { setPasswordSchema } from '@/validation/auth/authValidation';
import validator from '@/validation/validator';
import { Router } from 'express';

const router = Router();

router.get('/private', authenticate, UserController.getMyProfile);
router.patch('/set-password', authenticate, validator(setPasswordSchema), UserController.setPassword);

export default router;
