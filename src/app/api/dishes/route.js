import { NextResponse } from "next/server";
import { dishes } from "@/lib/dishes";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const pageParam = searchParams.get("page");

  // Normal menu: return all dishes
  if (!search && !pageParam && category === "All") {
    return NextResponse.json(dishes);
  }

  // Search + category + pagination
  const page = Number(pageParam) || 1;
  const pageSize = 6;

  let filteredDishes = dishes;

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
