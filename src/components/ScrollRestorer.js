"use client";
import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function ScrollRestorer() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const scrollPos = searchParams.get("restoreScroll");
    if (!scrollPos) return;

    const targetY = parseInt(scrollPos);

    // 1. Create an observer to watch for layout changes
    const observer = new MutationObserver(() => {
      // Check if the current page height can actually reach the target
      if (document.documentElement.scrollHeight >= targetY) {
        window.scrollTo({
          top: targetY,
          behavior: "instant",
        });

        // 2. Once we've successfully scrolled, stop observing and clean URL
        observer.disconnect();
        cleanupUrl();
      }
    });

    // Start observing the body for child changes or subtree shifts
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup function to prevent memory leaks
    return () => observer.disconnect();

    function cleanupUrl() {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("restoreScroll");
      const newQuery = params.toString() ? `?${params.toString()}` : "";
      window.history.replaceState(null, "", pathname + newQuery);
    }
  }, [searchParams, pathname]);

  return null;
}
