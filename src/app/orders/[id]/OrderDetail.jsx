// src/app/orders/[id]/OrderDetail.jsx  (NEW)
"use client";

import { useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";
import RequiresAuth from "@/components/RequiresAuth";
import StatusStream from "@/app/tracking/StatusStream";
import OrderTrackingMapWrapper from "./OrderTrackingMapWrapper";
import { normalizeStatus } from "@/lib/orderStatus";
import { etb, when } from "@/lib/format";
import {
  saveLocalOrders,
  useCurrentUserId,
  useLocalOrders,
} from "@/lib/localOrders";

// Starting position. Replace with real courier data when your backend provides it.
const COURIER = { name: "Abebe K.", lat: 9.0192, lng: 38.7525 };

// 404 is not an error here: it only means "this server instance does not
// have the order", so we return null and fall back to the browser copy.
async function fetchOrder(url) {
  const res = await fetch(url, {
    credentials: "include",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = new Error("Could not load the order.");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export default function OrderDetail({ id }) {
  const { userId, loading: userLoading } = useCurrentUserId();
  const { orders: localOrders, ready } = useLocalOrders(userId);

  const {
    data: serverOrder,
    error,
    isLoading,
  } = useSWR(`/api/orders/${encodeURIComponent(id)}`, fetchOrder, {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });

  // Whenever the server knows the order, refresh the browser copy.
  useEffect(() => {
    if (serverOrder) saveLocalOrders([serverOrder]);
  }, [serverOrder]);

  const order =
    serverOrder ??
    localOrders.find((o) => String(o.id) === String(id)) ??
    null;

  const checking = isLoading || userLoading || !ready;

  return (
    <RequiresAuth>
      <main className="mx-auto max-w-6xl space-y-8 p-6">
        <Link
          href="/orders"
          className="text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          &larr; Back to orders
        </Link>

        {order ? (
          <OrderView order={order} />
        ) : checking ? (
          <Skeleton />
        ) : (
          <Message
            title={error?.status === 403 ? "Not your order" : "Order not found"}
            text={
              error?.status === 403
                ? "This order belongs to another account."
                : `We couldn't find order #${id} on this device. Open it from your orders list.`
            }
          />
        )}
      </main>
    </RequiresAuth>
  );
}

function OrderView({ order }) {
  // The real status (the stream starts the timer that moves it forward).
  const status = normalizeStatus(order.status);

  // Works whether or not the order has a stored total.
  const total =
    order.total ??
    (order.items ?? []).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {etb(total)}
          {order.createdAt ? ` · Placed ${when(order.createdAt)}` : ""}
          {order.area ? ` · ${order.area}` : ""}
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderTrackingMapWrapper
            courier={COURIER}
            initialArea={order.area}
            initialStatus={status}
            orderId={String(order.id)}
          />
        </div>

        <aside className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">Live status</h2>
          <StatusStream
            initial={{
              orderId: String(order.id),
              status,
            }}
          />
        </aside>
      </section>
    </>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true">
      <div className="h-8 w-56 rounded bg-gray-200" />
      <div className="h-4 w-72 rounded bg-gray-200" />
      <div className="h-64 rounded-xl bg-gray-200" />
    </div>
  );
}

function Message({ title, text }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-sm"
    >
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">{text}</p>
      <Link
        href="/orders"
        className="mt-4 inline-block rounded-full bg-[#ff6f61] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#e65c50]"
      >
        Go to my orders
      </Link>
    </div>
  );
}