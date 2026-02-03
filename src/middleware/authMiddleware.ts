import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) return res.status(500).json({ error: 'Server misconfigured' });

      try {
        const decoded = jwt.verify(token, jwtSecret) as { id?: string };
        if (decoded?.id) {
          const user = await User.findById(decoded.id).select('-__v -password');
          if (!user) return res.status(401).json({ error: 'Not authorized, user not found' });
          req.user = user;
          return next();
        }
        return res.status(401).json({ error: 'Not authorized, token invalid' });
      } catch (err) {
        return res.status(401).json({ error: 'Not authorized, token failed' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ error: 'Not authorized, no token' });
};
