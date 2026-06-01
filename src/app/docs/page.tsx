export default function DocsPage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">API Documentation</h1>
      <p className="mb-6 text-sm text-slate-600">
        OpenAPI 3 spec for <code className="rounded bg-slate-100 px-1">/api/v1</code>.
        Import <code className="rounded bg-slate-100 px-1">postman/collection.json</code> into
        Postman for ready-made requests. Raw spec:{" "}
        <a href="/api/docs/openapi.json" className="text-indigo-600 hover:underline">
          /api/docs/openapi.json
        </a>
      </p>
      <iframe
        title="Swagger API documentation"
        src="/api-docs.html"
        className="h-[calc(100vh-12rem)] w-full rounded-lg border border-slate-200 bg-white"
      />
    </div>
  );
}
