import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";


import gazetteRoutes from "./routes/gazette.routes.js";
import evenementRoutes from "./routes/evenements.routes.js";
import authRoutes from "./routes/auth.routes.js";
import participationRoutes from "./routes/participations.routes.js";


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
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/gazettes", gazetteRoutes);
app.use("/api/evenements", evenementRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/participations", participationRoutes);

app.use(express.static(path.join(__dirname, "../../frontend/html")));
app.use(express.static(path.join(__dirname, "../../frontend")));

app.get('/gazettes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/pages/gazettes.html'));
});
export default app;
