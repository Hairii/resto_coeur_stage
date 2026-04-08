import express from "express";
import { login, register, logout, me  } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authSchema } from "../validation/auth.validation.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", validate(authSchema), login); 
router.post("/register", validate(authSchema), register);
router.post("/logout", logout);
router.get('/me', authMiddleware, me);

export default router;