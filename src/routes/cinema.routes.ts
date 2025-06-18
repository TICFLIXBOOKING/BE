import { CinemaController } from '@/controllers';
import { cinemaSchema } from '@/validation/Cinema/Cinema';
import validator from '@/validation/validator';
import { Router } from 'express';

const router = Router();

router.post('/create', validator(cinemaSchema), CinemaController.createCinema);
router.get('/:cinemaId/rooms', CinemaController.getRoomByCinema);

export default router;
