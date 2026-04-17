"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap/config";
import { useAppStore } from "@/store/useAppStore";

const SESSION_KEY = "iegg_preloader";

export default function Preloader() {
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);

  const setIsLoading = useAppStore((s) => s.setIsLoading);

  // "pending"  — SSR / pre-hydration (renders null, no flash)
  // "active"   — first-ever visit, run the full preloader
  // "skip"     — already shown this session, unmount immediately
  const [status, setStatus] = useState<"pending" | "active" | "skip">("pending");

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "shown") {
      setIsLoading(false);
      setStatus("skip");
    } else {
      setIsLoading(true);
      setStatus("active");
    }
  }, [setIsLoading]);

  useEffect(() => {
    if (status !== "active") return;

    const top = topRef.current!;
    const bottom = bottomRef.current!;
    const wordmark = wordmarkRef.current!;
    const counter = counterRef.current!;

    const split = new SplitText(wordmark, { type: "chars" });
    let reverted = false;

    const revertSplit = () => {
      if (!reverted) {
        reverted = true;
        split.revert();
      }
    };

    // Counter animates via a proxy so GSAP drives the number, not React state
    const proxy = { value: 0 };

    const counterTween = gsap.to(proxy, {
      value: 90,
      duration: 2.4,
      ease: "power1.inOut",
      onUpdate: () => {
        counter.textContent = `${Math.floor(proxy.value)}%`;
      },
    });

    // Letters stagger in from below — overflow-hidden on the wordmark clips
    // chars that start below the container edge until they animate into position
    gsap.fromTo(
      split.chars,
      { y: 64, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.045,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      },
    );

    // Collect any images that haven't finished loading yet
    const imagePromises = Array.from(document.images)
      .filter((img) => !img.complete)
      .map(
        (img) =>
          new Promise<void>((res) => {
            img.addEventListener("load", () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          }),
      );

    // Guarantee a minimum display time so the animation feels intentional
    const minimumTime = new Promise<void>((res) => setTimeout(res, 1900));

    Promise.all([document.fonts.ready, minimumTime, ...imagePromises]).then(() => {
      counterTween.kill();

      gsap.to(proxy, {
        value: 100,
        duration: 0.45,
        ease: "power2.in",
        onUpdate: () => {
          counter.textContent = `${Math.floor(proxy.value)}%`;
        },
        onComplete: playExit,
      });
    });

    function playExit() {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, "shown");
          revertSplit();
          setIsLoading(false);
          setStatus("skip");
        },
      });

      tl
        // Chars scatter upward — random stagger order makes it feel like they shatter
        .to(split.chars, {
          y: -64,
          opacity: 0,
          stagger: { each: 0.028, from: "random" },
          duration: 0.55,
          ease: "power3.in",
        })
        .to(counter, { opacity: 0, duration: 0.2 }, "<0.15")
        // Curtain panels split apart, revealing the page below
        .to(top, { y: "-105%", duration: 0.95, ease: "power3.inOut" }, ">-0.05")
        .to(bottom, { y: "105%", duration: 0.95, ease: "power3.inOut" }, "<");
    }

    return () => {
      counterTween.kill();
      gsap.killTweensOf([proxy, counter, split.chars, top, bottom]);
      revertSplit();
    };
  }, [status, setIsLoading]);

  if (status !== "active") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200]">
      {/* Top curtain — bg-background so it blends with the page before reveal */}
      <div ref={topRef} className="absolute inset-x-0 top-0 h-[51%] bg-background" />
      {/* Bottom curtain */}
      <div ref={bottomRef} className="absolute inset-x-0 bottom-0 h-[51%] bg-background" />

      {/* Wordmark — overflow-hidden acts as a mask so SplitText chars that start
          below y:0 are clipped until they animate upward into view */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div
          ref={wordmarkRef}
          className="select-none overflow-hidden leading-[1.1] text-[clamp(2.5rem,9vw,8.5rem)] font-semibold tracking-tight text-foreground"
        >
          ieggmondays
        </div>
      </div>

      {/* Counter — bottom-right, monospace so digits don't shift layout */}
      <div className="absolute bottom-7 right-8 z-10">
        <span
          ref={counterRef}
          className="font-mono text-sm tabular-nums text-foreground/40"
        >
          0%
        </span>
      </div>
    </div>
  );
}
