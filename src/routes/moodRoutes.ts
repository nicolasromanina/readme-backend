import { Router } from 'express';
import { addMood, getMoods } from '../controllers/moodController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, addMood);
router.get('/', protect, getMoods);

export default router;
