
import Link from "next/link";
import { etb, when } from "@/lib/format";

const COLUMNS = [
  { key: "id", label: "Order" },
  { key: "area", label: "Area" },
  { key: "total", label: "Total (ETB)" },
  { key: "date", label: "Date" },
];

function buildHref({ sort, dir, page }, next) {
  const params = new URLSearchParams({
    sort: next.sort ?? sort,
    dir: next.dir ?? dir,
    page: String(next.page ?? page),
  });

  return `?${params.toString()}`;
}

export default function OrderTable({
  rows = [],
  sort = "date",
  dir = "desc",
  page = 1,
  pageCount = 1,
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center text-gray-500">
        No orders on this page.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">
          All orders, page {page} of {pageCount}
        </caption>
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
          <tr>
            {COLUMNS.map(({ key, label }) => {
              const active = sort === key;
              const nextDir =
                active && dir === "asc" ? "desc" : "asc";

              return (
                <th
                  key={key}
                  scope="col"
                  aria-sort={
                    active
                      ? dir === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className="whitespace-nowrap px-4 py-3 font-medium"
                >
                  <Link
                    href={buildHref(
                      { sort, dir, page },
                      { sort: key, dir: nextDir, page: 1 }
                    )}
                    className="inline-flex items-center gap-1 text-gray-600 hover:text-orange-700"
                  >
                    {label}
                    {active ? (
                      <span aria-hidden="true">
                        {dir === "asc" ? "▲" : "▼"}
                      </span>
                    ) : null}
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((order, index) => {
            const orderId = String(order.id ?? "Unknown");
            const displayId = orderId.startsWith("ord_")
              ? orderId
              : `ord_${orderId}`;

            return (
              <tr
                key={order.id ?? index}
                className="hover:bg-orange-50/50"
              >
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-700">
                  {displayId}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-800">
                  {order.area || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-gray-800">
                  {etb(order.total)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                  {when(order.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <nav
        aria-label="Order pages"
        className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-sm"
      >
        {page > 1 ? (
          <Link
            href={buildHref(
              { sort, dir, page },
              { page: page - 1 }
            )}
            className="rounded-md px-3 py-1 text-orange-700 hover:bg-orange-50"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-3 py-1 text-gray-300">
            ← Previous
          </span>
        )}

        <span className="text-gray-500">
          Page {page} of {pageCount}
        </span>

        {page < pageCount ? (
          <Link
            href={buildHref(
              { sort, dir, page },
              { page: page + 1 }
            )}
            className="rounded-md px-3 py-1 text-orange-700 hover:bg-orange-50"
          >
            Next →
          </Link>
        ) : (
          <span className="px-3 py-1 text-gray-300">
            Next →
          </span>
        )}
      </nav>
    </div>
  );
}
