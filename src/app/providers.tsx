"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <DevServiceWorkerCleanup />
      {children}
    </QueryClientProvider>
  );
}

function DevServiceWorkerCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;

    const cleanup = async () => {
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map((registration) => registration.unregister()),
        );
      }

      if ("caches" in window) {
        const cacheNames = await window.caches.keys();
        await Promise.all(
          cacheNames
            .filter((name) => name.startsWith("serwist-"))
            .map((name) => window.caches.delete(name)),
        );
      }

      if (navigator.serviceWorker?.controller) {
        const key = "sora-risu:dev-sw-cleaned";
        if (window.sessionStorage.getItem(key) !== "1") {
          window.sessionStorage.setItem(key, "1");
          window.location.reload();
        }
      }
    };

    cleanup().catch(() => {
      // Development-only cache cleanup should never block the app.
    });
  }, []);

  return null;
}
