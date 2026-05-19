import { Router } from "express";
import { login, me, register } from "../controllers/authController";
import { asyncHandler } from "../middleware/asyncHandler";
import { protect } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginValidator, registerValidator } from "../validators/authValidators";

export const authRoutes = Router();

authRoutes.post("/register", registerValidator, validate, asyncHandler(register));
authRoutes.post("/login", loginValidator, validate, asyncHandler(login));
authRoutes.get("/me", protect, asyncHandler(me));
