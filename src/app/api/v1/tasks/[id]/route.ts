import { withApi } from "@/lib/api-handler";
import { authenticate } from "@/lib/auth";
import { ApiError } from "@/lib/api-error";
import { success } from "@/lib/api-response";
import { updateTaskSchema } from "@/lib/validators/task";
import { Task } from "@/models/Task";
import mongoose from "mongoose";

export const GET = withApi(async (request, context) => {
  const payload = authenticate(request);
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, userId: payload.userId });
  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  return success(task);
});

export const PUT = withApi(async (request, context) => {
  const payload = authenticate(request);
  const { id } = await context.params;
  const body = await request.json();
  const input = updateTaskSchema.parse(body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid task id");
  }

  const task = await Task.findOneAndUpdate(
    { _id: id, userId: payload.userId },
    { $set: input },
    { new: true, runValidators: true }
  );

  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  return success(task);
});

export const DELETE = withApi(async (request, context) => {
  const payload = authenticate(request);
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest("Invalid task id");
  }

  const task = await Task.findOneAndDelete({ _id: id, userId: payload.userId });
  if (!task) {
    throw ApiError.notFound("Task not found");
  }

  return success({ message: "Task deleted successfully" });
});
