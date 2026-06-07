import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";

/**
 * POST /jwt
 * Original behavior: accepts any body object, signs it as JWT, returns { token }.
 */
const issueToken = catchAsync(async (req: Request, res: Response) => {
  const token = AuthService.issueToken(req.body);
  res.send({ token });
});

export const AuthController = { issueToken };
