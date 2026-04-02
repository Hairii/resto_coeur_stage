import express from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authSchema } from "../validation/auth.validation.js";

const router = express.Router();

router.post("/login", validate(authSchema), login); 
router.post("/register", validate(authSchema), register);
router.post("/logout", logout);

export default router;