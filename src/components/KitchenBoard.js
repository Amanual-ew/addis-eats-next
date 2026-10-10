"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"];

export default function KitchenBoard({ orders }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);

  async function changeStatus(id, status) {
    setError("");
    setSavingId(id);

    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Could not update the order.");
        return;
      }

      router.refresh();
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setSavingId(null);
    }
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center text-gray-500 shadow-sm">
        No orders yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          ❌ {error}
        </p>
      )}

      {orders.map((order) => {
        const total = (order.items || []).reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
          0
        );

        return (
          <div
            key={order.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-lg font-bold text-gray-900">Order #{order.id}</h2>
              <p className="text-sm text-gray-500">
                {order.name} · {order.phone} · {order.area}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {(order.items || [])
                  .map((item) => `${item.quantity}× ${item.name}`)
                  .join(", ")}
              </p>
              <p className="mt-1 font-semibold text-[#ff6f61]">
                {total.toLocaleString()} ETB
              </p>
            </div>

            <select
              value={order.status}
              disabled={savingId === order.id}
              onChange={(e) => changeStatus(order.id, e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 font-medium outline-none transition focus:border-[#ff6f61] focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
