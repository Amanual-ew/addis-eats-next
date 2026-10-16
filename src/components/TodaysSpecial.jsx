"use client";

import useSWR from "swr";
import DishCard from "@/components/DishCard";

const fetcher = (url) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load");
    return r.json();
  });

// The animation CSS lives here, inside the component, so it does not depend
// on globals.css being edited or imported correctly.
const MARQUEE_CSS = `
@keyframes todays-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.todays-marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 5%, #000 95%, transparent);
}
.todays-track {
  display: flex;
  width: max-content;
  animation-name: todays-scroll;
  animation-duration: var(--todays-duration, 40s);
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
/* Pause while someone hovers or uses a card. */
.todays-marquee:hover .todays-track,
.todays-marquee:focus-within .todays-track {
  animation-play-state: paused;
}
`;

// Home-page section. Use it as <TodaysSpecial /> (no props).
//   - 0 specials  -> renders nothing
//   - 1 special   -> one static card (no animation)
//   - 2+ specials -> cards scroll continuously (pauses on hover/focus)
//
// It loads from /api/dishes, the same source as the staff menu table,
// so it always shows what staff just saved.
export default function TodaysSpecial() {
  const { data } = useSWR("/api/dishes", fetcher, { revalidateOnFocus: true });

  const list = Array.isArray(data) ? data : data?.dishes ?? [];
  const specials = list.filter((d) => d.special && d.available !== false);
  if (specials.length === 0) return null;

  return (
    // No width/padding here: the page's <main> already provides the container.
    <section aria-labelledby="todays-special" className="mt-24">
      <div className="mb-6 flex items-center gap-3">
        <span className="rounded-full bg-[#ff6f61] px-3 py-1 text-xs font-bold tracking-wide text-white">
          TODAY
        </span>
        <h2 id="todays-special" className="text-3xl font-extrabold tracking-tight text-gray-900">
          Today&apos;s special
        </h2>
      </div>

      {specials.length === 1 ? (
        <div className="w-60 sm:w-64">
          <DishCard dish={specials[0]} compact />
        </div>
      ) : (
        <Marquee specials={specials} />
      )}
    </section>
  );
}

function Marquee({ specials }) {
  // Each half of the track must be wider than the screen, so repeat the
  // specials until one half holds at least 8 cards. The animation moves the
  // track by exactly one half (-50%), which makes the loop seamless.
  const perHalf = Math.ceil(8 / specials.length);
  const copies = perHalf * 2;
  const duration = specials.length * perHalf * 7; // ~7s per card

  return (
    <>
      <style>{MARQUEE_CSS}</style>

      <div
        className="todays-marquee"
        aria-roledescription="carousel"
        aria-label="Today's special dishes"
      >
        <div className="todays-track py-6" style={{ "--todays-duration": `${duration}s` }}>
          {Array.from({ length: copies }).map((_, copy) =>
            specials.map((dish) => (
              <div
                key={`${copy}-${dish.id}`}
                className="mr-4 w-60 shrink-0 sm:w-64"
                // Only the first copy is real; the rest are for the loop.
                aria-hidden={copy > 0 ? true : undefined}
                inert={copy > 0}
              >
                <DishCard dish={dish} compact />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}