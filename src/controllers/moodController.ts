import { Request, Response } from 'express';
import Mood from '../models/Mood';
import { AuthRequest } from '../middleware/authMiddleware';

export const addMood = async (req: AuthRequest, res: Response) => {
  const { level, notes } = req.body;
  const userId = req.user?._id;

  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  if (!level || level < 1 || level > 5) return res.status(400).json({ error: 'level must be between 1 and 5' });

  try {
    const entry = await Mood.create({ userId, level, notes });
    const timestamp = entry.createdAt || new Date();
    const transformed = {
      id: entry._id.toString(),
      user_id: entry.userId.toString(),
      level: entry.level,
      notes: entry.notes,
      recorded_at: timestamp.toISOString(),
      created_at: timestamp.toISOString(),
    };
    res.status(201).json(transformed);
  } catch (error) {
    console.error('addMood error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMoods = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const moods = await Mood.find({ userId }).sort({ createdAt: -1 }).limit(50);
    const transformed = moods.map(mood => {
      const timestamp = mood.createdAt || new Date();
      return {
        id: mood._id.toString(),
        user_id: mood.userId.toString(),
        level: mood.level,
        notes: mood.notes,
        recorded_at: timestamp.toISOString(),
        created_at: timestamp.toISOString(),
      };
    });
    res.json(transformed);
  } catch (error) {
    console.error('getMoods error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
