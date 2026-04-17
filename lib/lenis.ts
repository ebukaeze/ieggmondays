import type Lenis from "lenis";

// Module-level singleton — SmoothScroll sets this on mount/unmount.
// Safe because SmoothScroll is rendered exactly once in the root layout.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}
