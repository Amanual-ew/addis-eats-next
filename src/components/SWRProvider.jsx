"use client";

import { SWRConfig } from "swr";
import fetcher from "@/lib/fetcher";

export default function SWRProvider({ children }) {
  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        refreshInterval: 30000,
      }}
    >
      {children}
    </SWRConfig>
  );
}