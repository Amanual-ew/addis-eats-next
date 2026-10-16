import { discountedPrice, hasDiscount } from "@/lib/pricing";

// Shows the price of a dish. With a discount: old price crossed out,
// new price in bold, and a "-20%" badge.
export default function DishPrice({ dish, className = "" }) {
  if (!hasDiscount(dish)) {
    return (
      <span className={`font-semibold tabular-nums ${className}`}>
        {dish.price} ETB
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-2 ${className}`}>
      <span className="font-semibold tabular-nums text-gray-900">
        {discountedPrice(dish)} ETB
      </span>
      <span className="text-sm tabular-nums text-gray-500 line-through">
        {dish.price} ETB
      </span>
      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold uppercase text-red-700">
        {dish.discount}% off
      </span>
    </span>
  );
}