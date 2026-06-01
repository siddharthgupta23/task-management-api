export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description:
      "REST API with JWT authentication, role-based access, and task CRUD. Base path: /api/v1",
  },
  servers: [{ url: "/api/v1", description: "API v1" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] },
        },
      },
      Task: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          status: { type: "string", enum: ["todo", "in_progress", "done"] },
          priority: { type: "string", enum: ["low", "medium", "high"] },
          userId: { type: "string" },
        },
      },
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: { type: "object" },
        },
      },
    },
  },
  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          "201": { description: "User created" },
          "400": { description: "Validation error" },
          "409": { description: "Email exists" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: { "200": { description: "Login success" } },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        security: [{ bearerAuth: [] }],
        summary: "Current user profile",
        responses: { "200": { description: "Profile" } },
      },
    },
    "/tasks": {
      get: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        summary: "List own tasks",
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { "200": { description: "Task list" } },
      },
      post: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        summary: "Create task",
        requestBody: {
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Task" },
            },
          },
        },
        responses: { "201": { description: "Created" } },
      },
    },
    "/tasks/{id}": {
      get: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Task" } },
      },
      put: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Updated" } },
      },
      delete: {
        tags: ["Tasks"],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "Deleted" } },
      },
    },
    "/admin/users": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "List all users (admin)",
        responses: { "200": { description: "Users" }, "403": { description: "Forbidden" } },
      },
    },
    "/admin/tasks": {
      get: {
        tags: ["Admin"],
        security: [{ bearerAuth: [] }],
        summary: "List all tasks (admin)",
        responses: { "200": { description: "Tasks" }, "403": { description: "Forbidden" } },
      },
    },
  },
};
