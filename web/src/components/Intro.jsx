import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { prefersReducedMotion } from "../lib/env";

// Page entrance: the logo is revealed, a gold line draws, then the curtain lifts.
export default function Intro({ onDone }) {
  const [show, setShow] = useState(true);
  const reduced = prefersReducedMotion();

  useEffect(() => {
    // Wait for the hero image (max 2.6s) so the page never opens on a blank hero.
    const hero = new Image();
    hero.src = window.innerWidth > 960 ? "assets/images/web/hero-cliffside-1920.webp" : "assets/images/web/hero-cliffside-960.webp";
    const minTime = new Promise((r) => setTimeout(r, reduced ? 200 : 1700));
    const loaded = new Promise((r) => { hero.onload = hero.onerror = r; setTimeout(r, 2600); });
    Promise.all([minTime, loaded, document.fonts ? document.fonts.ready.catch(() => {}) : null]).then(() => setShow(false));
  }, [reduced]);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: reduced ? 0.01 : 1.1, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.img
            src="assets/logo/lss-logo.png"
            alt=""
            width="658"
            height="284"
            className="w-[min(300px,64vw)]"
            initial={{ opacity: 0, clipPath: "inset(0 50% 0 50%)", filter: "blur(6px)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0% 0 0%)", filter: "blur(0px)" }}
            transition={{ duration: reduced ? 0.01 : 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="mt-8 block h-px w-[160px] origin-left bg-gold"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduced ? 0.01 : 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
