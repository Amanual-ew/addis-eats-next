// src/app/orders/[id]/OrderTrackingMap.client.jsx  (REPLACE)
"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { normalizeStatus } from "@/lib/orderStatus";

// Approximate centre points (lat/lng) for each area.
const AREAS = [
  { name: "Ayat", lat: 9.03, lng: 38.87 },
  { name: "Arabsa", lat: 8.983, lng: 38.805 },
  { name: "Bole", lat: 8.995, lng: 38.787 },
  { name: "Mexico", lat: 9.01, lng: 38.74 },
  { name: "Megenagna", lat: 9.02, lng: 38.8 },
  { name: "CMC", lat: 9.02, lng: 38.83 },
  { name: "Gerji", lat: 9.0, lng: 38.805 },
  { name: "Kazanchis", lat: 9.015, lng: 38.769 },
  { name: "Piassa", lat: 9.035, lng: 38.753 },
  { name: "4 Kilo", lat: 9.035, lng: 38.762 },
];

const DELIVERY_MS = 10_000; // how long the courier takes to reach the address

// Case/space-insensitive, so "bole " and "Bole" both match.
const getArea = (name) => {
  const key = String(name ?? "").trim().toLowerCase();
  return AREAS.find((a) => a.name.toLowerCase() === key);
};
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Labelled dot pointer: label on top, dot sits exactly on the coordinate.
const pin = (color, label) =>
  L.divIcon({
    className: "",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)">
      <span style="background:${color};color:#fff;font:600 11px sans-serif;padding:2px 8px;border-radius:9999px;white-space:nowrap">${esc(label)}</span>
      <span style="width:14px;height:14px;background:${color};border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 1px rgba(0,0,0,.3);margin-top:2px"></span>
    </div>`,
  });

export default function OrderTrackingMap({
  courier: initialCourier,
  initialArea,
  initialStatus = "Pending",
  orderId,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const courierMarkerRef = useRef(null);
  const addressMarkerRef = useRef(null);
  const animRef = useRef(null);
  const startedRef = useRef(false);
  const courierRef = useRef(initialCourier);
  const selectedRef = useRef(null);

  const selected = getArea(initialArea);
  const startStatus = normalizeStatus(initialStatus);

  const [status, setStatus] = useState(startStatus);
  // true once the courier has reached the address
  const [animDone, setAnimDone] = useState(startStatus === "Delivered");
  const [courier, setCourier] = useState(() =>
    startStatus === "Delivered" && selected
      ? { ...initialCourier, lat: selected.lat, lng: selected.lng }
      : initialCourier
  );

  courierRef.current = courier;
  selectedRef.current = selected;

  const delivered = status === "Delivered";
  const cancelled = status === "Cancelled";
  const arrived = delivered || (status === "On the way" && animDone);

  // Slide the courier from the start point to the address.
  // offsetMs resumes the trip if the status changed to "On the way" a while ago.
  const startDelivery = (offsetMs = 0) => {
    const target = selectedRef.current;
    if (!target || startedRef.current) return;
    startedRef.current = true;
    setAnimDone(false);

    const from = { lat: initialCourier.lat, lng: initialCourier.lng };
    const t0 = performance.now() - offsetMs;

    const tick = (now) => {
      const t = Math.min((now - t0) / DELIVERY_MS, 1);
      const k = ease(t);
      setCourier((prev) => ({
        ...prev,
        lat: from.lat + (target.lat - from.lat) * k,
        lng: from.lng + (target.lng - from.lng) * k,
      }));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else setAnimDone(true);
    };
    animRef.current = requestAnimationFrame(tick);
  };

  // 1. Create the map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, { scrollWheelZoom: false });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    map.setView([courierRef.current.lat, courierRef.current.lng], 13);

    return () => {
      map.remove();
      mapRef.current = null;
      courierMarkerRef.current = null;
      addressMarkerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Real order status from the server (same data the kitchen board edits).
  useEffect(() => {
    const es = new EventSource(`/api/tracking/stream?id=${encodeURIComponent(orderId)}`);

    es.addEventListener("status", (e) => {
      let d;
      try {
        d = JSON.parse(e.data);
      } catch {
        return; // ignore malformed frames
      }

      const s = normalizeStatus(d.status);
      setStatus(s);
      const target = selectedRef.current;

      if (s === "On the way") {
        startDelivery(d.statusAgeMs ?? 0);
        return;
      }

      cancelAnimationFrame(animRef.current);
      startedRef.current = false;

      if (s === "Delivered") {
        // Courier and delivery address are exactly the same point.
        if (target) setCourier((prev) => ({ ...prev, lat: target.lat, lng: target.lng }));
        setAnimDone(true);
        return;
      }

      // Pending / Preparing / Cancelled: courier waits at the start point.
      setAnimDone(false);
      setCourier((prev) => ({
        ...prev,
        lat: initialCourier.lat,
        lng: initialCourier.lng,
        name: d.courier?.name ?? prev.name,
      }));
    });

    // No manual close on error: EventSource reconnects and the first frame
    // after reconnecting carries the real current status.
    return () => {
      es.close();
      cancelAnimationFrame(animRef.current);
      startedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // 3. Draw / move the two pointers.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const color = cancelled ? "#6b7280" : delivered ? "#16a34a" : "#ff6f61";
    const label = cancelled
      ? `${courier.name} · Order cancelled`
      : delivered
      ? `${courier.name} · Delivered`
      : arrived
      ? `${courier.name} · Arrived`
      : courier.name;
    const courierIcon = pin(color, label);

    if (!courierMarkerRef.current) {
      courierMarkerRef.current = L.marker([courier.lat, courier.lng], { icon: courierIcon }).addTo(map);
    } else {
      courierMarkerRef.current.setLatLng([courier.lat, courier.lng]).setIcon(courierIcon);
    }

    // Hide the address pin on arrival so the two pins don't overlap.
    if (selected && !arrived) {
      const icon = pin("#2563eb", `Delivery: ${selected.name}`);
      if (!addressMarkerRef.current) {
        addressMarkerRef.current = L.marker([selected.lat, selected.lng], { icon }).addTo(map);
      } else {
        addressMarkerRef.current.setLatLng([selected.lat, selected.lng]).setIcon(icon);
      }
    } else if (addressMarkerRef.current) {
      addressMarkerRef.current.remove();
      addressMarkerRef.current = null;
    }
  }, [courier, selected, status, arrived, delivered, cancelled]);

  // 4. Fit the view to both pins once, when the address is known.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    map.fitBounds(
      L.latLngBounds([
        [selected.lat, selected.lng],
        [courierRef.current.lat, courierRef.current.lng],
      ]),
      { padding: [60, 60], maxZoom: 16 }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.name]);

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        role="img"
        aria-label={`Map showing delivery address ${selected?.name ?? "not set"} and courier ${courier.name}`}
        className="h-[400px] w-full overflow-hidden rounded-lg border border-gray-200"
      />

      {initialArea && !selected && (
        <p className="rounded-lg bg-yellow-50 px-3 py-2 text-xs text-yellow-800" role="status">
          The delivery area "{initialArea}" isn't on the map yet, so the courier can't be shown
          moving to it. Add it to the AREAS list in OrderTrackingMap.client.jsx.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
          {selected ? `Delivery: ${selected.name}` : "No delivery address"}
        </span>
        <span className="flex items-center gap-1">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              cancelled ? "bg-gray-500" : delivered ? "bg-green-600" : "bg-[#ff6f61]"
            }`}
          />
          {courier.name}
          {cancelled ? " · Cancelled" : delivered ? " · Delivered ✓" : arrived ? " · Arrived" : ""}
        </span>
      </div>
    </div>
  );
}