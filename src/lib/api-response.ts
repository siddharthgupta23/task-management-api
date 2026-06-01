import { NextResponse } from "next/server";
import { ApiError } from "./api-error";
import { ZodError } from "zod";

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T) {
  return success(data, 201);
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        errors: error.errors,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    error.errors.forEach((e) => {
      const key = e.path.join(".") || "body";
      if (!errors[key]) errors[key] = [];
      errors[key].push(e.message);
    });
    return NextResponse.json(
      { success: false, message: "Validation failed", errors },
      { status: 400 }
    );
  }

  console.error(error);
  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 }
  );
}
