import { notFound, redirect } from "next/navigation";
import { orders } from "@/lib/orders";
import { getSession } from "@/lib/session";
import OrderDetails from "@/components/OrderDetails";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Order details | Addis Eats",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }) {
  const { id } = await params;

  // Verify the session while rendering (don't rely on middleware alone).
  const session = await getSession();

  if (!session) {
    // Encode the whole return path so characters in `id` (&, ?, #, etc.)
    // can't alter the query string or redirect target.
    redirect(`/signin?next=${encodeURIComponent(`/orders/${id}`)}`);
  }

  // Normalize IDs to strings so number/string mismatch can't cause false negatives.
  const order = orders.find((item) => String(item.id) === String(id));

  // Support both `session.id` and `session.userId` shapes.
  const sessionUserId = session.id ?? session.userId;

  // Fail closed: if either side has no user id, nobody "owns" the order.
  // Without this, String(undefined) === String(undefined) would grant access.
  const isOwner =
    order != null &&
    sessionUserId != null &&
    order.userId != null &&
    String(order.userId) === String(sessionUserId);

  const isStaff = session.role === "staff" || session.role === "admin";

  // Someone else's order must look identical to a missing one (no info leak).
  if (!order || (!isOwner && !isStaff)) {
    notFound();
  }

  return <OrderDetails orderId={String(order.id)} initialOrder={order} />;
}