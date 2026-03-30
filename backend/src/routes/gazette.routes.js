import express from "express";
import {
  getAllGazettes,
  addGazettes,
  getOneGazette,
  removeGazette,
} from "../controllers/gazette.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { gazetteSchema } from "../validation/gazettes.validation.js";

const router = express.Router();

router.post("/add", validate(gazetteSchema), addGazettes);
router.get("/", getAllGazettes);
router.get("/:id", getOneGazette);
router.delete("/delete/:id", removeGazette);

export default router;
