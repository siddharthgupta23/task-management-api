import jwt, { type SignOptions } from "jsonwebtoken";
import { NextRequest } from "next/server";
import { ApiError } from "./api-error";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"] | undefined) ?? "7d";

export type UserRole = "user" | "admin";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }
}

export function getBearerToken(request: NextRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export function authenticate(request: NextRequest): JwtPayload {
  const token = getBearerToken(request);
  if (!token) {
    throw ApiError.unauthorized("Authentication required");
  }
  return verifyToken(token);
}

export function requireAdmin(payload: JwtPayload): void {
  if (payload.role !== "admin") {
    throw ApiError.forbidden("Admin access required");
  }
}
