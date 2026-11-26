import { useEffect, useRef } from "react";
import { gsap } from "../lib/smooth";
import { isFinePointer, prefersReducedMotion } from "../lib/env";
import { SERVICES } from "../data/content";
import Img from "./Img";

function ServiceCard({ s, i }) {
  const ref = useRef(null);
  // Subtle 3D tilt that follows the cursor (desktop only)
  useEffect(() => {
    const el = ref.current;
    if (!isFinePointer() || prefersReducedMotion()) return;
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    };
    const leave = () => { rx(0); ry(0); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  return (
    <article
      ref={ref}
      className="svc-card group relative flex min-h-[340px] flex-col justify-between overflow-hidden border border-line bg-ink p-8 lg:min-h-[420px] lg:p-10"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-luxe group-hover:opacity-100" aria-hidden="true">
        <Img name={s.image} sizes="(min-width: 1024px) 33vw, 100vw" className="h-full w-full scale-110 object-cover transition-transform duration-[1800ms] ease-luxe group-hover:scale-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/30" />
      </div>
      <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-luxe group-hover:scale-x-100" aria-hidden="true" />
      <span className="relative font-serif text-2xl italic text-gold" style={{ transform: "translateZ(30px)" }}>0{i + 1}</span>
      <div className="relative" style={{ transform: "translateZ(40px)" }}>
        <h3 className="font-serif text-[clamp(28px,2.4vw,36px)] font-light leading-tight">{s.title}</h3>
        <p className="mt-4 text-[15px] leading-relaxed text-ivory/65 transition-colors duration-500 group-hover:text-ivory/85">{s.text}</p>
      </div>
    </article>
  );
}

export default function Services() {
  const root = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".svc-head > *", { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".svc-head", start: "top 85%" },
      });
      gsap.fromTo(".svc-card", { autoAlpha: 0, y: 80, rotationX: 12 }, {
        autoAlpha: 1, y: 0, rotationX: 0, stagger: 0.09, duration: 1.4, ease: "expo.out",
        scrollTrigger: { trigger: ".svc-grid", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="services" className="relative bg-ink py-[16vh]" aria-labelledby="services-title">
      <div className="container-lux">
        <div className="svc-head mb-16 grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-4"><span className="h-px w-10 bg-gold" aria-hidden="true" />Our Services</p>
            <h2 id="services-title" className="display text-[clamp(46px,7vw,104px)]">Crafted for<br /><em className="text-gold">exceptional stays.</em></h2>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-ivory/65 lg:justify-self-end">
            Remote-first production for luxury property brands worldwide. You supply the photos and footage — we
            shape them into cinematic films for your website, listings and social channels.
          </p>
        </div>
        <div className="svc-grid grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1400px" }}>
          {SERVICES.map((s, i) => <ServiceCard key={s.title} s={s} i={i} />)}
        </div>
        <p className="mt-10 max-w-3xl border-l-2 border-gold bg-charcoal px-6 py-5 text-[14px] leading-relaxed text-ivory/60">
          <span className="mb-1 block text-[11px] uppercase tracking-luxe text-gold">Remote-first production</span>
          We edit and finish media you provide, and create clearly disclosed AI-assisted concept work.
          On-location filming and drone flights are not part of our current services.
        </p>
      </div>
    </section>
  );
}
