// src/app/(staff)/layout.jsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import StaffNav from "@/components/StaffNav";

// Role can change at any time, so never cache this layout.
export const dynamic = "force-dynamic";

export default async function StaffLayout({ children }) {
  const user = await getSession();

  if (!user) redirect("/signin");
  if (user.role !== "staff") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <StaffNav user={{ name: user.name, role: user.role }} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}