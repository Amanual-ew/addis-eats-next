// src/app/api/tracking/stream/route.js  (REPLACE)
// Streams the order's REAL status (order.status in lib/orders) and starts the
// demo progress timer when someone opens the order.
import { orders } from "@/lib/orders";
import { normalizeStatus } from "@/lib/orderStatus";
import { ensureSimulation } from "@/lib/simulateDelivery";

export const dynamic = "force-dynamic";

const POLL_MS = 1000;
const find = (id) => orders.find((o) => String(o.id) === String(id));

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!find(id)) return new Response("Order not found", { status: 404 });

  // Someone is watching this order: make sure its status keeps moving.
  ensureSimulation(id);

  const encoder = new TextEncoder();
  let interval;
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const stop = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {}
      };

      const write = (text) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(text));
        } catch {
          stop();
        }
      };

      const send = (event, data) =>
        write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

      request.signal.addEventListener("abort", stop);

      let lastKey = null;
      let ticks = 0;

      const push = () => {
        const order = find(id);
        if (!order) return;

        const key = `${order.status}|${order.statusUpdatedAt ?? ""}`;
        if (key === lastKey) {
          // Keep-alive comment every ~15s so proxies don't drop the connection.
          if (++ticks % 15 === 0) write(": keep-alive\n\n");
          return;
        }
        lastKey = key;

        // How long ago the status changed, so the client can resume the animation.
        const statusAgeMs = order.statusUpdatedAt
          ? Math.max(Date.now() - Date.parse(order.statusUpdatedAt), 0)
          : 0;

        send("status", {
          orderId: order.id,
          status: normalizeStatus(order.status),
          statusAgeMs,
          courier: { name: "Abebe K.", lat: 9.0192, lng: 38.7525 },
          updatedAt: new Date().toISOString(),
        });
      };

      push();
      interval = setInterval(push, POLL_MS);
    },
    cancel() {
      closed = true;
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}