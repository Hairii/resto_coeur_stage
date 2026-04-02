import express from "express";
import {
  getAllEvenements,
  addEvenements,
  removeEvenements,
} from "../controllers/evenements.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { evenementsSchema } from "../validation/evenements.validation.js";

const router = express.Router();

router.post("/add", authMiddleware, validate(evenementsSchema), addEvenements);
router.get("/", getAllEvenements);
router.delete("/delete/:id", authMiddleware, removeEvenements);

export default router;
