import { cache } from "react";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifyToken } from "./token";

// One helper, used by pages, route handlers and actions alike.
// Reading cookies makes the calling route dynamic, which is correct:
// a page that depends on who is asking cannot be prerendered.
//
// cache() dedupes calls within a single request — if five components
// call getSession(), only one JWT verification runs.
export const getSession = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  return verifyToken(token); // returns { id, name, phone, role } or null
});