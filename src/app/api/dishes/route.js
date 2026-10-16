import { NextResponse } from "next/server";
import { dishes } from "@/lib/dishes";
import { requireStaff } from "@/lib/requireStaff";

// Always read the current data, never a cached copy.
export const dynamic = "force-dynamic";

// Older dishes may not have these fields yet. Fill them in so every
// consumer (menu cards, staff table) sees the same complete dish.
function withDefaults(dish) {
  return {
    available: true,
    discount: 0,
    special: false,
    ...dish, // anything already on the dish wins over the defaults
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const pageParam = searchParams.get("page");

  const allDishes = dishes.map(withDefaults);

  // Normal menu: return all dishes
  if (!search && !pageParam && category === "All") {
    return NextResponse.json(allDishes);
  }

  // Search + category + pagination
  const page = Number(pageParam) || 1;
  const pageSize = 6;

  let filteredDishes = allDishes;

  if (search) {
    filteredDishes = filteredDishes.filter((dish) =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category !== "All") {
    filteredDishes = filteredDishes.filter(
      (dish) => dish.category === category
    );
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const paginatedDishes = filteredDishes.slice(start, end);

  return NextResponse.json({
    dishes: paginatedDishes,
    page,
    pageSize,
    total: filteredDishes.length,
    totalPages: Math.ceil(filteredDishes.length / pageSize),
  });
}

function slugify(s) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function nextId() {
  if (dishes.length && dishes.every((d) => typeof d.id === "number")) {
    return Math.max(...dishes.map((d) => d.id)) + 1;
  }
  return crypto.randomUUID();
}

export async function POST(request) {
  const { error } = await requireStaff();
  if (error) return error;

  const body = await request.json();
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  const discount = Number(body.discount ?? 0);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  if (!Number.isInteger(discount) || discount < 0 || discount > 90) {
    return NextResponse.json(
      { error: "Discount must be a whole number from 0 to 90" },
      { status: 400 }
    );
  }

  const dish = {
    id: nextId(),
    slug: slugify(name),
    name,
    price,
    discount, // percent, whole number 0-90
    special: body.special === true, // shown in "Today's special"
    category: String(body.category ?? "").trim(),
    description: String(body.description ?? "").trim(), // shown on the dish card
    image: String(body.image ?? "").trim(),
    available: body.available !== false,
  };

  dishes.push(dish);
  return NextResponse.json(dish, { status: 201 });
}