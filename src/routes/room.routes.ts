import { RoomController } from '@/controllers';
import { Router } from 'express';

const router = Router();

router.post('/create', RoomController.createRoom);
router.get('/:roomId', RoomController.getDetailedRoom);
router.patch('/:roomId', RoomController.updateRoom);

export default router;
