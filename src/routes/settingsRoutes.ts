import { Router } from 'express';
import { updateSettings } from '../controllers/settingsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.put('/', protect, updateSettings);

export default router;
