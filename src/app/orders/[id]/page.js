import { notFound, redirect } from "next/navigation";
import { orders } from "@/lib/orders";
import { getSession } from "@/lib/session";
import OrderDetails from "@/components/OrderDetails";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;

  // Layer 2: verify the session while rendering (middleware only checked a cookie).
  const session = await getSession();

  if (!session) {
    redirect(`/signin?next=/orders/${id}`);
  }

  const order = orders.find((item) => String(item.id) === String(id));

  // Someone else's order looks exactly like a missing one.
  if (!order || (order.userId !== session.id && session.role !== "staff")) {
    notFound();
  }

  return <OrderDetails orderId={id} initialOrder={order} />;
}
