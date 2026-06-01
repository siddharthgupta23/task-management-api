import { z } from "zod";
import { sanitizeString } from "../sanitize";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200)
    .transform(sanitizeString),
  description: z
    .string()
    .max(2000)
    .optional()
    .transform((s) => (s ? sanitizeString(s) : "")),
  status: z.enum(["todo", "in_progress", "done"]).optional().default("todo"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
