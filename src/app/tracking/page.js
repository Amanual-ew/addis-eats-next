import { orders } from "@/lib/orders";
import { etb, when } from "@/lib/format";
import StatusStream from "./StatusStream";
import MapFallback from "./MapFallback";
import CsvExportButton from "./CsvExportButton";
import TrackingMapWrapper from "../orders/[id]/OrderTrackingMapWrapper";

export const dynamic = "force-dynamic";

export default async function TrackingPage() {
  const order = orders[0];

  const courier = { name: "Delivery Man.", lat: 9.0192, lng: 38.7525 };
  const destination = { area: order?.area ?? "—", lat: 9.0054, lng: 38.7634 };

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Track your order</h1>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrackingMapWrapper courier={courier} destination={destination} />
        </div>

        <aside className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">Live status</h2>

          <StatusStream
            initial={{
              orderId: order?.id ?? "—",
              status: "preparing",
              updatedAt: new Date().toISOString(),
            }}
          />

          <MapFallback courier={courier} destination={destination} />
        </aside>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Order history</h2>
          <CsvExportButton rows={orders} />
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th scope="col" className="px-4 py-2 font-medium">Order</th>
              <th scope="col" className="px-4 py-2 font-medium">Area</th>
              <th scope="col" className="px-4 py-2 font-medium">Total</th>
              <th scope="col" className="px-4 py-2 font-medium">Placed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 font-mono text-xs text-gray-700">
                  {o.id}
                </td>
                <td className="px-4 py-2 text-gray-800">{o.area}</td>
                <td className="px-4 py-2 tabular-nums text-gray-800">
                  {etb(o.total)}
                </td>
                <td className="px-4 py-2 text-gray-600" title={when(o.createdAt)}>
                  {when(o.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}