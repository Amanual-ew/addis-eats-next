"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";

const fetcher = async (url) => {
const res = await fetch(url);

if (!res.ok) {
throw new Error("Failed to check authentication");
}

return res.json();
};

export default function RequireAuth({ children }) {
const router = useRouter();
const pathname = usePathname();

const { data, error, isLoading } = useSWR("/api/auth/me", fetcher);

useEffect(() => {
if (!isLoading && !error && data && !data.user) {
router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
}
}, [data, error, isLoading, pathname, router]);

if (isLoading) {
return <p>Checking authentication...</p>;
}

if (error) {
return <p>Unable to verify your login. Please refresh the page.</p>;
}

if (!data?.user) {
return <p>Redirecting to sign in...</p>;
}

return children;
}
