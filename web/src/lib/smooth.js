// Lenis smooth scrolling wired into GSAP ScrollTrigger.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { prefersReducedMotion } from "./env";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

export function startSmoothScroll() {
  if (prefersReducedMotion() || lenis) return lenis;
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3), smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis && lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

const headerOffset = () => -(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header")) || 76);

// Scrolls to "#id" (or an element) with the header offset; works with or without Lenis.
export function scrollToTarget(target, { immediate = false } = {}) {
  let el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  // Pinned sections are wrapped in a spacer: scroll to where the section starts, not where it's pinned
  const isHome = el.id === "home";
  if (el.parentElement && el.parentElement.classList.contains("pin-spacer")) el = el.parentElement;
  const offset = isHome ? 0 : headerOffset();
  if (lenis) {
    if (lenis.isStopped) lenis.start(); // e.g. the mobile menu was open a moment ago
    lenis.scrollTo(el, { offset, immediate, duration: 1.6, force: true });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: immediate || prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export { gsap, ScrollTrigger };
