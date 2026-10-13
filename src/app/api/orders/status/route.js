// src/app/api/orders/status/route.js  (REPLACE THE WHOLE FILE)
// GET /api/orders/status?ids=ord_1,ord_2  ->  { "ord_1": "Pending", "ord_2": "On the way" }
// Reads the shared order data (lib/orders), the same source as every other page.
import { orders } from "@/lib/orders";
import { normalizeStatus } from "@/lib/orderStatus";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ message: "Not signed in." }, { status: 401 });
  }

  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);

  const statuses = {};
  for (const id of ids) {
    const order = orders.find((o) => String(o.id) === id);
    // Customers only see their own orders; staff see all.
    if (order && (session.role === "staff" || order.userId === session.id)) {
      statuses[id] = normalizeStatus(order.status);
    }
  }

  return Response.json(statuses, { headers: { "Cache-Control": "no-store" } });
}