export const AREAS = [
  "Ayat","Arabsa","Bole","Mexico","Megenagna",
  "CMC","Gerji","Kazanchis","Piassa","4 Kilo",
];

const normalize = (s = "") => s.trim().toLowerCase();

export function revenueByArea(orders) {
  const totals = new Map(AREAS.map((a) => [a, 0]));
  for (const o of orders) {
    const match = AREAS.find((a) => normalize(a) === normalize(o.area));
    if (!match) continue;
    totals.set(match, totals.get(match) + (Number(o.total) || 0));
  }
  return AREAS.map((area) => ({ area, revenue: totals.get(area) }));
}

export function ordersPerDay(orders) {
  const totals = new Map();
  for (const o of orders) {
    const day = new Date(o.createdAt).toISOString().slice(0, 10);
    totals.set(day, (totals.get(day) ?? 0) + 1);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));
}
export function summarize(orders) {
  const live = orders.filter((o) => o.status !== "cancelled");
  return {
    totalRevenue: live.reduce((s, o) => s + (Number(o.total) || 0), 0),
    totalOrders: live.length,
  };
}

const SORTABLE = {
  id: (o) => o.id,
  area: (o) => normalize(o.area),
  total: (o) => Number(o.total) || 0,
  date: (o) => new Date(o.createdAt).getTime(),
};

export function sortOrders(orders, sort = "date", dir = "desc") {
  const key = SORTABLE[sort] ?? SORTABLE.date;
  const mul = dir === "asc" ? 1 : -1;
  return [...orders].sort((a, b) => {
    const A = key(a), B = key(b);
    return A < B ? -mul : A > B ? mul : 0;
  });
}