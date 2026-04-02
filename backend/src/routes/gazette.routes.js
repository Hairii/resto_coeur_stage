import express from "express";
import {
  getAllGazettes,
  addGazettes,
  getOneGazette,
  removeGazette,
} from "../controllers/gazette.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { gazetteSchema } from "../validation/gazettes.validation.js";

import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/add", authMiddleware, upload.single('fichier_pdf'), validate(gazetteSchema), addGazettes);
router.get("/", getAllGazettes);
router.get("/:id", getOneGazette);
router.delete("/delete/:id", authMiddleware, removeGazette);

export default router;
