import { orders } from "@/lib/orders";
import { getSession } from "@/lib/session";

export const STATUSES = ["Pending", "Preparing", "On the way", "Delivered", "Cancelled"];

export async function GET(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json({ message: "Not signed in." }, { status: 401 }); // 401
  }

  const { id } = await params;

  const order = orders.find((item) => String(item.id) === String(id));

  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 }); // 404
  }

  // Authentication passed. Now authorisation: is it THEIR order?
  const isOwner = order.userId === session.id;
  const isStaff = session.role === "staff";

  if (!isOwner && !isStaff) {
    return Response.json({ message: "Not yours." }, { status: 403 }); // 403
  }

  return Response.json(order);
}

// Staff only: change an order's status (used by the kitchen page).
export async function PATCH(request, { params }) {
  const session = await getSession();

  if (!session) {
    return Response.json({ message: "Not signed in." }, { status: 401 });
  }

  // Role is checked here, on the server. Hiding the link is not security.
  if (session.role !== "staff") {
    return Response.json({ message: "Not allowed." }, { status: 403 });
  }

  const { id } = await params;

  const order = orders.find((item) => String(item.id) === String(id));

  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!STATUSES.includes(body?.status)) {
    return Response.json({ message: "Invalid status." }, { status: 422 });
  }

  order.status = body.status;

  return Response.json(order);
}
