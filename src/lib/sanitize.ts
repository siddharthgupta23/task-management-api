/** Strip HTML tags and trim whitespace from string inputs */
export function sanitizeString(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "")
    .trim();
}

export function sanitizeOptionalString(
  value: string | undefined
): string | undefined {
  if (value === undefined) return undefined;
  return sanitizeString(value);
}
