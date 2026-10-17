import { Suspense } from "react";
import { NextRequest } from "next/server";
import DishList from "../../components/DishList";
import CategoryBar from "../../components/CategoryBar";
import { GET as getDishes } from "../api/dishes/route";

export const metadata = {
  title: "Menu",
  description:
    "Doro Wat, Tibs, Kitfo and Shiro, delivered across Addis Ababa. Browse the full menu and order in minutes.",
  alternates: { canonical: "/menu" },
};

// No `revalidate` here: reading searchParams already makes this page dynamic,
// so staff changes (sold out, discount, special) show up immediately.

async function loadFirstPage({ search, category, page }) {
  try {
    const qs = new URLSearchParams({ search, page: String(page) });
    if (category !== "All") qs.set("category", category);
    // Re-uses your own API logic, so the server and the browser always agree.
    const res = await getDishes(
      new NextRequest(`http://localhost/api/dishes?${qs.toString()}`)
    );
    return await res.json();
  } catch {
    return null; // DishList will just fetch in the browser as before
  }
}

export default async function Menu({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || "All";
  const search = params?.search || "";
  const page = Number(params?.page) || 1;

  const initialData = await loadFirstPage({ search, category, page });

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]">ADDIS EATS MENU</p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">Our Menu 🍽️</h1>
        <Suspense><CategoryBar selectedCategory={category} /></Suspense>
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500">Choose from our delicious Ethiopian dishes.</p>
      </div>
      <DishList
        category={category}
        initialData={initialData}
        initialSearch={search}
        initialPage={page}
      />
    </main>
  );
}