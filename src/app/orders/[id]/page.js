// src/app/orders/[id]/page.jsx  (REPLACE)
import { notFound } from "next/navigation";
import Link from "next/link";
import { orders } from "@/lib/orders";
import { normalizeStatus } from "@/lib/orderStatus";
import { etb, when } from "@/lib/format";
import StatusStream from "@/app/tracking/StatusStream";
import OrderTrackingMapWrapper from "./OrderTrackingMapWrapper";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = orders.find((o) => String(o.id) === String(id));

  if (!order) notFound();

  // The real status (the stream starts the timer that moves it forward).
  const status = normalizeStatus(order.status);

  // Works whether or not the order has a stored total.
  const total =
    order.total ??
    (order.items ?? []).reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  // Starting position. Replace with real courier data when your backend provides it.
  const courier = { name: "Abebe K.", lat: 9.0192, lng: 38.7525 };

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-gray-700">
        &larr; Back to orders
      </Link>
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
            courier={courier}
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
    </main>
  );
}