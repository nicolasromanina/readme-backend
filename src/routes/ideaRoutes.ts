import { Router } from 'express';
import { createIdea, listIdeas, updateIdea, deleteIdea } from '../controllers/ideaController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createIdea);
router.get('/', protect, listIdeas);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);

export default router;
