import { AuthRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import User from '../models/User';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const updateSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const allowed = ['pseudo', 'mood', 'email'];
  const updates: any = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('updateSettings error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
