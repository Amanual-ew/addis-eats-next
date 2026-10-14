// src/lib/orders.js  (REPLACE)
import { dishes } from "./dishes";

// In-memory store, shared across routes in Next dev mode.
// Orders are lost when the server restarts.
// Bump KEY whenever the order shape changes so dev reseeds cleanly.
const g = globalThis;
const KEY = "__orders_v3";

const NEIGHBOURHOODS = ["Bole", "Kazanchis", "Megenagna", "Ayat", "CMC", "Gerji", "Piassa", "4 Kilo", "Arabsa", "Mexico"];

// 5 fixed sample orders, each with a different id, area and status.
// All belong to the customer account (usr_1) so they all show up in that user's "My Orders".
const SEED = [
  { id: "ord_1001", area: "Bole",      status: "Pending",    dish: 0, qty: 2, minutesAgo: 5 },
  { id: "ord_1002", area: "Kazanchis", status: "Preparing",  dish: 1, qty: 1, minutesAgo: 30 },
  { id: "ord_1003", area: "Megenagna", status: "On the way", dish: 2, qty: 3, minutesAgo: 60 },
  { id: "ord_1004", area: "CMC",       status: "Delivered",  dish: 3, qty: 1, minutesAgo: 24 * 60 },
  { id: "ord_1005", area: "Gerji",     status: "Cancelled",  dish: 4, qty: 2, minutesAgo: 2 * 24 * 60 },
];

if (!g[KEY]) {
  const now = Date.now();
  const minute = 60 * 1000;

  g[KEY] = SEED.map((s) => {
    const dish = dishes[s.dish % dishes.length];
    return {
      id: s.id,
      userId: "usr_1",
      name: "Almaz",
      phone: "0912345678",
      area: s.area,
      status: s.status,
      statusUpdatedAt: null,
      items: [
        { dishId: dish.id, name: dish.name, price: dish.price, quantity: s.qty },
      ],
      total: dish.price * s.qty,
      createdAt: new Date(now - s.minutesAgo * minute).toISOString(),
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
    statusUpdatedAt: null,
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