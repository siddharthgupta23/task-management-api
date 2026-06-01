"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/Alert";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { useAuth } from "@/context/AuthContext";
import { api, ClientApiError, Task } from "@/lib/client-api";

export default function DashboardPage() {
  const { user, token, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editing, setEditing] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState<{ name: string; email: string; role: string }[]>([]);

  const loadTasks = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.getTasks(token, {
        status: statusFilter || undefined,
      });
      setTasks(res.tasks);
    } catch (err) {
      const text =
        err instanceof ClientApiError ? err.message : "Failed to load tasks";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (token) loadTasks();
  }, [token, loadTasks]);

  useEffect(() => {
    if (user?.role === "admin" && token) {
      api.adminUsers(token).then((r) => setAdminUsers(r.users)).catch(() => {});
    }
  }, [user, token]);

  async function handleCreate(data: {
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
  }) {
    if (!token) return;
    setMessage(null);
    try {
      await api.createTask(token, data);
      setMessage({ type: "success", text: "Task created" });
      await loadTasks();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ClientApiError ? err.message : "Create failed",
      });
    }
  }

  async function handleUpdate(data: {
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
  }) {
    if (!token || !editing) return;
    setMessage(null);
    try {
      await api.updateTask(token, editing._id, data);
      setMessage({ type: "success", text: "Task updated" });
      setEditing(null);
      await loadTasks();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ClientApiError ? err.message : "Update failed",
      });
    }
  }

  async function handleDelete(id: string) {
    if (!token || !confirm("Delete this task?")) return;
    setMessage(null);
    try {
      await api.deleteTask(token, id);
      setMessage({ type: "success", text: "Task deleted" });
      await loadTasks();
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof ClientApiError ? err.message : "Delete failed",
      });
    }
  }

  if (authLoading || !user) {
    return <p className="text-slate-500">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Welcome, {user.name}. JWT-protected task management.
        </p>
      </div>

      {message && <Alert type={message.type} message={message.text} />}

      {user.role === "admin" && adminUsers.length > 0 && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <h2 className="font-semibold text-amber-900">Admin: registered users</h2>
          <ul className="mt-2 text-sm text-amber-800">
            {adminUsers.map((u) => (
              <li key={u.email}>
                {u.name} ({u.email}) — {u.role}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-700">Filter by status</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {editing ? (
        <div>
          <h2 className="mb-2 font-semibold">Edit task</h2>
          <TaskForm
            initial={editing}
            submitLabel="Update"
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <div>
          <h2 className="mb-2 font-semibold">New task</h2>
          <TaskForm onSubmit={handleCreate} submitLabel="Create task" />
        </div>
      )}

      <section>
        <h2 className="mb-3 font-semibold">Your tasks</h2>
        {loading ? (
          <p className="text-slate-500">Loading tasks…</p>
        ) : (
          <TaskList tasks={tasks} onEdit={setEditing} onDelete={handleDelete} />
        )}
      </section>
    </div>
  );
}
