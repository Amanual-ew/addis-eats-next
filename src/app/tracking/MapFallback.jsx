import { when } from "@/lib/format";

export default function MapFallback({ courier, destination }) {
  return (
    <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-xs text-gray-700">
      <h3 className="mb-1 font-semibold text-gray-900">Map details</h3>
      <dl className="space-y-1">
        <div>
          <dt className="inline font-medium">Courier: </dt>
          <dd className="inline">
            {courier.name} — {courier.lat.toFixed(4)}, {courier.lng.toFixed(4)}
          </dd>
        </div>
        <div>
          <dt className="inline font-medium">Delivery: </dt>
          <dd className="inline">
            {destination.area} — {destination.lat.toFixed(4)},{" "}
            {destination.lng.toFixed(4)}
          </dd>
        </div>
      </dl>
    </div>
  );
}