import { NextResponse } from "next/server";
import { dishes } from "@/lib/dishes";
import { requireStaff } from "@/lib/requireStaff";

// Compare as strings so numeric and string ids both work.
const findIndex = (id) => dishes.findIndex((d) => String(d.id) === String(id));

export async function PATCH(request, { params }) {
  const { error } = await requireStaff();
  if (error) return error;

  const { id } = await params; // Next 16: params is a Promise
  const i = findIndex(id);
  if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();

  // Only accept known fields.
  const patch = {};
  if (typeof body.name === "string") {
    if (!body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    patch.name = body.name.trim();
  }
  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    patch.price = price;
  }
  if (body.discount !== undefined) {
    const discount = Number(body.discount);
    if (!Number.isInteger(discount) || discount < 0 || discount > 90) {
      return NextResponse.json(
        { error: "Discount must be a whole number from 0 to 90" },
        { status: 400 }
      );
    }
    patch.discount = discount;
  }
  if (typeof body.category === "string") patch.category = body.category.trim();
  if (typeof body.image === "string") patch.image = body.image.trim();
  if (typeof body.available === "boolean") patch.available = body.available;
  if (typeof body.special === "boolean") patch.special = body.special;

  // Mutate in place so every importer of `dishes` sees the change.
  Object.assign(dishes[i], patch);
  return NextResponse.json(dishes[i]);
}

export async function DELETE(_request, { params }) {
  const { error } = await requireStaff();
  if (error) return error;

  const { id } = await params;
  const i = findIndex(id);
  if (i === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  dishes.splice(i, 1);
  return NextResponse.json({ ok: true });
}