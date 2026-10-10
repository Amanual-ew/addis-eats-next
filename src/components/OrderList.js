import Link from "next/link";

function statusClass(status) {
  const s = String(status || "").toLowerCase();
  if (s.includes("deliver")) return "bg-green-100 text-green-700";
  if (s.includes("cancel")) return "bg-red-100 text-red-600";
  if (s.includes("prepar") || s.includes("process"))
    return "bg-yellow-100 text-yellow-700";
  return "bg-orange-100 text-[#ff6f61]";
}

export default function OrderList({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">No orders yet 😕</h2>
        <p className="mt-2 text-gray-500">
          Your placed orders will show up here.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-8 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95"
        >
          Browse Menu 🍴
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Order #{order.id}
            </h2>
            <p className="text-sm text-gray-500">
              {order.name} · {order.area}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-4 py-1 text-sm font-semibold ${statusClass(
                order.status
              )}`}
            >
              {order.status}
            </span>
            <span className="font-semibold text-gray-400">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
