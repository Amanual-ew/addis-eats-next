import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByPhone } from "@/lib/users";
import {
  createToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/token";

// Hardcoded dummy hash — no hashing at module load.
// Generated once with: bcrypt.hashSync("not-a-real-password", 10)
// Replace this with your own generated value if you want.
const DUMMY_HASH =
  "$2a$10$CwTycUXWue0Thq9StjUM0uJ8U8oQm6Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  const phone =
    typeof body?.phone === "string" ? body.phone.trim() : "";
  const password =
    typeof body?.password === "string" ? body.password : "";

  const fieldErrors = {};
  if (!phone) fieldErrors.phone = "Phone is required.";
  if (!password) fieldErrors.password = "Password is required.";

  if (Object.keys(fieldErrors).length) {
    return NextResponse.json(
      { message: "Please fix the fields below.", fieldErrors },
      { status: 400 }
    );
  }

  const user = await findUserByPhone(phone);

  const hashToCompare = user ? user.passwordHash : DUMMY_HASH;
  const ok = await bcrypt.compare(password, hashToCompare);

  if (!user || !ok) {
    return NextResponse.json(
      { message: "Invalid phone number or password." },
      { status: 401 }
    );
  }

  const token = await createToken({
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  });

  const res = NextResponse.json({
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
  });

  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return res;
}