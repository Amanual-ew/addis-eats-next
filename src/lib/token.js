import { SignJWT, jwtVerify } from "jose";

// Edge-safe: no next/headers here, so middleware can import it too.

export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days, in seconds

function getKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Add it to .env.local (see .env.local.example)."
    );
  }

  return new TextEncoder().encode(secret);
}

// Claims kept in the token. Keep this small: it travels on every request.
export async function createToken(user) {
  return new SignJWT({
    name: user.name,
    phone: user.phone,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getKey());
}

// Returns { id, name, phone, role } or null. Never throws on a bad token.
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getKey(), {
      algorithms: ["HS256"],
    });

    if (typeof payload.sub !== "string") return null;

    return {
      id: payload.sub,
      name: typeof payload.name === "string" ? payload.name : "",
      phone: typeof payload.phone === "string" ? payload.phone : "",
      role: payload.role === "staff" ? "staff" : "customer",
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true, // JavaScript cannot read it
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // not sent from other sites
  path: "/",
  maxAge: SESSION_MAX_AGE,
};