"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap/config";
import { getLenis } from "@/lib/lenis";
import { useAppStore } from "@/store/useAppStore";

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isFirst = useRef(true);

  const pathname = usePathname();
  const setIsTransitioning = useAppStore((s) => s.setIsTransitioning);

  // ── Initial page reveal ──────────────────────────────────────────────────────
  // Overlay starts covering the screen (translateY(0) in CSS).
  // This effect slides it away, giving a brand-reveal on first load.
  useEffect(() => {
    // Mark first render done immediately so route changes during this
    // animation correctly trigger the transition instead of skipping.
    isFirst.current = false;

    const overlay = overlayRef.current!;
    const wordmark = wordmarkRef.current!;

    gsap.set(wordmark, { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      onStart: () => setIsTransitioning(true),
      onComplete: () => setIsTransitioning(false),
    });

    tl.to(wordmark, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", delay: 0.15 })
      .to(wordmark, { opacity: 0, y: -12, duration: 0.3, ease: "power2.in" }, "+=0.35")
      .to(overlay, { y: "-100%", duration: 0.7, ease: "power3.inOut" }, "<0.05");

    tlRef.current = tl;
    return () => { tl.kill(); };
  }, [setIsTransitioning]);

  // ── Route-change transitions ─────────────────────────────────────────────────
  // useLayoutEffect fires before the browser paints the new page.
  // Snapping the overlay to y:0 here means the content swap is never visible —
  // the overlay is already covering the screen on the very first paint.
  useLayoutEffect(() => {
    if (isFirst.current) return;

    const overlay = overlayRef.current!;
    const wordmark = wordmarkRef.current!;

    tlRef.current?.kill();

    // Snap overlay to cover screen before the browser paints new content
    gsap.set(overlay, { y: "0%" });
    gsap.set(wordmark, { opacity: 0, y: 16 });

    const tl = gsap.timeline({
      onStart: () => setIsTransitioning(true),
      onComplete: () => setIsTransitioning(false),
    });

    tl.to(wordmark, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", delay: 0.1 })
      // Reset scroll while covered — Lenis handles it; falls back to native scroll
      .call(() => {
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
      })
      .to(wordmark, { opacity: 0, y: -12, duration: 0.25, ease: "power2.in" }, "+=0.2")
      .to(overlay, { y: "-100%", duration: 0.65, ease: "power3.inOut" }, "<0.05");

    tlRef.current = tl;
  }, [pathname, setIsTransitioning]);

  return (
    <div
      ref={overlayRef}
      // translateY(0) — overlay covers screen on initial SSR render.
      // GSAP takes over immediately on mount.
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-background"
      style={{ transform: "translateY(0%)" }}
    >
      <span
        ref={wordmarkRef}
        className="text-3xl font-semibold tracking-tight text-foreground"
      >
        ieggmondays
      </span>
    </div>
  );
}
