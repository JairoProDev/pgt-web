/** json = Git files only. hybrid = CMS then JSON. payload = CMS only. */
export type ContentSource = "json" | "hybrid" | "payload";

export function contentSource(): ContentSource {
  const raw = (process.env.CONTENT_SOURCE ?? "json").toLowerCase();
  if (raw === "payload" || raw === "hybrid") return raw;
  return "json";
}

export function isCmsEnabled(): boolean {
  const source = contentSource();
  return source === "payload" || source === "hybrid";
}
