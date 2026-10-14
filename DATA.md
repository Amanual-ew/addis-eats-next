# DATA.md - Where Addis Eats data lives

Everything below is **in-memory server state**. It is shared between pages and API routes
(stored on `globalThis`) but it is **not persistent**: a server restart or a new deployment
resets it. See "Limits" at the end.

## 1. Stores

| Data | File | Stored on | Starts with |
|---|---|---|---|
| Users | `src/lib/users.js` | `globalThis.__users` | 2 seeded accounts: a customer (Almaz) and a staff account (Admin Staff) |
| Orders | `src/lib/orders.js` | `globalThis.__orders_v2` | 24 generated sample orders |
| Dishes | `src/lib/dishes` | module constant | the menu |

Bump the `KEY` in `orders.js` (`__orders_v2`) whenever the order shape changes so dev reseeds cleanly.

### User shape
```js
{ id: "usr_1", name, phone, role: "customer" | "staff", passwordHash /* bcrypt */ }
```

### Order shape
```js
{
  id: "ord_<timestamp>",
  userId,                 // owner (matches users[].id)
  name, phone,
  area,                   // one of the 10 neighbourhoods (see below)
  status,                 // see "Status" below
  statusUpdatedAt,        // ISO string or null - set whenever status changes
  items: [{ dishId, name, price, quantity }],
  total,                  // sum of price * quantity
  createdAt,              // ISO string
}
```
`isManualOverride` still exists on seeded orders. It is a leftover from the removed `advance`
system and nothing reads it.

### Delivery areas
`Bole, Kazanchis, Megenagna, Ayat, CMC, Gerji, Piassa, 4 Kilo, Arabsa, Mexico`.
`createOrder` falls back to the first one (Bole) if the area is not in the list. The tracking map
(`OrderTrackingMap.client.jsx`, `AREAS`) holds coordinates for the same ten names, so a new area
must be added in **both** places.

## 2. Order status

Canonical values (`src/lib/orderStatus.js`):
`Pending -> Preparing -> On the way -> Delivered`, plus `Cancelled`.

- Seeded orders store lowercase values (`pending`, `preparing`, `delivered`); new orders store
  `pending`; the kitchen board and the timer store the capitalised names.
- **Always read a status through `normalizeStatus(order.status)`** so all of those match. It always
  returns one of the five canonical names (unknown values become `Pending`).
- `order.status` is the **single source of truth**. Every page reads it; nothing keeps its own copy.

### Who writes the status
| Writer | Where | When |
|---|---|---|
| Delivery timer | `src/lib/simulateDelivery.js` | Started by the tracking stream when someone opens an order |
| Kitchen board | `PATCH /api/orders/[id]` (staff only) | Staff pick a status in the dropdown |
| Order creation | `createOrder()` | Sets `pending` |

Both writers set `statusUpdatedAt`, which the map uses to resume the courier's trip after a refresh.

### Delivery timer (demo)
Delays are in `DELAYS` at the top of `simulateDelivery.js`:

| Stays in | For | Then |
|---|---|---|
| Pending | 4 s | Preparing |
| Preparing | 8 s | On the way |
| On the way | 12 s (10 s trip + 2 s "Arrived") | Delivered |

It re-reads the order before each step, so a status staff changed in the meantime is respected.
Delivered and Cancelled stop the timer.

### Who reads the status
- Orders list (`/orders`): `GET /api/orders`, refreshed every 3 s.
- Tracking page (`/orders/[id]`): server render gives the first value; then
  `/api/tracking/stream?id=...` (the server checks the order every 1 s and sends an event on change).
- Kitchen board: server-rendered `orders` + `router.refresh()` every 3 s.

## 3. API endpoints

| Endpoint | Method | Who | Purpose |
|---|---|---|---|
| `/api/orders` | GET | signed in | the caller's own orders |
| `/api/orders` | POST | signed in | create an order (validated with `orderSchema`) |
| `/api/orders/[id]` | GET | owner or staff | one order |
| `/api/orders/[id]` | PATCH | staff | change status (must be one of `STATUSES`) |
| `/api/tracking/stream?id=` | GET (SSE) | anyone with the id* | live status events + starts the timer |
| `/api/auth/*` | - | - | see AUTH.md |

\* The stream and the tracking page do not check the session yet (see AUTH.md, "Known gaps").

## 4. Removed / obsolete
Delete these if they still exist in the project: `src/lib/tracking.js`,
`src/app/api/orders/[id]/advance`, `src/app/api/orders/[id]/resolve`, and the old
`src/app/api/orders/status` route (any copy that imports `lib/tracking`).

## 5. Limits and next step
- **In-memory only.** Orders and users are lost on restart. On Vercel each request can run on a
  different server instance, so data (and the timer's `setTimeout`) is not reliable there, and
  accounts created through sign-up may not exist on the next request. The seeded accounts always exist.
- Server-sent events are also cut off after a time limit on Vercel.
- **Next step for a deployed app:** move users and orders to a database (for example Neon or
  Vercel Postgres with Drizzle or Prisma), store `status` and `status_updated_at` there, and compute
  progress from timestamps on each request instead of with `setTimeout`.