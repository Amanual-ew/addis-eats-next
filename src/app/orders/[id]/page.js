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

  // Layer 2: verify the session while rendering.
  const session = await getSession();

  if (!session) {
    redirect(`/signin?next=/orders/${id}`);
  }

  // Normalize IDs to strings so number/string mismatch can't cause false negatives.
  const order = orders.find((item) => String(item.id) === String(id));

  // Support both `session.id` and `session.userId` shapes so a naming
  // mismatch doesn't silently break the ownership check.
  const sessionUserId = session.id ?? session.userId;

  const isOwner = order && String(order.userId) === String(sessionUserId);
  const isStaff = session.role === "staff" || session.role === "admin";

  // Someone else's order must look identical to a missing one (no info leak).
  if (!order || (!isOwner && !isStaff)) {
    notFound();
  }

  return <OrderDetails orderId={id} initialOrder={order} />;
}