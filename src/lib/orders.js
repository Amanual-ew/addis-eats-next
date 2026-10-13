// src/lib/orders.js
import { dishes } from "./dishes";

// In-memory store, shared across routes in Next dev mode.
// Orders are lost when the server restarts.
// Bump KEY whenever the order shape changes so dev reseeds cleanly.
const g = globalThis;
const KEY = "__orders_v2";

const NEIGHBOURHOODS = ["Bole", "Kazanchis", "Megenagna","Ayat", "CMC", "Gerji", "Piassa", "4 Kilo", "Arabsa", "Mexico"];
const STATUSES = ["pending", "preparing", "delivered"];

if (!g[KEY]) {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  g[KEY] = Array.from({ length: 24 }, (_, i) => {
    const dish = dishes[i % 6];
    const qty = 1 + (i % 3);
    return {
      id: `ord_${now - i * day}`,
      userId: i % 4 === 0 ? "usr_2" : "usr_1",
      name: i % 4 === 0 ? "Admin Staff" : "Almaz",
      phone: i % 4 === 0 ? "0911000000" : "0912345678",
      area: pick(NEIGHBOURHOODS),
      status: pick(STATUSES),
      statusUpdatedAt: null,       // ← new
      isManualOverride: false,
      items: [
        { dishId: dish.id, name: dish.name, price: dish.price, quantity: qty },
      ],
      total: dish.price * qty,
      createdAt: new Date(now - i * day).toISOString(),
    };
  });
}

export const orders = g[KEY];

// ---------- create ----------
export function createOrder({ userId, name, phone, area, items }) {
  const total = items.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 1),
    0
  );
  const order = {
    id: `ord_${Date.now()}`,
    userId,
    name,
    phone,
    area: NEIGHBOURHOODS.includes(area) ? area : NEIGHBOURHOODS[0],
    status: "pending",
    items,
    total,
    createdAt: new Date().toISOString(),
  };
  orders.unshift(order);
  return order;
}

// ---------- reads ----------
export function getOrderById(id) {
  return orders.find((o) => o.id === id) ?? null;
}

export function getOrdersByUser(userId) {
  return orders.filter((o) => o.userId === userId);
}

// ---------- sort + page ----------
const SORTABLE = {
  date: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  total: (a, b) => (Number(a.total) || 0) - (Number(b.total) || 0),
  id: (a, b) => a.id.localeCompare(b.id),
};

export function getOrdersFor(userId, params = {}) {
  const sortKey = SORTABLE[params.sort] ? params.sort : "date";
  const dir = params.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(params.page) || 1);
  const take = 10;

  let rows = getOrdersByUser(userId).slice();
  rows.sort(SORTABLE[sortKey]);
  if (dir === "desc") rows.reverse();

  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / take));
  const start = (page - 1) * take;
  rows = rows.slice(start, start + take);

  return { rows, total, page, sort: sortKey, dir, pages };
}