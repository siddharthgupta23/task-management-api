import { withApi } from "@/lib/api-handler";
import { authenticate, requireAdmin } from "@/lib/auth";
import { success } from "@/lib/api-response";
import { Task } from "@/models/Task";

/** Admin: list all tasks across users */
export const GET = withApi(async (request, _context) => {
  const payload = authenticate(request);
  requireAdmin(payload);

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Task.countDocuments(),
  ]);

  return success({
    tasks,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
});
