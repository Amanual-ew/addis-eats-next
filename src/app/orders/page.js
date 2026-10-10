"use client";

import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import RequireAuth from "@/components/RequireAuth";
export default function OrdersPage() {
  const {
    data: orders = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/orders", fetcher);

  if (isLoading) {
    return (
      <RequireAuth>
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <div className="h-9 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="space-y-6">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="mb-5 h-6 w-40 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </main>
      </RequireAuth>
    );
  }

  if (error) {
    return (
      <RequireAuth>
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mb-3 text-4xl">⚠️</div>

            <h1 className="text-xl font-bold text-red-700">
              Unable to load orders
            </h1>

            <p className="mt-2 text-red-600">
              Something went wrong while loading your orders.
            </p>

            <button
              onClick={() => mutate()}
              className="mt-5 rounded-lg bg-[#ff6f61] px-5 py-2.5 font-semibold text-white transition hover:bg-[#e65c50]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#ff6f61]">
              Addis Eats
            </p>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              My Orders 📦
            </h1>

            <p className="mt-2 text-gray-500">
              Track your recent food orders and their status.
            </p>
          </div>

          <button
            onClick={() => mutate()}
            className="w-fit rounded-lg border border-gray-200 bg-white px-5 py-2.5 font-semibold text-gray-700 shadow-sm transition hover:border-[#ff6f61] hover:text-[#ff6f61]"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl">
              🍽️
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You haven't placed an order yet. Browse our menu and
              discover something delicious.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-8 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95"
            >
              Browse Menu 🍴
            </Link>
          </div>
        ) : (
          /* Orders */
          <div className="space-y-6">
            {orders.map((order) => {
              const total = order.items.reduce(
                (sum, item) =>
                  sum + (item.price || 0) * (item.quantity || 1),
                0
              );

              return (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* Order top */}
                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Order
                        </p>

                        <Link href={`/orders/${order.id}`}>
                          <h2 className="text-xl font-bold text-gray-900 transition hover:text-[#ff6f61]">
                            #{order.id} →
                          </h2>
                        </Link>
                      </div>

                      <span className="w-fit rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-yellow-700">
                        🕐 {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Customer information */}
                  <div className="grid gap-4 border-b border-gray-100 px-5 py-5 sm:grid-cols-3 sm:px-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Customer
                      </p>
                      <p className="mt-1 font-medium text-gray-800">
                        {order.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Phone
                      </p>
                      <p className="mt-1 font-medium text-gray-800">
                        {order.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Delivery Area
                      </p>
                      <p className="mt-1 font-medium text-gray-800">
                        {order.area}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="px-5 py-5 sm:px-6">
                    <h3 className="mb-4 font-bold text-gray-900">
                      Order Items
                    </h3>

                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>

                            {item.price && (
                              <p className="mt-1 text-sm text-gray-500">
                                {item.price} ETB each
                              </p>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-800">
                              × {item.quantity}
                            </p>

                            {item.price && (
                              <p className="mt-1 text-sm text-gray-500">
                                {item.price * item.quantity} ETB
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between bg-gray-900 px-5 py-4 text-white sm:px-6">
                    <span className="font-medium">
                      Order Total
                    </span>

                    <span className="text-xl font-bold">
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
    </RequireAuth>
  );
}