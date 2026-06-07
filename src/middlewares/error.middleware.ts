import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError";

interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  errors?: unknown[];
  stack?: string;
}

interface PrismaKnownError extends Error {
  code: string;
  meta?: { target?: string[] };
}

const isPrismaKnownError = (err: unknown): err is PrismaKnownError =>
  typeof err === "object" &&
  err !== null &&
  "code" in err &&
  typeof (err as PrismaKnownError).code === "string" &&
  (err as PrismaKnownError).code.startsWith("P");

const isPrismaValidationError = (err: unknown): boolean =>
  err instanceof Error &&
  err.constructor.name === "PrismaClientValidationError";

const handleZodError = (err: ZodError) => {
  const errors = err.errors.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  }));
  return new ApiError(400, "Validation Error", errors);
};

const handlePrismaKnownError = (err: PrismaKnownError) => {
  switch (err.code) {
    case "P2002": {
      const fields = err.meta?.target || [];
      return new ApiError(409, `Unique constraint failed on: ${fields.join(", ")}`);
    }
    case "P2025":
      return new ApiError(404, "Record not found");
    case "P2003":
      return new ApiError(400, "Foreign key constraint failed");
    case "P2016":
      return new ApiError(404, "Record not found");
    default:
      return new ApiError(500, `Database error: ${err.code}`);
  }
};

const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errors: unknown[] = [];

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof ZodError) {
    const apiError = handleZodError(err);
    statusCode = apiError.statusCode;
    message = apiError.message;
    errors = apiError.errors;
  } else if (isPrismaKnownError(err)) {
    const apiError = handlePrismaKnownError(err);
    statusCode = apiError.statusCode;
    message = apiError.message;
    errors = apiError.errors;
  } else if (isPrismaValidationError(err)) {
    statusCode = 400;
    message = "Database validation error";
  }

  const response: ErrorResponse = {
    success: false,
    message,
    statusCode,
    errors: errors.length > 0 ? errors : undefined,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
