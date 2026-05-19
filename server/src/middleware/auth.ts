import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User, type UserRole } from "../models/User";
import { AppError } from "../utils/AppError";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;
    if (!token) throw new AppError("Authentication token is required", 401);

    const decoded = jwt.verify(token, env.jwtSecret) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) throw new AppError("User no longer exists", 401);

    req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Invalid or expired token", 401));
  }
};

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError("You do not have permission to perform this action", 403));
      return;
    }
    next();
  };
