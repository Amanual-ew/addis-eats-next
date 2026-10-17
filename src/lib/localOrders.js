import { useEffect, useState } from "react";
import useSWR from "swr";

// Keeps a copy of the customer's orders in the browser (localStorage).
//
// Why: on Vercel every request can be answered by a different server
// instance, and each instance has its own in-memory orders. An order placed
// on one instance can be "not found" on another. The browser copy is always
// there, so the order pages can fall back to it.

const KEY = "addis-eats:orders";
const EVENT = "addis-eats:orders-changed";
const MAX_ORDERS = 50;

const byNewest = (a, b) =>
  new Date(b.createdAt || 0) - new Date(a.createdAt || 0);

function readAll() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    const next = JSON.stringify(list.slice(0, MAX_ORDERS));
    // Nothing changed: skip the write and the event, so polling never loops.
    if (next === window.localStorage.getItem(KEY)) return;
    window.localStorage.setItem(KEY, next);
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // Storage full or blocked (private mode): the app still works with
    // whatever the server returns.
  }
}

// Save one or more orders. Existing copies are updated, not duplicated.
// Call it with the order returned by POST /api/orders (see CheckoutForm).
export function saveLocalOrders(orders) {
  if (typeof window === "undefined") return;
  const incoming = (orders ?? []).filter((o) => o && o.id);
  if (incoming.length === 0) return;

  const map = new Map(readAll().map((o) => [String(o.id), o]));
  for (const o of incoming) {
    const key = String(o.id);
    map.set(key, { ...map.get(key), ...o });
  }
  writeAll([...map.values()].sort(byNewest));
}

// Server orders win when both have the order (their status is fresher);
// orders only the browser knows about are kept. Newest first.
export function mergeOrders(serverOrders = [], localOrders = []) {
  const map = new Map(localOrders.map((o) => [String(o.id), o]));
  for (const o of serverOrders) {
    const key = String(o.id);
    map.set(key, { ...map.get(key), ...o });
  }
  return [...map.values()].sort(byNewest);
}

async function meFetcher(url) {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (res.status === 401) return { user: null };
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
}

// Same key as the header, so SWR shares one request between them.
export function useCurrentUserId() {
  const { data, error, isLoading } = useSWR("/api/auth/me", meFetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });
  return { userId: error ? null : data?.user?.id ?? null, loading: isLoading };
}

// This customer's orders from the browser. Only orders that belong to the
// signed-in user are returned, so a shared computer never mixes accounts.
export function useLocalOrders(userId) {
  const [orders, setOrders] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function load() {
      setOrders(userId ? readAll().filter((o) => o.userId === userId) : []);
      setReady(true);
    }
    load();
    window.addEventListener(EVENT, load); // same tab
    window.addEventListener("storage", load); // other tabs
    return () => {
      window.removeEventListener(EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [userId]);

  return { orders, ready };
}