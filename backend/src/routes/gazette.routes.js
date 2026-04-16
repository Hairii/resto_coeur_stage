import express from "express";
import {
  getAllGazettes,
  addGazettes,
  getOneGazette,
  removeGazette,
  editGazette,
} from "../controllers/gazette.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { gazetteSchema } from "../validation/gazettes.validation.js";
import upload from "../middlewares/upload.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Middleware  multer
const handleUpload = (req, res, next) => {
  upload.single("fichier_pdf")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.post(
  "/add",
  authMiddleware,
  handleUpload,
  validate(gazetteSchema),
  addGazettes,
);
router.get("/", getAllGazettes);
router.get("/:id", getOneGazette);
router.delete("/delete/:id", authMiddleware, adminMiddleware, removeGazette);
router.patch(
  "/update/:id",
  adminMiddleware,
  authMiddleware,
  validate(gazetteSchema.fork(["titre"], (s) => s.optional())),
  editGazette,
);

export default router;
