"use client";

import { useEffect } from "react";

// Locks page scroll while mounted, restores it on unmount.
// Needed because the gallery layout sits fixed on top of the whole page.
export default function ScrollLock() {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return null;
}
