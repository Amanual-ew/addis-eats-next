// app/checkout/page.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifyToken } from "@/lib/token";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | Addis Eats",
  description: "Complete your order and get it delivered.",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  // Layer 2: re-check the session server-side
  const token = cookies().get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (!session) {
    redirect("/signin?next=/checkout");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-[#ff6f61]">
          ALMOST THERE
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Checkout 🧾
        </h1>
      </div>

      <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-lg md:p-10">
        <CheckoutForm />
      </div>
    </main>
  );
}