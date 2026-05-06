import express from "express";
import { login, register, logout, me, refresh } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authSchema } from "../validation/auth.validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.post("/login",    validate(authSchema), login);
router.post("/refresh",  refresh);
router.post("/logout",   logout);
router.get("/me",        authMiddleware, me);

router.post("/register", authMiddleware, adminMiddleware, validate(authSchema), register);

export default router;