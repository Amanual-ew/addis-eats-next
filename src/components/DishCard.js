// src/components/DishCard.jsx
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { discountedPrice, hasDiscount } from "@/lib/pricing";

const etb = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" });

// `priority` should be true only for the first card (the LCP image).
// `compact` makes a smaller card (used by the home-page "Today's special").
export default function DishCard({ dish, priority = false, compact = false }) {
  const soldOut = dish.available === false;
  const onSale = hasDiscount(dish);
  const finalPrice = discountedPrice(dish);

  // The cart and checkout read dish.price, so give them the discounted price.
  const cartDish = onSale
    ? { ...dish, price: finalPrice, originalPrice: dish.price }
    : dish;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Image
          src={dish.image}
          alt={dish.name}
          width={600}
          height={400}
          sizes="(min-width: 1152px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className={`${compact ? "h-32" : "h-52"} w-full object-cover transition duration-500 group-hover:scale-110 ${
            soldOut ? "grayscale" : ""
          }`}
        />

        {/* Top left: category */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#ff6f61] backdrop-blur">
          {dish.category}
        </span>

        {/* Top right: discount */}
        {!soldOut && onSale && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">
            {dish.discount}% off
          </span>
        )}

        {/* Bottom left: today's special */}
        {!soldOut && dish.special && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[#ff6f61] px-3 py-1 text-xs font-bold text-white shadow">
            ★ Today&apos;s special
          </span>
        )}

        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-white px-4 py-1 text-sm font-bold text-gray-900">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-5"}`}>
        <div className="flex items-start justify-between gap-3">
          <h2 className={`font-bold text-gray-900 ${compact ? "text-base" : "text-lg"}`}>
            {dish.name}
          </h2>
          <div className="flex flex-col items-end gap-0.5">
            <strong className="whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-sm text-[#ff6f61]">
              {etb.format(finalPrice)}
            </strong>
            {onSale && (
              <span className="text-xs text-gray-400 line-through">
                <span className="sr-only">Original price </span>
                {etb.format(dish.price)}
              </span>
            )}
          </div>
        </div>

        <p
          className={`leading-relaxed text-gray-500 ${
            compact ? "line-clamp-1 text-xs" : "line-clamp-2 text-sm"
          }`}
        >
          {dish.description}
        </p>

        <div
          className={`mt-auto flex flex-wrap items-center justify-between gap-2 ${
            compact ? "pt-2" : "pt-4"
          }`}
        >
          {soldOut ? (
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-gray-500"
            >
              Sold out
            </button>
          ) : (
            <AddToCartButton dish={cartDish} />
          )}

          <Link
            href={`/menu/${dish.slug}`}
            className="text-sm font-semibold text-gray-500 transition hover:text-[#ff6f61]"
          >
            View Dish →
          </Link>
        </div>
      </div>
    </article>
  );
}