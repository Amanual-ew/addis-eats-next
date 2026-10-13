
import { orderSchema } from "@/lib/validation";
import { orders, createOrder } from "@/lib/orders";
import { getSession } from "@/lib/session";

// Customers can only see their own orders.
export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { message: "Not signed in." },
      { status: 401 }
    );
  }

  const mine = orders.filter(
    (order) => order.userId === session.id
  );

  return Response.json(mine);
}

// Create a new order.
export async function POST(request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      { message: "Please sign in to place an order." },
      { status: 401 }
    );
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

    // Use the shared function to calculate and save the order total.
    const newOrder = createOrder({
      userId: session.id,
      name,
      phone,
      area,
      items,
    });

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
      { message: "Invalid request." },
      { status: 400 }
    );
  }
}

