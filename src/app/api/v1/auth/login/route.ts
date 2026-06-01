import bcrypt from "bcryptjs";
import { withApi } from "@/lib/api-handler";
import { ApiError } from "@/lib/api-error";
import { success } from "@/lib/api-response";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validators/auth";
import { User } from "@/models/User";

export const POST = withApi(async (request, _context) => {
  const body = await request.json();
  const input = loginSchema.parse(body);

  const user = await User.findOne({ email: input.email }).select("+password");
  if (!user || !(await bcrypt.compare(input.password, user.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return success({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});
