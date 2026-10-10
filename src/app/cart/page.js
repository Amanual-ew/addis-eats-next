"use client";

import Link from "next/link";
import { useCart } from "../../components/CartProvider";


export default function Cart() {
  const {
    cart,
    total,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
  <main className="mx-auto max-w-4xl px-6 py-12">
    <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-gray-900">
      Your Cart 🛒
    </h1>

    {cart.length === 0 ? (
      <div className="rounded-3xl border border-orange-100 bg-white p-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty 😕</h2>
        <p className="mt-2 text-gray-500">Add some delicious food to your order.</p>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-8 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 hover:shadow-lg active:scale-95"
        >
          Browse Menu 🍴
        </Link>
      </div>
    ) : (
      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.price} ETB each</p>
              </div>

              <div className="flex items-center gap-3 rounded-full bg-orange-50 px-2 py-1">
                <button
                  onClick={() => decreaseQuantity(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-[#ff6f61] shadow-sm transition hover:bg-[#ff6f61] hover:text-white active:scale-90"
                >
                  −
                </button>

                <span className="w-6 text-center font-semibold">{item.quantity}</span>

                <button
                  onClick={() => increaseQuantity(item.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white font-bold text-[#ff6f61] shadow-sm transition hover:bg-[#ff6f61] hover:text-white active:scale-90"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <strong className="text-lg text-[#ff6f61]">
                  {item.price * item.quantity} ETB
                </strong>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="mt-1 block text-sm font-medium text-gray-400 transition hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-3xl border border-orange-100 bg-white p-6 shadow-lg md:sticky md:top-24">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <strong>{total} ETB</strong>
          </div>

          <div className="mt-2 flex justify-between text-gray-600">
            <span>Delivery</span>
            <strong className="text-green-600">Free</strong>
          </div>

          <hr className="my-4 border-orange-100" />

          <div className="flex justify-between text-lg font-bold text-gray-900">
            <span>Total</span>
            <strong className="text-[#ff6f61]">{total} ETB</strong>
          </div>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 py-3 text-center font-semibold text-white shadow-md shadow-orange-200 transition hover:bg-[#ff6f61] hover:shadow-lg active:scale-95"
          >
            Proceed to Checkout 💳
          </Link>
        </div>
      </div>
    )}
  </main>
);
}