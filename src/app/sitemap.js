import { dishes } from "@/lib/dishes";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const now = new Date();

  // Static routes worth indexing
  const staticRoutes = [
    { url: `${base}/`, priority: 1.0, changeFrequency: "daily" },
    { url: `${base}/menu`, priority: 0.9, changeFrequency: "daily" },
  ];

  // One entry per dish
  const dishRoutes = dishes.map((dish) => ({
    url: `${base}/menu/${dish.slug}`,
    priority: 0.7,
    changeFrequency: "weekly",
    lastModified: now,
  }));

  return [...staticRoutes, ...dishRoutes];
}