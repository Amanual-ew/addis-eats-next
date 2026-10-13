// src/app/orders/page.js  (REPLACE) - compact, status from order.status, cannot crash on odd statuses
"use client";

import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

// Keyed by the status with spaces/underscores/capitals removed, so
// "pending", "Pending", "On the way", "on_the_way" and "en_route" all work.
const STATUS_UI = {
  pending: { label: "Pending", icon: "🕐", badge: "bg-gray-100 text-gray-700" },
  preparing: { label: "Preparing", icon: "👨‍🍳", badge: "bg-yellow-50 text-yellow-700" },
  ontheway: { label: "On the way", icon: "🛵", badge: "bg-blue-50 text-blue-700" },
  enroute: { label: "On the way", icon: "🛵", badge: "bg-blue-50 text-blue-700" },
  delivered: { label: "Delivered", icon: "✅", badge: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", icon: "❌", badge: "bg-red-50 text-red-600" },
  canceled: { label: "Cancelled", icon: "❌", badge: "bg-red-50 text-red-600" },
};

function statusUi(raw) {
  const key = String(raw ?? "").toLowerCase().replace(/[\s_-]+/g, "");
  return STATUS_UI[key] ?? STATUS_UI.pending; // unknown status -> Pending, never undefined
}

export default function OrdersPage() {
  // Same data the kitchen board edits; re-checked every 3s so status changes show up.
  const { data, error, isLoading, mutate } = useSWR("/api/orders", fetcher, {
    refreshInterval: 3000,
  });

  // Accept either [...] or { orders: [...] }; anything else counts as "no orders".
  const orders = Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6">
            <div className="h-7 w-40 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-3 w-60 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-4">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl bg-white p-4 shadow-sm"
              >
                <div className="mb-3 h-5 w-32 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200" />
                <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mb-2 text-3xl">⚠️</div>

            <h1 className="text-lg font-bold text-red-700">
              Unable to load orders
            </h1>

            <p className="mt-1 text-sm text-red-600">
              Something went wrong while loading your orders.
            </p>

            <button
              onClick={() => mutate()}
              className="mt-4 rounded-lg bg-[#ff6f61] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#e65c50]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#ff6f61]">
              Addis Eats
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              My Orders 📦
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track your recent food orders and their status.
            </p>
          </div>

          <button
            onClick={() => mutate()}
            className="w-fit rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#ff6f61] hover:text-[#ff6f61]"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-10 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-3xl">
              🍽️
            </div>

            <h2 className="text-lg font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              You haven't placed an order yet. Browse our menu and
              discover something delicious.
            </p>

            <Link
              href="/menu"
              className="mt-4 inline-block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-6 py-2 text-sm font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95"
            >
              Browse Menu 🍴
            </Link>
          </div>
        ) : (
          /* Orders */
          <div className="space-y-4">
            {orders.map((order) => {
              const items = order.items ?? [];

              const total = items.reduce(
                (sum, item) =>
                  sum + (item.price || 0) * (item.quantity || 1),
                0
              );

              const ui = statusUi(order.status);

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Order top */}
                  <div className="border-b border-gray-100 px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Order</p>

                        <Link href={`/orders/${order.id}`}>
                          <h2 className="text-base font-bold text-gray-900 transition hover:text-[#ff6f61]">
                            #{order.id} →
                          </h2>
                        </Link>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${ui.badge}`}
                      >
                        {ui.icon} {ui.label}
                      </span>
                    </div>
                  </div>

                  {/* Customer information */}
                  <div className="grid gap-3 border-b border-gray-100 px-4 py-3 sm:grid-cols-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Customer
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {order.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Phone
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {order.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        Delivery Area
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {order.area}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-4 py-3">
                    <h3 className="mb-2 text-sm font-bold text-gray-900">
                      Order Items
                    </h3>

                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.name}
                            </p>

                            {item.price && (
                              <p className="text-xs text-gray-500">
                                {item.price} ETB each
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-800">
                              × {item.quantity ?? 1}
                            </p>

                            {item.price && (
                              <p className="text-xs text-gray-500">
                                {item.price * (item.quantity ?? 1)} ETB
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between bg-gray-900 px-4 py-2.5 text-white">
                    <span className="text-sm font-medium">Order Total</span>

                    <span className="text-base font-bold">
                      {total.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}