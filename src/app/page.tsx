import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">
          Scalable Task Management API
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Backend developer assignment built with Next.js App Router and MongoDB.
          Includes JWT authentication, role-based access (user / admin), versioned
          REST APIs, validation, and a simple UI to test all endpoints.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Get started
          </Link>
          <Link
            href="/docs"
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium hover:bg-slate-50"
          >
            API documentation
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Authentication",
            desc: "Register, login, bcrypt password hashing, JWT bearer tokens.",
          },
          {
            title: "Tasks CRUD",
            desc: "Create, read, update, delete tasks scoped per user.",
          },
          {
            title: "Admin RBAC",
            desc: "Admins can list all users and tasks via protected routes.",
          },
          {
            title: "API v1",
            desc: "Versioned routes, Zod validation, consistent error responses.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <h2 className="font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
