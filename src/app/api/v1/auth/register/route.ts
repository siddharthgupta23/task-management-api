import bcrypt from "bcryptjs";
import { withApi } from "@/lib/api-handler";
import { ApiError } from "@/lib/api-error";
import { created } from "@/lib/api-response";
import { signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validators/auth";
import { User } from "@/models/User";

export const POST = withApi(async (request, _context) => {
  const body = await request.json();
  const input = registerSchema.parse(body);

  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw ApiError.conflict("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: hashedPassword,
    role: "user",
  });

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return created({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});
