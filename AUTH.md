# AUTH.md - Sign-in, sessions and access

## 1. How it works

- **Session:** a signed JWT (HS256, library `jose`) stored in an `httpOnly` cookie named `session`
  (`src/lib/token.js`). It is `secure` in production, `sameSite: "lax"`, path `/`, valid for 7 days.
- **Payload:** `{ id, name, phone, role }` where `role` is `"customer"` or `"staff"`.
- **Reading the session on the server:** `getSession()` in `src/lib/session.js` (wrapped in React `cache()`,
  so it verifies the token once per request). It returns the payload or `null`.
- **Who am I (client):** `GET /api/auth/me` returns `{ user: { id, name, role } }`, or `{ user: null }` when
  signed out. The header uses it.

### Sign-in flow
1. `src/app/signin/page.js` posts `{ phone, password }` to `POST /api/auth/signin`.
2. The route finds the user (`findUserByPhone`), runs `bcrypt.compare` (against a dummy hash if the user does
   not exist, so timing is similar), and answers 401 on failure.
3. On success it creates the token (`createToken`) and sets the cookie.
4. The page does a hard navigation (`window.location.assign`) so the cookie is committed first.

### Where people go after signing in
1. `?next=/some/path` if present and it is a path on this site (must start with `/`, never `//`).
2. Otherwise staff go to `/dashboard` and customers go to `/menu`.

`next` is set by the page that required sign-in, for example the kitchen page does
`redirect("/signin?next=/kitchen")`. Any other protected page should do the same with its own address.

## 2. Environment variables

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | **Yes** | Long random string. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

- Local: put it in `.env.local` (no quotes, no spaces around `=`) and restart `npm run dev`.
- Vercel: Project -> Settings -> Environment Variables -> add `JWT_SECRET` (Production, and Preview if used),
  then **Redeploy**. Variables only apply to new deployments.
- `.env.local` is never uploaded. If `JWT_SECRET` is missing in production, signing fails with a 500
  ("Zero-length key is not supported") right after a correct password. Do not hard-code a fallback secret:
  anyone could forge a login for any account, including staff.
- Changing the secret signs everyone out.

## 3. Roles and access rules

| Area | Rule | Enforced in |
|---|---|---|
| `GET /api/orders` | signed in; returns only the caller's orders | route |
| `POST /api/orders` | signed in | route |
| `GET /api/orders/[id]` | owner or staff (401 / 403 / 404) | route |
| `PATCH /api/orders/[id]` | staff only (change status) | route |
| `/kitchen` | staff only (server-side redirect) | page (`getSession()`) |
| `/dashboard` | staff | page |

Role checks are done on the server, never only in the markup. The header hides links by role, but that is
convenience, not security.

## 4. Accounts
Two demo accounts are created at server start in `src/lib/users.js` (one customer, one staff). Sign-up
(`createUser`) adds customers to the in-memory list.

## 5. Known gaps and recommendations
- **Demo passwords are in the source code.** On a public deployment anyone who knows or finds them can sign in,
  and the staff account can change any order's status. Create the staff account only when a `STAFF_PASSWORD`
  environment variable (12+ characters) is set, and remove hard-coded passwords.
- **Tracking page and stream are not protected.** `/orders/[id]` and `/api/tracking/stream` do not check the
  session, so anyone with an order link can view its status. Add a `getSession()` check (owner or staff) and
  redirect to `/signin?next=/orders/<id>` when signed out.
- **`DUMMY_HASH` in the sign-in route is not a real bcrypt hash**, so the "equal timing" protection does not
  work. Generate one with
  `node -e "console.log(require('bcryptjs').hashSync('not-a-real-password', 10))"`.
- **Sign-in route has no `try/catch`.** Wrap the work after reading the body so real errors are logged and the
  client gets a clean message. Use `user?.passwordHash || DUMMY_HASH` so a missing hash cannot throw.
- **Fail loudly on a missing secret.** In `token.js`, throw if `process.env.JWT_SECRET` is not set.
- **No rate limiting** on sign-in; add it before real use.
- **In-memory users:** accounts created through sign-up can vanish or be missing on another server instance
  (Vercel). Only the seeded accounts are reliable until users move to a database (see DATA.md).
- **Header cart count** reads `data?.cart?.items` from `/api/auth/me`, but that route returns no `cart`, so the
  count is always 0. Use the cart provider (`useCart()`), or return the cart from the route.

## 6. Checklist
- [ ] `JWT_SECRET` set locally and on Vercel, redeployed
- [ ] Staff account depends on `STAFF_PASSWORD`; no demo passwords in the repo
- [ ] Session check added to `/orders/[id]` and the tracking stream
- [ ] Real `DUMMY_HASH`, `try/catch` and secret check in the auth code
- [ ] Every protected page redirects with `?next=`