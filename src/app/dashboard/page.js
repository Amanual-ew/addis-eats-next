import { orders } from "@/lib/orders";
import {
  AREAS,
  revenueByArea,
  ordersPerDay,
  summarize,
  sortOrders,
} from "@/lib/dashboard";
import RevenueChart from "./RevenueChart";
import OrdersChart from "./OrdersChart";
import ChartDataTable from "./ChartDataTable";
import OrderTable from "./OrderTable";
import RequireAuth from "@/components/RequiresAuth";

// Force a fresh render on every request so states can be demoed.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;

export default async function DashboardPage({ searchParams }) {
  // Next 16: searchParams is a Promise — unwrap it once, up front.
  const sp = await searchParams;

  // Simulate a data source (swap with a real fetch/DB later).
  const allOrders = orders;

  // ---- empty-state demo hook:  /dashboard?empty=1
  if (sp?.empty === "1") {
    return <EmptyState />;
  }

  // ---- error-state demo hook:  /dashboard?boom=1
  if (sp?.boom === "1") {
    throw new Error("Simulated data-source failure");
  }

  const revenue = revenueByArea(allOrders);
  const perDay = ordersPerDay(allOrders);
  const { totalRevenue, totalOrders } = summarize(allOrders);

  // ---- order table: URL-driven sort + page
  const sort = sp?.sort ?? "date";
  const dir = sp?.dir === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(sp?.page ?? 1));
  const sorted = sortOrders(allOrders, sort, dir);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const range = perDay.length
    ? `${perDay[0].date} → ${perDay[perDay.length - 1].date}`
    : "no data";
  console.log("Dashboard orders:", allOrders);
  return (
    <RequireAuth>
    <main className="mx-auto max-w-6xl space-y-10 p-6">
      <h1 className="text-3xl font-bold text-gray-900">Addis Eats Dashboard</h1>

      <section
        aria-label="Summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total revenue
          </p>
          <p className="text-2xl font-semibold tabular-nums text-gray-900">
            {formatETB(totalRevenue)}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Total orders
          </p>
          <p className="text-2xl font-semibold tabular-nums text-gray-900">
            {totalOrders}
          </p>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Revenue by Neighbourhood
        </h2>
        <p className="text-sm text-gray-600">Revenue in ETB, by area.</p>
        <RevenueChart data={revenue} />
        <ChartDataTable
          caption="Revenue by neighbourhood (ETB)"
          columns={["Area", "Revenue (ETB)"]}
          rows={revenue.map((r) => [r.area, formatETB(r.revenue)])}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Orders per day — {range}
        </h2>
        <p className="text-sm text-gray-600">
          Number of orders per calendar day (count).
        </p>
        <OrdersChart data={perDay} />
        <ChartDataTable
          caption={`Orders per day — ${range}`}
          columns={["Date", "Orders"]}
          rows={perDay.map((d) => [d.date, d.count])}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">All orders</h2>
        <OrderTable
          rows={pageRows}
          sort={sort}
          dir={dir}
          page={safePage}
          pageCount={pageCount}
        />
      </section>
    </main>
    </RequireAuth>
  );
}

function formatETB(n) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);
}

function EmptyState() {
  return (
    <RequireAuth>
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-gray-900">Addis Eats Dashboard</h1>
      <div
        role="status"
        className="mt-10 rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center"
      >
        <h2 className="text-lg font-semibold text-gray-900">No orders yet</h2>
        <p className="mt-1 text-sm text-gray-600">
          Once orders start coming in, revenue and trends will appear here.
        </p>
      </div>
    </main>
    </RequireAuth>
  );
}