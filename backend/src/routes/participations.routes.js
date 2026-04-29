import express from "express";
import { authMiddleware }  from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import {
  getParticipants,
  myParticipations,
  getMesDispos,
  saveDispos,
  removeParticipation,
} from "../controllers/participations.controller.js";

const router = express.Router();


router.get("/evenement/:id", authMiddleware, adminMiddleware, getParticipants);
router.get("/me", authMiddleware, myParticipations);
router.get("/:evenementId/dispos", authMiddleware, getMesDispos);
router.post("/:evenementId/dispos", authMiddleware, saveDispos);
router.delete("/:evenementId", authMiddleware, removeParticipation);

export default router;