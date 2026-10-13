// Single source of truth for all display formatting.

const etbFormatter = new Intl.NumberFormat("en-ET", {
  style: "currency",
  currency: "ETB",
  maximumFractionDigits: 0,
});

export function etb(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return etbFormatter.format(num);
}

export function when(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Addis_Ababa",   // pin — server/client must agree
  }).format(d);
}

/**
 * Relative time — CLIENT ONLY.
 * Calls Date.now(); running this during SSR causes hydration mismatches.
 * Gate with a mounted flag before use.
 */
export function relative(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  const sec = Math.round((Date.now() - d.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const table = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, secs] of table) {
    if (Math.abs(sec) >= secs) {
      return rtf.format(-Math.round(sec / secs), unit);
    }
  }
  return rtf.format(-sec, "second");   // always returns a string
}

// CSV cell — escapes quotes/newlines and protects long numeric IDs from Excel.
function csvCell(v) {
  let s = v == null ? "" : String(v);
  if (/^\d{10,}$/.test(s)) s = `="${s}"`;
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows, columns) {
  const head = columns.map((c) => csvCell(c.label)).join(",");
  const body = rows
    .map((row) => columns.map((c) => csvCell(row[c.key])).join(","))
    .join("\n");
  return `${head}\n${body}`;
}