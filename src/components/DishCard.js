// DishCard.jsx  (REPLACE) - same design, faster image loading
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

const etb = new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" });

// `priority` should be true only for the first 2-3 cards visible on load.
export default function DishCard({ dish, priority = false }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="relative overflow-hidden">
        <Image
          src={dish.image}
          alt={dish.name}
          // width/height only set the aspect ratio (3:2); the real size comes from `sizes`.
          width={600}
          height={400}
          // Match your real grid: 1 column on phones, 2 on tablets, 3 on desktop,
          // and cards never grow past ~380px inside a max-w-6xl container.
          sizes="(min-width: 1152px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={priority}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#ff6f61] backdrop-blur">
          {dish.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">{dish.name}</h2>
          <strong className="whitespace-nowrap rounded-full bg-orange-50 px-3 py-1 text-sm text-[#ff6f61]">
            {etb.format(dish.price)}
          </strong>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-500">
          {dish.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <AddToCartButton dish={dish} />

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