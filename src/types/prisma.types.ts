/**
 * Prisma type shims — used for TypeScript compilation in environments where
 * `prisma generate` cannot run (CI without internet, sandboxes, etc.).
 * In production, delete this file and run `npx prisma generate` instead.
 *
 * These match exactly what Prisma generates from schema.prisma.
 */

export type UserRole = "student" | "tutor" | "admin";
export type UserStatus = "active" | "banned" | "suspended";
export type SessionStatus = "pending" | "approved" | "rejected";
export type PaymentMethod = "card" | "bkash" | "nagad" | "sslcommerz" | "cash";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// Prisma error classes (re-exported for use in error middleware)
export {
  PrismaClient,
  Prisma,
} from "@prisma/client";
