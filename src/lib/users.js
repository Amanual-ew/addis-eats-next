import bcrypt from "bcryptjs";

// Kept on globalThis so every route shares the same users in dev mode.
// (In-memory only: users are lost when the server restarts.)
const g = globalThis;

if (!g.__users) {
  g.__users = [
    {
      id: "usr_1",
      name: "Almaz",
      phone: "0912345678",
      role: "customer",
      passwordHash: bcrypt.hashSync("customer123", 10),
    },
    {
      id: "usr_2",
      name: "Admin Staff",
      phone: "0911000000",
      role: "staff",
      passwordHash: bcrypt.hashSync("staff123", 10),
    },
  ];
}

export const users = g.__users;

export function findUserByPhone(phone) {
  return users.find((u) => u.phone === phone);
}

export function createUser({ name, phone, password }) {
  const user = {
    id: `usr_${Date.now()}`,
    name,
    phone,
    role: "customer",
    passwordHash: bcrypt.hashSync(password, 10),
  };
  users.push(user);
  return user;
}
