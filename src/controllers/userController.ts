import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middleware/authMiddleware';

const generateToken = (id: any) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET as string, {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response) => {
  const { pseudo, email, password } = req.body;

  if (!pseudo || !email || !password) {
    return res.status(400).json({ error: 'Please provide pseudo, email and password' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      pseudo,
      email,
      password: hashed,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });

    if (user && user.password && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        pseudo: user.pseudo,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authorized' });

  res.json({ _id: user._id, pseudo: user.pseudo, email: user.email });
};
