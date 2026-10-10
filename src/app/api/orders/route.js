import { orderSchema } from "@/lib/validation";
import { orders } from "@/lib/orders";
import { getSession } from "@/lib/session";

// Customers only ever receive THEIR OWN orders.
// The filter uses the session's id, never an id from the request.
export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ message: "Not signed in." }, { status: 401 }); // 401
  }

  const mine = orders.filter((order) => order.userId === session.id);

  return Response.json(mine);
}

export async function POST(request) {
  // The real check is here, at the write.
  const session = await getSession();

  if (!session) {
    return Response.json({ message: "Please sign in to place an order." }, { status: 401 });
  }

  try {
    const body = await request.json();

    const result = orderSchema.safeParse(body);

    if (!result.success) {
      const fieldErrors = {};

      for (const issue of result.error.issues) {
        const field = String(issue.path[0]);

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      return Response.json(
        {
          message: "Validation failed.",
          fieldErrors,
        },
        { status: 422 }
      );
    }

    const { name, phone, area, items } = result.data;

    const newOrder = {
      id: Date.now(),
      userId: session.id, // from the session, never from the request body
      name,
      phone,
      area,
      items,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);

    return Response.json(
      {
        message: "Order received successfully.",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order API error:", error);

    return Response.json(
      {
        message: "Invalid request.",
      },
      { status: 400 }
    );
  }
}
