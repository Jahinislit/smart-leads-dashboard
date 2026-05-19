import jwt, { type SignOptions } from "jsonwebtoken";
import type { Request, Response } from "express";
import { env } from "../config/env";
import { User, type UserDocument } from "../models/User";
import { AppError } from "../utils/AppError";
import { ok } from "../utils/apiResponse";

const signToken = (user: UserDocument): string => {
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"] };
  return jwt.sign({ id: user.id, role: user.role }, env.jwtSecret, options);
};

const authPayload = (user: UserDocument) => ({
  token: signToken(user),
  user: { id: user.id, name: user.name, email: user.email, role: user.role }
});

export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, role } = req.body as { name: string; email: string; password: string; role?: "admin" | "sales" };
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email is already registered", 409);

  const user = await User.create({ name, email, password, role: role ?? "sales" });
  res.status(201).json(ok(authPayload(user), "Registration successful"));
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401);
  }

  res.json(ok(authPayload(user), "Login successful"));
};

export const me = async (req: Request, res: Response): Promise<void> => {
  res.json(ok(req.user, "Authenticated user"));
};
