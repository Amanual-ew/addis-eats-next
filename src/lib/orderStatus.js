// src/lib/orderStatus.js  (REPLACE THE WHOLE FILE)
// Pure helpers, safe on server and client.

export const STATUSES = ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"];

// Steps shown on the tracking page (Cancelled is shown separately).
export const TRACK_STEPS = ["Pending", "Preparing", "On the way", "Delivered"];

// Turns whatever is stored ("pending", "On the way", "en_route"...) into one of STATUSES.
// Always returns one of the five names, never undefined.
export function normalizeStatus(raw) {
  const key = String(raw ?? "").toLowerCase().replace(/[\s_-]+/g, "");
  const map = {
    pending: "Pending",
    preparing: "Preparing",
    ontheway: "On the way",
    enroute: "On the way",
    outfordelivery: "On the way",
    delivered: "Delivered",
    cancelled: "Cancelled",
    canceled: "Cancelled",
  };
  return map[key] ?? "Pending";
}