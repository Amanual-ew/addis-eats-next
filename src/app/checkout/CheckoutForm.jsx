"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";
import { orderSchema, DELIVERY_AREAS } from "../../lib/validation";

function fieldClass(isTouched, error) {
  const base =
    "w-full rounded-xl border bg-white px-4 py-3 outline-none transition focus:ring-2";
  if (!isTouched)
    return `${base} border-gray-300 focus:border-[#ff6f61] focus:ring-orange-200`;
  return error
    ? `${base} border-red-400 focus:ring-red-100`
    : `${base} border-green-400 focus:ring-green-100`;
}

export default function CheckoutForm() {
  const { cart, total, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    area: false,
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // =========================
  // VALIDATION
  // =========================

  const validation = useMemo(() => {
    const result = orderSchema.safeParse({
      name,
      phone,
      area,
      items: cart,
    });

    if (result.success) {
      return {
        success: true,
        errors: {},
      };
    }

    const errors = {};

    for (const issue of result.error.issues) {
      const key = String(issue.path[0]);

      if (!errors[key]) {
        errors[key] = issue.message;
      }
    }

    return {
      success: false,
      errors,
    };
  }, [name, phone, area, cart]);

  const isValid = validation.success && cart.length > 0;

  const nameError = touched.name ? validation.errors.name || "" : "";
  const phoneError = touched.phone ? validation.errors.phone || "" : "";
  const areaError = touched.area ? validation.errors.area || "" : "";

  // =========================
  // PHONE
  // =========================

  function handlePhoneChange(e) {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);

    setPhone(cleaned);

    if (cleaned.length > 0) {
      setTouched((t) => ({
        ...t,
        phone: true,
      }));
    }
  }

  // =========================
  // SUBMIT
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      area: true,
    });

    setServerError("");

    if (!isValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          area,
          items: cart,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setServerError(data.message || "Failed to place order.");
        return;
      }

      setOrderTotal(total);
      setOrderPlaced(true);

      clearCart();
    } catch (error) {
      console.error("Order error:", error);

      setServerError("Could not connect to the server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // =========================
  // ORDER CONFIRMATION
  // =========================

  if (orderPlaced) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl font-bold text-green-600">
          ✓
        </div>

        <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
          Order Confirmed! 🎉
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you, <strong>{name.trim()}</strong>!
        </p>

        <p className="mt-4 text-sm text-gray-500">
          Your order will be delivered to:
        </p>

        <h3 className="text-xl font-bold text-gray-900">{area}</h3>

        <p className="text-gray-600">Phone: {phone}</p>

        <div className="mt-5 inline-block rounded-full bg-orange-50 px-6 py-2 text-lg font-bold text-[#ff6f61]">
          Total: {orderTotal} ETB
        </div>

        <p className="mt-5 text-sm text-gray-500">
          We have received your order and will prepare it shortly.
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-8 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95"
        >
          Continue Shopping 🍴
        </Link>
      </div>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Your cart is empty 🛒
        </h1>

        <p className="mt-2 text-gray-500">
          Please add some food before checking out.
        </p>

        <Link
          href="/menu"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 px-8 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-105 active:scale-95"
        >
          Browse Menu 🍴
        </Link>
      </div>
    );
  }

  // =========================
  // CHECKOUT FORM
  // =========================

  return (
    <div className="grid gap-8 md:grid-cols-5">
      {/* CHECKOUT FORM */}

      <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-lg md:col-span-3">
        <h1 className="mb-6 text-3xl font-extrabold text-gray-900">
          Checkout 💳
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* NAME */}

          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);

                if (e.target.value.length > 0) {
                  setTouched((t) => ({
                    ...t,
                    name: true,
                  }));
                }
              }}
              onBlur={() =>
                setTouched((t) => ({
                  ...t,
                  name: true,
                }))
              }
              autoComplete="name"
              aria-invalid={!!nameError}
              aria-describedby="name-error"
              className={fieldClass(touched.name, nameError)}
              required
            />

            {nameError && (
              <small
                id="name-error"
                className="mt-1 block text-sm text-red-500"
                role="alert"
              >
                {nameError}
              </small>
            )}
          </div>

          {/* PHONE */}

          <div>
            <label
              htmlFor="phone"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Phone Number
            </label>

            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="0912345678"
              value={phone}
              onChange={handlePhoneChange}
              onBlur={() =>
                setTouched((t) => ({
                  ...t,
                  phone: true,
                }))
              }
              autoComplete="tel"
              maxLength={10}
              aria-invalid={!!phoneError}
              aria-describedby="phone-error"
              className={fieldClass(touched.phone, phoneError)}
              required
            />

            {phoneError && (
              <small
                id="phone-error"
                className="mt-1 block text-sm text-red-500"
                role="alert"
              >
                {phoneError}
              </small>
            )}
          </div>

          {/* AREA */}

          <div>
            <label
              htmlFor="area"
              className="mb-1 block text-sm font-semibold text-gray-700"
            >
              Delivery Area
            </label>

            <select
              id="area"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);

                setTouched((t) => ({
                  ...t,
                  area: true,
                }));
              }}
              onBlur={() =>
                setTouched((t) => ({
                  ...t,
                  area: true,
                }))
              }
              aria-invalid={!!areaError}
              className={fieldClass(touched.area, areaError)}
              required
            >
              <option value="">Select your area</option>

              {DELIVERY_AREAS.map((deliveryArea) => (
                <option key={deliveryArea} value={deliveryArea}>
                  {deliveryArea}
                </option>
              ))}
            </select>

            {areaError && (
              <small className="mt-1 block text-sm text-red-500" role="alert">
                {areaError}
              </small>
            )}
          </div>

          {/* SERVER ERROR */}

          {serverError && (
            <p
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600"
              role="alert"
            >
              ❌ {serverError}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-[#ff6f61] to-orange-400 py-3 font-semibold text-white shadow-md shadow-orange-200 transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            disabled={!isValid || isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Place Order 🚀"}
          </button>
        </form>
      </div>

      {/* ORDER SUMMARY */}

      <div className="h-fit rounded-3xl border border-orange-100 bg-white p-6 shadow-lg md:sticky md:top-24 md:col-span-2">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Order Summary</h2>

        {cart.map((item) => (
          <div
            className="flex items-center justify-between border-b border-orange-50 py-3"
            key={item.id}
          >
            <div>
              <strong className="text-gray-900">{item.name}</strong>

              <p className="text-sm text-gray-500">
                {item.quantity} × {item.price} ETB
              </p>
            </div>

            <strong className="text-gray-800">
              {item.quantity * item.price} ETB
            </strong>
          </div>
        ))}

        <div className="mt-4 flex justify-between text-lg font-bold text-gray-900">
          <span>Total</span>

          <strong className="text-[#ff6f61]">{total} ETB</strong>
        </div>
      </div>
    </div>
  );
}
