"use client";

import { etb, toCsv } from "@/lib/format";

const COLUMNS = [
  { key: "id", label: "Order" },
  { key: "area", label: "Area" },
  { key: "total", label: "Total (ETB)" },
  { key: "createdAt", label: "Placed" },
];

export default function CsvExportButton({ rows }) {
  function handleExport() {
    const csv = toCsv(rows, COLUMNS);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `addis-eats-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      Export CSV
    </button>
  );
}