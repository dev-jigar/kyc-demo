export function buildQueryString(
  query: Record<string, string | number | boolean>,
) {
  const stringifiedQuery: Record<string, string> = {};

  // Convert all values to strings
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      stringifiedQuery[key] = String(value);
    }
  });

  return new URLSearchParams(stringifiedQuery).toString();
}
