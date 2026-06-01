import { withApi } from "@/lib/api-handler";
import { authenticate } from "@/lib/auth";
import { created, success } from "@/lib/api-response";
import { createTaskSchema } from "@/lib/validators/task";
import { Task } from "@/models/Task";

export const GET = withApi(async (request, _context) => {
  const payload = authenticate(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = { userId: payload.userId };
  if (status && ["todo", "in_progress", "done"].includes(status)) {
    filter.status = status;
  }

  const [tasks, total] = await Promise.all([
    Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);

  return success({
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const POST = withApi(async (request, _context) => {
  const payload = authenticate(request);
  const body = await request.json();
  const input = createTaskSchema.parse(body);

  const task = await Task.create({
    ...input,
    userId: payload.userId,
  });

  return created(task);
});
