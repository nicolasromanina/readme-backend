import { Router } from 'express';
import { 
  registerUser, 
  loginUser, 
  getProfile, 
  updateAvatar 
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/avatar', protect, updateAvatar);

export default router;