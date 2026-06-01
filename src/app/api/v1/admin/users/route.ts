import { withApi } from "@/lib/api-handler";
import { authenticate, requireAdmin } from "@/lib/auth";
import { success } from "@/lib/api-response";
import { User } from "@/models/User";

/** Admin: list all users */
export const GET = withApi(async (request, _context) => {
  const payload = authenticate(request);
  requireAdmin(payload);

  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  return success({ users, count: users.length });
});
