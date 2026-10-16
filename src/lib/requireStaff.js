import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Use at the top of any API handler that only staff may call.
// Returns { user } on success or { error } (a ready NextResponse) on failure.
export async function requireStaff() {
  const user = await getSession();
  if (!user) {
    return { error: NextResponse.json({ error: "Not signed in" }, { status: 401 }) };
  }
  if (user.role !== "staff") {
    return { error: NextResponse.json({ error: "Staff only" }, { status: 403 }) };
  }
  return { user };
}