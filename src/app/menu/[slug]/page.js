import Image from "next/image";
import { notFound } from "next/navigation";
import { dishes } from "@/lib/dishes";
import { discountedPrice, hasDiscount } from "@/lib/pricing";
import AddToCartButton from "@/components/AddToCartButton";

// Staff can now change prices, discounts and availability at any time, so this
// page must be rendered on each request. (generateStaticParams was removed:
// it froze every dish at build time, so changes would never show up here.)
export const dynamic = "force-dynamic";

// ---------- 1. Dynamic metadata (Exercise 3) ----------
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dish = dishes.find((item) => item.slug === slug);

  if (!dish) {
    return { title: "Dish not found" };
  }

  const price = discountedPrice(dish);
  const description = `${dish.name} – ${price} ETB. ${dish.description}`;

  return {
    title: dish.name, // → "Kitfo - Addis Eats" via root template
    description,
    alternates: { canonical: `/menu/${dish.slug}` },
    openGraph: {
      type: "website",
      locale: "en_ET",
      siteName: "Addis Eats",
      title: `${dish.name} - Addis Eats`,
      description,
      images: [
        {
          url: `/menu/${dish.slug}/opengraph-image`, // Exercise 4 file convention
          width: 1200,
          height: 630,
          alt: `${dish.name} – ${price} ETB`,
        },
      ],
    },
  };
}

// ---------- 2. Page ----------
export default async function DishPage({ params }) {
  const { slug } = await params;
  const dish = dishes.find((item) => item.slug === slug);

  if (!dish) {
    notFound();
  }

  // A missing "available" field counts as available.
  const soldOut = dish.available === false;
  const onSale = hasDiscount(dish);
  const price = discountedPrice(dish);

  // The cart and checkout read dish.price, so give them the discounted price.
  const cartDish = onSale
    ? { ...dish, price, originalPrice: dish.price }
    : dish;

  // ---------- 3. JSON-LD (Exercise 5) ----------
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: dish.image,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "ETB",
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl shadow-xl">
          <Image
            src={dish.image}
            alt={dish.name}
            width={400}
            height={300}
            priority
            className={`h-80 w-full object-cover transition duration-500 hover:scale-105 md:h-96 ${
              soldOut ? "grayscale" : ""
            }`}
          />

          {!soldOut && (onSale || dish.special) && (
            <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
              {onSale && (
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {dish.discount}% off
                </span>
              )}
              {dish.special && (
                <span className="rounded-full bg-[#ff6f61] px-3 py-1 text-xs font-bold text-white">
                  ★ Today&apos;s special
                </span>
              )}
            </div>
          )}

          {soldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/45">
              <span className="rounded-full bg-white px-5 py-2 text-base font-bold text-gray-900">
                Sold out
              </span>
            </div>
          )}
        </div>

        <div>
          <span className="inline-block rounded-full bg-orange-100 px-4 py-1 text-sm font-semibold text-[#ff6f61]">
            {dish.category}
          </span>

          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900">
            {dish.name}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-gray-500">
            {dish.description}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-extrabold text-[#ff6f61]">{price} ETB</p>
            {onSale && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  <span className="sr-only">Original price </span>
                  {dish.price} ETB
                </span>
                <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {dish.discount}% off
                </span>
              </>
            )}
          </div>

          <div className="mt-8">
            {soldOut ? (
              <>
                <button
                  type="button"
                  disabled
                  className="cursor-not-allowed rounded-full bg-gray-200 px-6 py-3 font-semibold text-gray-500"
                >
                  Sold out
                </button>
                <p className="mt-3 text-sm text-gray-500">
                  This dish isn&apos;t available right now. Please check back later.
                </p>
              </>
            ) : (
              <AddToCartButton dish={cartDish} />
            )}
          </div>
        </div>
      </div>

      {/* Exercise 5: JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}