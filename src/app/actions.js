"use server";
import { orderSchema } from "../lib/schemas";
import { DISHES } from "../lib/dishes";

async function requireSession() {
  // Day 42 replaces this with a real cookie read.
  return { id: "anon" };
}

export async function placeOrder(input) {
  const session = await requireSession();
  if (!session) return { ok: false, error: "Not authorised" };

  // The server validates what the browser already validated.
  const parsed = orderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Never trust client prices — rebuild from the trusted source.
  const items = parsed.data.items.map((i) => {
    const dish = DISHES.find((d) => d.id === i.id);
    if (!dish) throw new Error(`Unknown dish: ${i.id}`);
    return { id: dish.id, name: dish.name, price: dish.price, quantity: i.quantity };
  });

  const order = {
    id: `ord_${Date.now()}`,
    customer: { name: parsed.data.name, phone: parsed.data.phone, area: parsed.data.area },
    items,
    total: items.reduce((s, i) => s + i.price * i.quantity, 0),
    createdAt: new Date().toISOString(),
  };
  console.log("[placeOrder]", order);
  return { ok: true, orderId: order.id };
}