// One place that decides what a dish costs. Use it everywhere a price is
// shown or added up (menu, cart, checkout, order total) so they never disagree.

export function discountPercent(dish) {
  const pct = Number(dish?.discount) || 0;
  return Math.min(90, Math.max(0, pct));
}

export function hasDiscount(dish) {
  return discountPercent(dish) > 0;
}

// Price after discount, rounded to whole ETB.
export function finalPrice(dish) {
  const price = Number(dish?.price) || 0;
  const pct = discountPercent(dish);
  return pct > 0 ? Math.round(price * (1 - pct / 100)) : price;
}

// Name used by components/DishPrice.jsx.
export const discountedPrice = finalPrice;

export function formatETB(n) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);
}