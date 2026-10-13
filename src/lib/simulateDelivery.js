// src/lib/simulateDelivery.js  (NEW FILE)
// Demo progress: when someone opens an order, its status advances on a timer
// (Pending -> Preparing -> On the way -> Delivered). Each change is written to the
// shared order (order.status), so the tracking page, the orders list and the kitchen
// board all show the same thing. If staff change the status meanwhile, the timer
// simply continues from whatever the status is now.
import { orders } from "@/lib/orders";
import { normalizeStatus } from "@/lib/orderStatus";

const FLOW = ["Pending", "Preparing", "On the way", "Delivered"];

// How long an order stays in each status before moving to the next one (ms).
// "On the way" = 10s courier trip on the map + 2s to show "Arrived".
const DELAYS = {
  Pending: 4000,
  Preparing: 8000,
  "On the way": 12000,
};

// globalThis keeps one set of timers even across hot reloads / separate bundles.
const timers = (globalThis.__deliverySims ??= new Map());
const find = (id) => orders.find((o) => String(o.id) === String(id));

function schedule(id) {
  const key = String(id);
  const order = find(id);
  if (!order) {
    timers.delete(key);
    return;
  }

  const current = normalizeStatus(order.status);
  const delay = DELAYS[current];
  if (delay === undefined) {
    // Delivered or Cancelled: nothing left to do.
    timers.delete(key);
    return;
  }

  const timer = setTimeout(() => {
    // Look the order up again: it may have been replaced or edited meanwhile.
    const latest = find(id);
    if (!latest) {
      timers.delete(key);
      return;
    }
    // Advance only if nobody (e.g. staff) changed the status while we waited.
    if (normalizeStatus(latest.status) === current) {
      latest.status = FLOW[FLOW.indexOf(current) + 1];
      latest.statusUpdatedAt = new Date().toISOString();
    }
    schedule(id);
  }, delay);

  timers.set(key, timer);
}

// Call this whenever someone is watching an order. Safe to call many times.
export function ensureSimulation(id) {
  if (timers.has(String(id))) return;
  schedule(id);
}