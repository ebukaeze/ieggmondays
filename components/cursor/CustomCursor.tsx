"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap/config";
import { useMousePosition } from "@/hooks/useMousePosition";

type CursorState = "default" | "hover" | "text";

// Shared reset target — every state transition drives all properties so
// GSAP never gets stuck with a stale value from a prior state.
const DEFAULT: gsap.TweenVars = {
  width: 40,
  height: 40,
  scale: 1,
  borderRadius: "50%",
  opacity: 1,
  duration: 0.35,
  ease: "power2.out",
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const mousePos = useMousePosition();
  const [isPointerFine, setIsPointerFine] = useState(false);

  useEffect(() => {
    setIsPointerFine(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    // Start both elements off-screen so they don't flash at (0,0)
    gsap.set([dot, ring], { x: -100, y: -100 });

    // quickTo gives us a pre-configured setter we call on every frame —
    // cheaper than spawning a new tween each mousemove.
    const xTo = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    let currentState: CursorState = "default";
    let currentEl: HTMLElement | null = null;

    // ── state helpers ──────────────────────────────────────────────────────────

    function toDefault() {
      currentState = "default";
      gsap.to(label, { opacity: 0, duration: 0.15 });
      gsap.to(ring, DEFAULT);
    }

    function toHover() {
      currentState = "hover";
      gsap.to(label, { opacity: 0, duration: 0.15 });
      gsap.to(ring, {
        width: 40,
        height: 40,
        scale: 2,
        borderRadius: "50%",
        opacity: 0.4,
        duration: 0.35,
        ease: "power2.out",
      });
    }

    function toText(text: string) {
      currentState = "text";
      label.textContent = text;
      const w = Math.max(64, text.length * 10 + 40);
      gsap.to(ring, {
        width: w,
        height: 40,
        scale: 1,
        borderRadius: 20,
        opacity: 0.95,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(label, { opacity: 1, duration: 0.2, delay: 0.15 });
    }

    // ── event handlers ─────────────────────────────────────────────────────────

    const onMouseMove = (e: MouseEvent) => {
      // Dot follows instantly; ring follows via quickTo lerp
      gsap.set(dot, { x: e.clientX - 2, y: e.clientY - 2 });
      xTo(e.clientX - 20);
      yTo(e.clientY - 20);
    };

    const onMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]",
      );
      if (el === currentEl) return;
      currentEl = el ?? null;

      if (!el) {
        toDefault();
        return;
      }

      const cursorLabel = el.dataset.cursor;
      if (cursorLabel) toText(cursorLabel);
      else toHover();
    };

    const onMouseOut = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "a, button, [data-cursor]",
      );
      if (!el) return;
      // relatedTarget still inside the same element → entering a child, ignore
      if (el.contains(e.relatedTarget as Node | null)) return;
      currentEl = null;
      toDefault();
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      gsap.killTweensOf([ring, label]);
    };
  }, [isPointerFine, mousePos]);

  if (!isPointerFine) return null;

  return (
    <>
      {/* Dot — 4 px, exact follow */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-9999 h-1 w-1 rounded-full bg-foreground"
        style={{ willChange: "transform" }}
      />
      {/* Ring — 40 px, lagged follow; morphs on hover / data-cursor */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-9998 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-foreground/70"
        style={{ willChange: "transform" }}
      >
        <span
          ref={labelRef}
          className="select-none whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.15em] text-foreground opacity-0"
        />
      </div>
    </>
  );
}
