"use client";

import { Task } from "@/lib/client-api";

const statusColors: Record<Task["status"], string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

export function TaskList({
  tasks,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
        No tasks yet. Create your first task above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task._id}
          className="flex flex-col gap-2 rounded-lg border bg-white p-4 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <h3 className="font-medium text-slate-900">{task.title}</h3>
            {task.description && (
              <p className="mt-1 text-sm text-slate-600">{task.description}</p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[task.status]}`}
              >
                {task.status.replace("_", " ")}
              </span>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
                {task.priority}
              </span>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(task._id)}
              className="rounded border border-red-200 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
