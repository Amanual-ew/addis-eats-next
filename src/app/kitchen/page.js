import { redirect } from "next/navigation";
import { orders } from "@/lib/orders";
import { getSession } from "@/lib/session";
import KitchenBoard from "@/components/KitchenBoard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Kitchen | Addis Eats",
};

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/kitchen");
  }

  // Role check on the server, not in the markup.
  if (session.role !== "staff") {
    redirect("/");
  }

  const list = [...orders].reverse();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]">
          STAFF ONLY
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Kitchen 👨‍🍳
        </h1>
      </div>

      <KitchenBoard orders={list} />
    </main>
  );
}
