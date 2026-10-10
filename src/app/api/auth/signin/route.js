import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { findUserByPhone } from "@/lib/users";
import {
  createToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/token";

// A real hash to compare against when the phone is unknown,
// so "no such user" and "wrong password" take the same time.
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const phone = String(body?.phone || "").trim();
  const password = String(body?.password || "");

  const user = findUserByPhone(phone);

  const ok = bcrypt.compareSync(password, user ? user.passwordHash : DUMMY_HASH);

  if (!user || !ok) {
    // Same message for both cases: do not reveal which part was wrong.
    return NextResponse.json(
      { message: "Invalid phone number or password." },
      { status: 401 }
    );
  }

  const token = await createToken(user);

  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.json({
    user: { id: user.id, name: user.name, role: user.role },
  });
}
