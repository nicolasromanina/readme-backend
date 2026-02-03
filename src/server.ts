import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import moodRoutes from './routes/moodRoutes';
import journalRoutes from './routes/journalRoutes';
import ideaRoutes from './routes/ideaRoutes';
import settingsRoutes from './routes/settingsRoutes';

dotenv.config();

connectDB();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
