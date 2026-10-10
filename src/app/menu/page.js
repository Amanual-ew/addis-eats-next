import DishList from "../../components/DishList";
import { Suspense } from "react";
import CategoryBar from "../../components/CategoryBar";

export const metadata = {
  title: "Menu",
  description:
    "Doro Wat, Tibs, Kitfo and Shiro, delivered across Addis Ababa. Browse the full menu and order in minutes.",
  alternates: { canonical: "/menu" },
};

export const revalidate = 3600;

export default async function Menu({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || "All";

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]">
          ADDIS EATS MENU
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Our Menu 🍽️
        </h1>
        <Suspense><CategoryBar selectedCategory={category} /></Suspense>
        
        <p className="mx-auto mt-3 max-w-xl text-lg text-gray-500">
          Choose from our delicious Ethiopian dishes.
        </p>
      </div>

      <DishList category={category} />
    </main>
  );
}