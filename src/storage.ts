import { analyze, type Report } from "./diagnostics";
export const storageKey = "tech-scan-history-v2";
export function loadHistory(): Report[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (!Array.isArray(data)) return [];
    return data
      .filter(
        (r): r is Report =>
          !!r &&
          typeof r === "object" &&
          typeof r.id === "string" &&
          typeof r.date === "string" &&
          Number.isFinite(Date.parse(r.date)) &&
          ["Windows 11", "Windows 10", "macOS", "Linux"].includes(r.os) &&
          typeof r.device === "string" &&
          Array.isArray(r.selected) &&
          r.selected.every((s: unknown) => typeof s === "string") &&
          typeof r.log === "string",
      )
      .slice(0, 20)
      .map((r) => ({
        ...r,
        log: r.log.slice(0, 20000),
        result: analyze(r.selected, r.log.slice(0, 20000), r.os),
      }));
  } catch {
    return [];
  }
}
