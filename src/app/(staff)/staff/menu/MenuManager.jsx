"use client";

import { useState } from "react";
import useSWR from "swr";
import DishPrice from "@/components/DishPrice";

const fetcher = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load");
    return r.json();
  });

const EMPTY = {
  name: "",
  price: "",
  discount: 0,
  category: "",
  image: "",
  available: true,
  special: false,
};

export default function MenuManager() {
  const { data, error, isLoading, mutate } = useSWR("/api/dishes", fetcher);
  // Works whether the API returns an array or { dishes: [...] }.
  const dishes = Array.isArray(data) ? data : data?.dishes ?? [];

  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  async function request(url, method, body) {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || "Request failed");
    }
    return res.json().catch(() => ({}));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount) || 0,
      };
      if (editingId) await request(`/api/dishes/${editingId}`, "PATCH", payload);
      else await request("/api/dishes", "POST", payload);
      setForm(EMPTY);
      setEditingId(null);
      await mutate();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  // Flip one true/false field ("available" or "special") right in the table.
  async function toggle(d, field) {
    setMessage("");
    try {
      // The server replies with the saved dish: use that as the truth.
      const updated = await request(`/api/dishes/${d.id}`, "PATCH", {
        [field]: !d[field],
      });

      // Put the saved dish straight into the table (no re-fetch needed).
      await mutate(
        (current) => {
          const list = Array.isArray(current) ? current : current?.dishes ?? [];
          return list.map((x) => (x.id === d.id ? { ...x, ...updated } : x));
        },
        { revalidate: false }
      );
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function remove(d) {
    if (!confirm(`Delete "${d.name}"? This can't be undone.`)) return;
    try {
      await request(`/api/dishes/${d.id}`, "DELETE");
      await mutate();
    } catch (err) {
      setMessage(err.message);
    }
  }

  function startEdit(d) {
    setEditingId(d.id);
    setForm({
      name: d.name ?? "",
      price: d.price ?? "",
      discount: d.discount ?? 0,
      category: d.category ?? "",
      image: d.image ?? "",
      available: d.available ?? true,
      special: d.special ?? false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const input =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900";

  return (
    <div className="space-y-8">
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:grid-cols-2"
      >
        <h2 className="text-lg font-semibold text-gray-900 sm:col-span-2">
          {editingId ? "Edit dish" : "Add a dish"}
        </h2>

        <label className="text-sm text-gray-700">
          Name
          <input required className={input} value={form.name} onChange={set("name")} />
        </label>
        <label className="text-sm text-gray-700">
          Price (ETB)
          <input
            required
            type="number"
            min="0"
            step="1"
            className={input}
            value={form.price}
            onChange={set("price")}
          />
        </label>
        <label className="text-sm text-gray-700">
          Discount (%)
          <input
            type="number"
            min="0"
            max="90"
            step="1"
            className={input}
            value={form.discount}
            onChange={set("discount")}
          />
          <span className="text-xs text-gray-500">0 = no discount, max 90</span>
        </label>
        <label className="text-sm text-gray-700">
          Category
          <input className={input} value={form.category} onChange={set("category")} />
        </label>
        <label className="text-sm text-gray-700 sm:col-span-2">
          Image URL
          <input className={input} value={form.image} onChange={set("image")} />
        </label>

        <div className="flex flex-wrap gap-6 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.available} onChange={set("available")} />
            Available to order
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.special} onChange={set("special")} />
            Today's special
          </label>
        </div>

        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Save changes" : "Add dish"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(EMPTY);
              }}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
        {message && (
          <p role="alert" className="text-sm text-red-600 sm:col-span-2">
            {message}
          </p>
        )}
      </form>

      <section aria-label="Dishes" className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        {isLoading && <p className="p-6 text-sm text-gray-600">Loading menu…</p>}
        {error && <p className="p-6 text-sm text-red-600">Couldn't load the menu.</p>}
        {!isLoading && !error && dishes.length === 0 && (
          <p className="p-6 text-sm text-gray-600">No dishes yet. Add your first one above.</p>
        )}
        {dishes.length > 0 && (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="p-3">Dish</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Available</th>
                <th className="p-3">Special</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {dishes.map((d) => (
                <tr key={d.id}>
                  <td className="p-3 font-medium text-gray-900">{d.name}</td>
                  <td className="p-3 text-gray-600">{d.category || "—"}</td>
                  <td className="p-3">
                    <DishPrice dish={d} />
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!d.available}
                      aria-label={`${d.name} available`}
                      onClick={() => toggle(d, "available")}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        d.available
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {d.available ? "Available" : "Sold out"}
                    </button>
                  </td>
                  <td className="p-3">
                    <button
                      type="button"
                      role="switch"
                      aria-checked={!!d.special}
                      aria-label={`${d.name} is today's special`}
                      onClick={() => toggle(d, "special")}
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        d.special
                          ? "bg-amber-100 text-amber-800"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {d.special ? "★ Special" : "Not special"}
                    </button>
                  </td>
                  <td className="space-x-3 p-3 text-right">
                    <button onClick={() => startEdit(d)} className="text-gray-900 underline">
                      Edit
                    </button>
                    <button onClick={() => remove(d)} className="text-red-600 underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}