import { Suspense } from "react";
import { NextRequest } from "next/server";
import { UtensilsCrossed } from "lucide-react";
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
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      {/* Header: left-aligned on mobile (matches search + cards), centered from md up */}
      <header className="mb-6 text-left md:mb-8 md:text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#ff6f61] sm:text-sm">
          Delivery across Addis Ababa
        </p>

        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:justify-center md:text-5xl">
          Our Menu
          <UtensilsCrossed
            className="h-7 w-7 text-[#ff6f61] sm:h-8 sm:w-8 md:h-10 md:w-10"
            aria-hidden="true"
          />
        </h1>

        <p className="mt-2 max-w-xl text-base text-gray-500 md:mx-auto md:mt-3 md:text-lg">
          Fresh meals, delivered to your door.
        </p>
      </header>

      <Suspense fallback={<div className="mb-6 h-12" aria-hidden="true" />}>
        <CategoryBar />
      </Suspense>

      <DishList
        category={category}
        initialData={initialData}
        initialSearch={search}
        initialPage={page}
      />
    </main>
  );
}