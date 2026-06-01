/**
 * Create an admin user. Run after MongoDB is up:
 *   node scripts/seed-admin.mjs
 *
 * Env: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const uri = process.env.MONGODB_URI ?? "mongodb://localhost:27017/task-api";
const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
const password = process.env.ADMIN_PASSWORD ?? "Admin1234";
const name = process.env.ADMIN_NAME ?? "Admin User";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

const User = mongoose.models.User ?? mongoose.model("User", UserSchema);

await mongoose.connect(uri);
const hashed = await bcrypt.hash(password, 12);
const existing = await User.findOne({ email });
if (existing) {
  existing.role = "admin";
  existing.password = hashed;
  await existing.save();
  console.log(`Updated admin: ${email}`);
} else {
  await User.create({ name, email, password: hashed, role: "admin" });
  console.log(`Created admin: ${email}`);
}
await mongoose.disconnect();
