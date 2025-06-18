import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import cinemaRoutes from './cinema.routes';
import movieRoutes from './movie.routes';
import roomRoutes from './room.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/cinema', cinemaRoutes);
router.use('/movie', movieRoutes);
router.use('/room', roomRoutes);

export default router;
