import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getParticipants,
  saveParticipation,
  removeParticipation,
  myParticipations,
} from "../controllers/participations.controller.js";

const router = express.Router();

router.get("/evenement/:id", authMiddleware, getParticipants);   
router.get("/me", authMiddleware, myParticipations);              
router.post("/:evenementId", authMiddleware, saveParticipation);  
router.delete("/:evenementId", authMiddleware, removeParticipation);

export default router;