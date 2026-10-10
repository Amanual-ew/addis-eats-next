import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/token";

export async function POST() {
  (await cookies()).delete(SESSION_COOKIE);

  return NextResponse.json({ message: "Signed out." });
}
