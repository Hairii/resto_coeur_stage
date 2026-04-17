import express from "express";
import { getBenevoles, createBenevole, removeBenevole } from "../controllers/benevoles.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authSchema } from "../validation/auth.validation.js";

const router = express.Router();

// Toutes les routes réservées à l'admin
router.get("/", authMiddleware, adminMiddleware, getBenevoles);
router.post("/", authMiddleware, adminMiddleware, validate(authSchema), createBenevole);
router.delete("/:id", authMiddleware, adminMiddleware, removeBenevole);

export default router;