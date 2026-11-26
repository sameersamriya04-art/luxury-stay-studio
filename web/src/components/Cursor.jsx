import { useEffect, useRef, useState } from "react";
import { gsap } from "../lib/smooth";
import { isFinePointer, prefersReducedMotion } from "../lib/env";

// Elegant two-part cursor. Elements can show a label with data-cursor="Play".
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.12, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.12, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });
    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); };
    const over = (e) => {
      const t = e.target.closest("a, button, [data-cursor], input, select, textarea, label");
      const r = ring.current;
      if (!t) { r.classList.remove("is-hover", "is-label"); setLabel(""); return; }
      const l = t.getAttribute("data-cursor");
      if (l) { r.classList.add("is-label"); r.classList.remove("is-hover"); setLabel(l); }
      else { r.classList.add("is-hover"); r.classList.remove("is-label"); setLabel(""); }
    };
    const out = (e) => { if (!e.relatedTarget) gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 }); };
    const back = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    document.addEventListener("pointerenter", back, true);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
      document.removeEventListener("pointerenter", back, true);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true"><span>{label}</span></div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
