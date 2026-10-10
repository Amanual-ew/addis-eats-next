// Only allows same-origin relative paths.
// Blocks:
//   - absolute URLs:         https://evil.com
//   - protocol-relative:     //evil.com
//   - backslash tricks:      /\evil.com
//   - double-encoded paths:  %252Fevil.com  (decoded once, then re-checked)
const FALLBACK = "/";

export function safeNext(raw, fallback = FALLBACK) {
  if (typeof raw !== "string" || !raw) return fallback;

  let next = raw;

  // Some callers may double-encode. Decode up to 2 passes.
  for (let i = 0; i < 2 && next.includes("%"); i++) {
    try {
      const decoded = decodeURIComponent(next);
      if (decoded === next) break;
      next = decoded;
    } catch {
      break;
    }
  }

  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (next.startsWith("/\\")) return fallback;

  return next;
}