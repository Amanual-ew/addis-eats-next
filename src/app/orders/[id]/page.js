// src/app/orders/[id]/page.jsx  (REPLACE)
import OrderDetail from "./OrderDetail";

export const dynamic = "force-dynamic";

export const metadata = { title: "Order details" };

// The page itself no longer looks the order up on the server: on Vercel the
// server instance that answers this request may not be the one that holds the
// order. OrderDetail (a client component) asks the API first, then falls back
// to the copy saved in this browser.
export default async function OrderPage({ params }) {
  const { id } = await params;
  return <OrderDetail id={id} />;
}