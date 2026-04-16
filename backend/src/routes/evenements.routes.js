import express from "express";
import {
  getAllEvenements,
  addEvenements,
  removeEvenements,
  editEvenement,
} from "../controllers/evenements.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { evenementsSchema } from "../validation/evenements.validation.js";

const router = express.Router();


router.get("/", getAllEvenements);

router.post("/add", authMiddleware, adminMiddleware, validate(evenementsSchema), addEvenements);
router.patch("/update/:id", authMiddleware, adminMiddleware, validate(evenementsSchema), editEvenement);
router.delete("/delete/:id", authMiddleware, adminMiddleware, removeEvenements);

export default router;