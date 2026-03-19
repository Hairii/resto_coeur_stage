import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import gazetteRoutes from './routes/gazette.routes.js';
import evenementRoutes from './routes/evenements.routes.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use ('/api/evenements', evenementRoutes);



app.use(express.static(path.join(__dirname, '../../frontend')));

export default app;