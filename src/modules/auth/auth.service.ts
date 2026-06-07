import jwt from "jsonwebtoken";
import { createToken } from "../../utils/jwt";

/**
 * Issues a JWT token for a given user payload.
 * Matches original POST /jwt endpoint behavior exactly.
 */
const issueToken = (payload: Record<string, unknown>): string => {
  const secret = process.env.ACCESS_SECRET_TOKEN as string;
  const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN || "1h";
  return createToken(payload, secret, expiresIn);
};

export const AuthService = { issueToken };
