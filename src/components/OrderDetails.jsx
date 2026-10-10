"use client";

import Link from "next/link";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";

export default function OrderDetails({
  orderId,
  initialOrder,
}) {
  const { data: order } = useSWR(
    `/api/orders/${orderId}`,
    fetcher,
    {
      fallbackData: initialOrder,
      refreshInterval: 5000,
    }
  );

  const items = order.items || [];

  const total = items.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/orders"
        className="mb-6 inline-block text-sm font-semibold text-gray-500 transition hover:text-[#ff6f61]"
      >
        ← Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Order #{order.id}
        </h1>

        <span className="rounded-full bg-yellow-50 px-5 py-2 text-sm font-semibold text-yellow-700">
          🕐 {order.status}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
        {/* Customer information */}
        <div className="grid gap-6 border-b border-gray-100 p-6 sm:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Customer
            </p>
            <p className="mt-1 font-medium text-gray-800">{order.name}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Phone
            </p>
            <p className="mt-1 font-medium text-gray-800">{order.phone}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Delivery Area
            </p>
            <p className="mt-1 font-medium text-gray-800">{order.area}</p>
          </div>
        </div>

        {/* Items */}
        {items.length > 0 && (
          <div className="p-6">
            <h2 className="mb-4 font-bold text-gray-900">Order Items</h2>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>

                    {item.price && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.price} ETB each
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-gray-800">× {item.quantity}</p>

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
        )}

        {/* Total */}
        <div className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white">
          <span className="font-medium">Order Total</span>
          <span className="text-xl font-bold">{total.toLocaleString()} ETB</span>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        This page updates automatically every few seconds.
      </p>
    </main>
  );
}
