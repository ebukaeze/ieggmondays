"use client";

import { useEffect, useRef } from "react";

export interface MousePosition {
  x: number;
  y: number;
}

// Returns a ref so consumers can read the latest position without triggering re-renders.
// The ref is updated on every mousemove; GSAP / rAF-based consumers should read it there.
export function useMousePosition() {
  const position = useRef<MousePosition>({ x: -100, y: -100 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return position;
}
