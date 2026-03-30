"use client";

/**
 * React Query Provider
 * Wraps the app with TanStack Query client for server state management.
 * Replaces manual useState/useEffect data fetching patterns.
 */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Create a new QueryClient per component instance to avoid shared state between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 30 seconds — avoids redundant refetches
            staleTime: 30_000,
            // Keep unused data in cache for 5 minutes
            gcTime: 5 * 60 * 1000,
            // Retry failed requests once before showing error
            retry: 1,
            // Refetch when window regains focus (good for auction prices)
            refetchOnWindowFocus: true,
          },
          mutations: {
            // Do not retry mutations — they may have side effects
            retry: 0,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
