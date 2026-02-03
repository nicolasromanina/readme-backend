import { AuthRequest } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import Idea from '../models/Idea';

export const createIdea = async (req: AuthRequest, res: Response) => {
  const { title, description, tags } = req.body;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });
  if (!title) return res.status(400).json({ error: 'title is required' });

  try {
    const idea = await Idea.create({ userId, title, description, tags });
    res.status(201).json(idea);
  } catch (error) {
    console.error('createIdea error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const listIdeas = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const ideas = await Idea.find({ userId }).sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    console.error('listIdeas error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateIdea = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const updated = await Idea.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (error) {
    console.error('updateIdea error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteIdea = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const deleted = await Idea.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('deleteIdea error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
