// app/api/orders/status/route.js  (NEW FILE)
// GET /api/orders/status?ids=1,2,3  ->  { "1": "preparing", "2": "en_route", ... }
// Uses peekTracking, so it only READS progress and never starts an order's clock.
import { peekTracking } from "@/lib/tracking";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 200);

  const statuses = {};
  for (const id of ids) statuses[id] = peekTracking(id).status;

  return Response.json(statuses, { headers: { "Cache-Control": "no-store" } });
}