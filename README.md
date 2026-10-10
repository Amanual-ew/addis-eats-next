# Addis Eats — Next.js

A food-ordering application built on Next.js App Router, rebuilt from the
Day 35 Vite version. Same domain, different framework — the comparison
between the two is part of what this project demonstrates.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **Zod** — shared validation schema used by both the form and the server
- **localStorage** — cart persistence on the client

## Routes

| Route | Rendering | What it does |
|-------|-----------|--------------|
| `/` | Static | Landing page with today's specials |
| `/menu` | Dynamic | Fetched dishes, category filter via `?category=` |
| `/menu/[slug]` | Static via `generateStaticParams` | One dish, add to order |
| `/cart` | Static shell + client | Order lines and running ETB total |
| `/checkout` | Dynamic | Server action, validated, guarded |

## API Endpoints

### `GET /api/dishes`

Returns the full dish list as JSON.

```bash
curl -i localhost:3000/api/dishes