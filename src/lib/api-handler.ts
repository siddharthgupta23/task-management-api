import { NextRequest } from "next/server";
import { connectDB } from "./db";
import { handleApiError } from "./api-response";

type RouteContext = { params: Promise<Record<string, string>> };

type RouteHandler = (
  request: NextRequest,
  context: RouteContext
) => Promise<Response>;

export function withApi(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      await connectDB();
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
