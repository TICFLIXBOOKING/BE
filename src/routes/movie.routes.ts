import { MovieController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/create', MovieController.createMovie);

export default router;
