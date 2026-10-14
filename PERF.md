# PERF.md - Performance notes

## 1. How to measure (do this every time)
1. Stop the dev server, then build and serve the production version:
   ```bash
   npm run build
   npm run start
   ```
   Do **not** test on `npm run dev`. Dev mode is unminified, ships React's development build and hot-reload
   scripts, and shows false "Minify JavaScript", "Reduce unused JavaScript" and long-task warnings.
2. Open the page in an **incognito** window (extensions add their own JavaScript time).
3. DevTools (F12) -> Lighthouse -> Mobile -> Analyze page load. Test one page at a time. Run twice;
   scores move a few points between runs.
4. Localhost has no network delay, so real-site numbers will be slightly worse. For a closer match,
   test the deployed URL with PageSpeed Insights.

## 2. Findings so far

### Dev-mode run (any page)
Reduce JavaScript execution time (2.8 s), Minimize main-thread work (4.9 s), Minify JavaScript (222 KiB),
Minify CSS (2 KiB), Reduce unused JavaScript (317 KiB), 15 long tasks. Mostly caused by `next dev`;
re-test on a production build before acting on these.

### `/menu` (Performance 40; Accessibility 96, Best Practices 100, SEO 100)
- **Improve image delivery: about 12,404 KiB estimated savings.** The main problem.
- Layout shift culprits, LCP request discovery, Network dependency tree: all driven by the same images.
- Minor: Render-blocking requests (70 ms), Legacy JavaScript (9 KiB), DOM size.

### Root cause found
The Network tab showed requests like `/images/cheesBurger.jpg` and no `/_next/image?url=...&w=...` URLs.
So the browser was downloading the original files directly: Next's image optimization was not being used.
In `DishCard`, every image also had `loading="eager"` (downloads everything immediately) and a `sizes`
value that did not match the real grid.

## 3. Fixes

### Images
- Use `next/image` for every photo; no plain `<img>` anywhere (search the project for `<img` and `unoptimized`).
- `DishCard`: remove `loading="eager"`; add a `priority` prop and pass `priority={index < 3}` from the menu
  page so only the first visible cards load early; use `width={600} height={400}`; set `sizes` to match the
  grid, for example
  `(min-width: 1152px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw`.
- Use short alt text (the dish name); the description is already visible.
- Compress the source files: `node scripts/optimize-images.mjs public/images public/images-optimized`
  resizes to 1200 px wide and writes `.webp` copies (originals untouched). Then point `dish.image` at the
  `.webp` files and delete the big originals.
- `next.config.mjs` is optional. Image optimization is on by default. To prefer AVIF:
  ```js
  const nextConfig = { images: { formats: ["image/avif", "image/webp"] } };
  export default nextConfig;
  ```
  Never set `images.unoptimized: true`. External image hosts must be listed in `images.remotePatterns`.

### Verify the fix
Network tab -> Img filter -> reload with "Disable cache" ticked. Image URLs should look like
`/_next/image?url=%2Fimages%2Fpizza.jpg&w=640&q=75`, each well under about 100 KB.

## 4. Other improvements to consider
- **Map animation (tracking page):** the courier animation updates React state on every frame for 10 s,
  re-rendering the component about 60 times a second. Move the Leaflet marker directly inside the animation
  loop and update React state only when it finishes.
- **Polling:** orders list and kitchen board refresh every 3 s, and the tracking stream checks the server
  every 1 s. Raise these (5-10 s) if main-thread work matters.
- **Header:** remove the unused `CartProvider`/`useCart` import.
- **Bundle size:** add `@next/bundle-analyzer` and confirm Leaflet loads only on the tracking page (the
  dynamic import with `ssr: false` already does this).
- **Fonts:** load them with `next/font`.

## 5. Checklist
- [ ] Production build tested (`npm run build` + `npm run start`), incognito
- [ ] No `<img>` or `unoptimized` left in the project
- [ ] `DishCard` uses `priority` only for the first 3 cards, no `loading="eager"`
- [ ] Source images compressed to `.webp` (`scripts/optimize-images.mjs`)
- [ ] `/menu` Lighthouse score re-measured (baseline: 40)
- [ ] Map animation moved off per-frame React state
- [ ] Polling intervals reviewed