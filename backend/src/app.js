import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import gazetteRoutes from './routes/gazette.routes.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());

app.use('/api/gazettes', gazetteRoutes);

export default app;