import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../utils/ApiError";
import prisma from "../config/db";

// Extend Express Request to carry decoded user
declare global {
  namespace Express {
    interface Request {
      decoded?: JwtPayload & { email?: string; role?: string };
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Verifies the JWT access token.
 * Mirrors original behavior: reads from Authorization header, sets req.decoded.
 */
export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(401)
      .json({ message: "Forbidden Access: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Forbidden Access: Malformed token" });
    return;
  }

  jwt.verify(
    token,
    process.env.ACCESS_SECRET_TOKEN as string,
    (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({ message: "Forbidden Access: Invalid token" });
        return;
      }
      req.decoded = decoded as JwtPayload;
      next();
    }
  );
};

/**
 * Verifies the user has the required role.
 * Mirrors original signature: verifyRole(role).
 * Fixed: now uses req.decoded (not req.user) to be consistent with verifyToken.
 */
export const verifyRole =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.decoded?.email;
      if (!email) {
        res
          .status(401)
          .json({ message: "Forbidden Access: No user in token" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user || !roles.includes(user.role)) {
        res
          .status(403)
          .json({ message: "Forbidden Access: Unauthorized role" });
        return;
      }

      req.user = { id: user.id, email: user.email, role: user.role };
      next();
    } catch (error) {
      next(error);
    }
  };
