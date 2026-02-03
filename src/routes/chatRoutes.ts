import { Router } from 'express';
import { chatWithAI, listMessages, saveMessage, clearMessages } from '../controllers/chatController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, chatWithAI);
router.get('/messages', protect, listMessages);
router.post('/save', protect, saveMessage);
router.delete('/messages', protect, clearMessages);

export default router;
