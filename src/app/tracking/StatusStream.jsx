// src/app/tracking/StatusStream.jsx  (REPLACE)
"use client";

import { useEffect, useState } from "react";
import { TRACK_STEPS, normalizeStatus } from "@/lib/orderStatus";

export default function StatusStream({ initial, onFrame }) {
  const [current, setCurrent] = useState(normalizeStatus(initial.status));
  const idx = TRACK_STEPS.indexOf(current);
  const cancelled = current === "Cancelled";

  useEffect(() => {
    const es = new EventSource(
      `/api/tracking/stream?id=${encodeURIComponent(initial.orderId)}`
    );
    es.addEventListener("status", (e) => {
      try {
        const d = JSON.parse(e.data);
        if (d.status) setCurrent(normalizeStatus(d.status));
        onFrame?.(d);           // let the parent (map) sync animation
      } catch {}
    });
    return () => es.close();
  }, [initial.orderId, onFrame]);

  if (cancelled) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600" role="status">
        ❌ This order was cancelled.
      </p>
    );
  }

  return (
    <ol className="space-y-2" aria-live="polite">
      {TRACK_STEPS.map((label, i) => (
        <li key={label} className={i <= idx ? "font-semibold text-green-700" : "text-gray-400"}>
          {i <= idx ? "✓" : "○"} {label}
        </li>
      ))}
    </ol>
  );
}