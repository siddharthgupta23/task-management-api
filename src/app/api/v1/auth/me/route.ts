import { withApi } from "@/lib/api-handler";
import { authenticate } from "@/lib/auth";
import { success } from "@/lib/api-response";
import { User } from "@/models/User";
import { ApiError } from "@/lib/api-error";

export const GET = withApi(async (request, _context) => {
  const payload = authenticate(request);
  const user = await User.findById(payload.userId);
  if (!user) {
    throw ApiError.notFound("User not found");
  }

  return success({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});
