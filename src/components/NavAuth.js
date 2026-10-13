"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import fetcher from "@/lib/fetcher";

// Navbar section: shows Sign in, or the person's name + Sign out.
// Reads /api/auth/me with SWR so the rest of the site can stay static.
export default function NavAuth() {
  const router = useRouter();
  const { data, isLoading } = useSWR("/api/auth/me", fetcher);

  const user = data?.user;

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    await mutate("/api/auth/me");
    router.push("/");
    router.refresh();
  }

  if (isLoading) {
    return <div className="ml-2 h-9 w-24 animate-pulse rounded-full bg-orange-50" />;
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        className="ml-2 rounded-full border-2 border-[#ff6f61] px-5 py-2 text-[#ff6f61] transition hover:bg-[#ff6f61] hover:text-white"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="ml-2 flex items-center gap-1">
      {/* Showing the link is only the interface. The /kitchen page and the
          API refuse non-staff on the server. */}
      {user.role === "staff" && (
        <Link
          href="/dashboard"
          className="rounded-full px-4 py-2 transition hover:bg-orange-50 hover:text-[#ff6f61]"
        >
          Admin
        </Link>
      )}

      <span className="hidden px-2 text-gray-500 sm:inline">
        Hi, {user.name.split(" ")[0]}
      </span>

      <button
        onClick={handleSignOut}
        className="rounded-full px-4 py-2 transition hover:bg-orange-50 hover:text-[#ff6f61]"
      >
        Sign out
      </button>
    </div>
  );
}
