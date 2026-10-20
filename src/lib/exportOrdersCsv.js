const STATUS_LABELS = {
  pending: "Pending",
  preparing: "Preparing",
  ontheway: "On the way",
  enroute: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  canceled: "Cancelled",
};

function statusLabel(raw) {
  const key = String(raw ?? "").toLowerCase().replace(/[\s_-]+/g, "");
  return STATUS_LABELS[key] ?? "Pending";
}

// Quote cells with commas/quotes/newlines; neutralise values Excel would run as formulas
function cell(value) {
  let str = value == null ? "" : String(value);
  if (/^[=@]/.test(str)) str = `'${str}`;
  return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function exportOrdersToCsv(orders, filename = "orders.csv") {
  if (!orders?.length) return;

  const headers = [
    "Order ID",
    "Status",
    "Customer",
    "Phone",
    "Delivery Area",
    "Items",
    "Total (ETB)",
  ];

  const rows = orders.map((order) => {
    const items = order.items ?? [];
    const total = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    return [
      order.id,
      statusLabel(order.status),
      order.name,
      order.phone,
      order.area,
      items.map((i) => `${i.name} x${i.quantity ?? 1}`).join("; "),
      total,
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");

  // BOM so Excel reads UTF-8 (Amharic names) correctly
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}