import { Router } from 'express';
import { createEntry, listEntries, getEntry, updateEntry, deleteEntry } from '../controllers/journalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createEntry);
router.get('/', protect, listEntries);
router.get('/:id', protect, getEntry);
router.put('/:id', protect, updateEntry);
router.delete('/:id', protect, deleteEntry);

export default router;
