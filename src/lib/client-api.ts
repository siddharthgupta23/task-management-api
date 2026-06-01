const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000");

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ClientApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...options,
    headers,
  });

  const json: ApiResult<T> = await res.json();

  if (!res.ok || !json.success) {
    throw new ClientApiError(
      json.message ?? "Request failed",
      res.status,
      json.errors
    );
  }

  return json.data as T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ user: AuthUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: (token: string) => request<AuthUser>("/auth/me", {}, token),

  getTasks: (token: string, params?: { status?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.status) q.set("status", params.status);
    if (params?.page) q.set("page", String(params.page));
    const query = q.toString() ? `?${q}` : "";
    return request<{ tasks: Task[]; pagination: { total: number; page: number } }>(
      `/tasks${query}`,
      {},
      token
    );
  },

  createTask: (
    token: string,
    body: {
      title: string;
      description?: string;
      status?: Task["status"];
      priority?: Task["priority"];
    }
  ) => request<Task>("/tasks", { method: "POST", body: JSON.stringify(body) }, token),

  updateTask: (
    token: string,
    id: string,
    body: Partial<{
      title: string;
      description: string;
      status: Task["status"];
      priority: Task["priority"];
    }>
  ) =>
    request<Task>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(body) }, token),

  deleteTask: (token: string, id: string) =>
    request<{ message: string }>(`/tasks/${id}`, { method: "DELETE" }, token),

  adminUsers: (token: string) =>
    request<{ users: AuthUser[]; count: number }>("/admin/users", {}, token),

  adminTasks: (token: string) =>
    request<{ tasks: Task[] }>("/admin/tasks", {}, token),
};
