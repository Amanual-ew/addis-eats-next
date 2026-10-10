
import { NextResponse } from "next/server";
import {
  findUserByPhone,
  createUser,
} from "@/lib/users";
import {
  createToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/token";

export async function POST(request) {
  const body = await request.json().catch(() => null);

  const name =
    typeof body?.name === "string" ? body.name.trim() : "";
  const phone =
    typeof body?.phone === "string" ? body.phone.trim() : "";
  const password =
    typeof body?.password === "string" ? body.password : "";

  const fieldErrors = {};

  if (name.length < 2) {
    fieldErrors.name = "Enter your full name.";
  }

  if (!/^09\d{8}$/.test(phone)) {
    fieldErrors.phone = "Enter a valid 10-digit phone number.";
  }

  if (password.length < 6) {
    fieldErrors.password = "At least 6 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      {
        message: "Please fix the fields below.",
        fieldErrors,
      },
      { status: 400 }
    );
  }

  // Prevent duplicate phone registrations.
  if (findUserByPhone(phone)) {
    return NextResponse.json(
      {
        message: "That phone number is already registered.",
        fieldErrors: {
          phone: "Already registered.",
        },
      },
      { status: 409 }
    );
  }

  // createUser hashes the password and saves the user.
  const user = createUser({
    name,
    phone,
    password,
  });

  const token = await createToken({
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  });

  const response = NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    },
    { status: 201 }
  );

  response.cookies.set(
    SESSION_COOKIE,
    token,
    sessionCookieOptions
  );

  return response;
}