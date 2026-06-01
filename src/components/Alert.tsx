export function Alert({
  type,
  message,
  errors,
}: {
  type: "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
}) {
  const styles =
    type === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-red-50 text-red-800 border-red-200";

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles}`} role="alert">
      <p>{message}</p>
      {errors && (
        <ul className="mt-2 list-inside list-disc">
          {Object.entries(errors).map(([field, msgs]) =>
            msgs.map((m) => (
              <li key={`${field}-${m}`}>
                {field}: {m}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
