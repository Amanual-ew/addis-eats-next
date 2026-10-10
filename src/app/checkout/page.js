import CheckoutForm from "./CheckoutForm";


export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | Your Restaurant",
  description: "Complete your order and get it delivered.",
};

export default function CheckoutPage() {
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