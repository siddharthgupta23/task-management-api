# Task Management API — Backend Developer Assignment

Full-stack project built with **Next.js 15** (App Router) and **MongoDB**, demonstrating secure REST APIs with JWT authentication, role-based access control, and a simple UI for end-to-end testing.

## Features

| Area | Implementation |
|------|----------------|
| Auth | Register, login, bcrypt (12 rounds), JWT bearer tokens |
| RBAC | `user` vs `admin` — admins access `/api/v1/admin/*` |
| CRUD | Tasks entity with pagination and status filter |
| API design | Versioned `/api/v1`, consistent JSON responses, HTTP status codes |
| Validation | Zod schemas + input sanitization |
| Docs | Swagger UI at `/docs`, OpenAPI at `/api/docs/openapi.json`, Postman collection |
| Frontend | Register, login, JWT-protected dashboard, task CRUD, API error display |

## Project structure

```
src/
├── app/
│   ├── api/v1/          # Versioned REST API
│   │   ├── auth/
│   │   ├── tasks/
│   │   └── admin/
│   ├── dashboard/       # Protected UI
│   ├── docs/            # Swagger UI
│   └── ...
├── components/
├── context/             # Auth state (JWT in localStorage)
├── lib/                 # DB, auth, validators, API helpers
└── models/              # Mongoose User & Task schemas
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

## Quick start

### 1. Clone and install

```bash
npm install
```

### 2. Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/task-api
JWT_SECRET=change-this-to-a-long-random-string
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Start MongoDB

**Option A — Docker:**

```bash
docker compose up -d mongodb
```

**Option B — Local MongoDB** on port `27017`.

### 4. Seed admin user (optional)

```bash
node scripts/seed-admin.mjs
```

Default admin: `admin@example.com` / `Admin1234`

### 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API endpoints (v1)

Base URL: `http://localhost:3000/api/v1`

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register (role always `user`) |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | Bearer | Current user profile |

### Tasks (owner-scoped)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/tasks` | Bearer | List own tasks (`?status=&page=&limit=`) |
| POST | `/tasks` | Bearer | Create task |
| GET | `/tasks/:id` | Bearer | Get one task |
| PUT | `/tasks/:id` | Bearer | Update task |
| DELETE | `/tasks/:id` | Bearer | Delete task |

### Admin

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/admin/users` | Admin JWT | List all users |
| GET | `/admin/tasks` | Admin JWT | List all tasks |

### Response format

**Success:**

```json
{ "success": true, "data": { ... } }
```

**Error:**

```json
{ "success": false, "message": "...", "errors": { "field": ["..."] } }
```

## Documentation

- **Swagger UI:** [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON:** [http://localhost:3000/api/docs/openapi.json](http://localhost:3000/api/docs/openapi.json)
- **Postman:** Import `postman/collection.json` (login request auto-saves JWT to `{{token}}`)

## Security practices

- Passwords hashed with **bcrypt** (cost 12); never returned in API responses
- JWT signed with server secret; validated on protected routes
- Registration cannot self-assign `admin` role
- **Zod** validation on all write endpoints
- Basic **HTML tag stripping** on string inputs
- Tasks isolated by `userId` — users cannot access others' tasks

## Scalability notes

This monolith is structured for growth:

1. **Horizontal scaling** — Stateless API routes; JWT avoids server-side sessions. Deploy multiple Next.js instances behind a load balancer (nginx, AWS ALB).
2. **Database** — MongoDB replica set for HA; compound indexes on `userId` + `createdAt`. Shard by `userId` at high scale.
3. **Caching** — `docker-compose.yml` includes Redis. Next step: cache `GET /tasks` lists and invalidate on writes.
4. **Microservices** — Split `auth-service` and `task-service` with shared API gateway; keep `/api/v1` contract stable.
5. **Observability** — Add structured logging (Pino/Winston), request IDs, and APM (Datadog/New Relic).
6. **Deployment** — Containerize with Docker; use CI/CD to run `npm run build` and deploy to Vercel, Railway, or Kubernetes.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `node scripts/seed-admin.mjs` | Create/update admin user |

## Tech stack

- Next.js 15, React 19, TypeScript
- MongoDB + Mongoose
- JWT, bcryptjs, Zod
- Tailwind CSS
- Swagger UI

## License

MIT — assignment submission.
