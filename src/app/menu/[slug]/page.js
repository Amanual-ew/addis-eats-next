import Image from "next/image";
import { notFound } from "next/navigation";
import { dishes } from "@/lib/dishes";
import AddToCartButton from "@/components/AddToCartButton";

// ---------- 1. Static params ----------
export function generateStaticParams() {
return dishes.map((dish) => ({
slug: dish.slug,
}));
}

// ---------- 2. Dynamic metadata ----------
export async function generateMetadata({ params }) {
const { slug } = await params;
const dish = dishes.find((item) => item.slug === slug);

if (!dish) {
return {
title: "Dish not found | Addis Eats",
};
}

const description = `${dish.name} – ${dish.price} ETB. ${dish.description}`;

// Set NEXT_PUBLIC_SITE_URL in .env.local to your deployed domain.
const siteUrl =
process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const imageUrl = dish.image.startsWith("http")
? dish.image
: `${siteUrl}${dish.image.startsWith("/") ? "" : "/"}${dish.image}`;

const pageUrl = `${siteUrl}/menu/${dish.slug}`;

return {
title: dish.name,
description,


alternates: {
  canonical: pageUrl,
},

openGraph: {
  type: "website",
  locale: "en_ET",
  siteName: "Addis Eats",
  url: pageUrl,
  title: `${dish.name} - Addis Eats`,
  description,
  images: [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt: `${dish.name} - Addis Eats`,
    },
  ],
},

twitter: {
  card: "summary_large_image",
  title: `${dish.name} - Addis Eats`,
  description,
  images: [imageUrl],
},


};
}

// ---------- 3. Page ----------
export default async function DishPage({ params }) {
const { slug } = await params;
const dish = dishes.find((item) => item.slug === slug);

if (!dish) {
notFound();
}

// ---------- 4. JSON-LD structured data ----------
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: dish.image,
    offers: {
    "@type": "Offer",
    price: dish.price,
    priceCurrency: "ETB",
    availability: "https://schema.org/InStock",
    },
};

return ( <main className="mx-auto max-w-5xl px-6 py-12"> <div className="grid items-center gap-10 md:grid-cols-2"> <div className="overflow-hidden rounded-3xl shadow-xl"> <Image
         src={dish.image}
         alt={dish.name}
         width={400}
         height={300}
         priority
         className="h-80 w-full object-cover transition duration-500 hover:scale-105 md:h-96"
       /> </div>


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

      <p className="mt-6 text-3xl font-extrabold text-[#ff6f61]">
        {dish.price} ETB
      </p>

      <div className="mt-8">
        <AddToCartButton dish={dish} />
      </div>
    </div>
  </div>

  {/* JSON-LD structured data */}
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
    }}
  />
</main>

);
}
