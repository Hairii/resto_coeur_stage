import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  getParticipants,
  saveParticipation,
  removeParticipation,
  myParticipations,
} from "../controllers/participations.controller.js";

const router = express.Router();


router.get("/evenement/:id", authMiddleware, adminMiddleware, getParticipants);


router.get("/me", authMiddleware, myParticipations);
router.post("/:evenementId", authMiddleware, saveParticipation);
router.delete("/:evenementId", authMiddleware, removeParticipation);

export default router;