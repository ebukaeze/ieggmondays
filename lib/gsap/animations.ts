import { gsap } from "./config";

export function fadeInUp(target: gsap.TweenTarget, options: gsap.TweenVars = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", ...options },
  );
}

export function staggerFadeInUp(target: gsap.TweenTarget, options: gsap.TweenVars = {}) {
  return gsap.fromTo(
    target,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1, ...options },
  );
}

export function createRevealTimeline(container: Element) {
  const tl = gsap.timeline({ paused: true });
  tl.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.6 });
  return tl;
}
