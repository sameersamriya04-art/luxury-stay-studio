import { useEffect, useRef } from "react";
import { ArrowDown, Download, Mail, MessageCircle } from "lucide-react";
import { gsap } from "../lib/smooth";
import { prefersReducedMotion } from "../lib/env";
import { EMAIL, PDF, WHATSAPP_DISPLAY, whatsappLink } from "../data/content";
import Img from "./Img";
import Magnetic from "./Magnetic";
import ContactForm from "./ContactForm";
import { onAnchorClick } from "./Header";

export default function FinalCTA() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-bg", { yPercent: -12, scale: 1.15 }, {
        yPercent: 12, scale: 1, ease: "none",
        scrollTrigger: { trigger: ".cta-hero", start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(".cta-line > span", { yPercent: 110 }, {
        yPercent: 0, stagger: 0.12, duration: 1.5, ease: "expo.out",
        scrollTrigger: { trigger: ".cta-hero", start: "top 60%" },
      });
      gsap.fromTo(".cta-fade", { autoAlpha: 0, y: 30 }, {
        autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".cta-hero", start: "top 45%" },
      });
      gsap.fromTo(".cta-panel > *", { autoAlpha: 0, y: 50 }, {
        autoAlpha: 1, y: 0, stagger: 0.1, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: ".cta-panel", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="relative bg-ink" aria-labelledby="cta-title">
      <div className="cta-hero relative flex min-h-[100svh] items-center overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Img name="aoe-night" sizes="100vw" className="cta-bg h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/80" />
        </div>
        <div className="container-lux relative z-10 text-center">
          <p className="cta-fade eyebrow mb-8">Start a Project</p>
          <h2 id="cta-title" className="display mx-auto max-w-[16ch] text-[clamp(42px,8vw,124px)] uppercase">
            <span className="cta-line line-mask"><span>Your property</span></span>{" "}
            <span className="cta-line line-mask"><span>deserves more</span></span>{" "}
            <span className="cta-line line-mask"><span><em className="normal-case text-gold">than ordinary.</em></span></span>
          </h2>
          <div className="cta-fade mt-12 flex justify-center">
            <Magnetic>
              <a href="#enquire" onClick={(e) => onAnchorClick(e, "#enquire")} className="btn btn-gold min-h-[60px] px-10">
                Let's Create Something Extraordinary <ArrowDown size={15} aria-hidden="true" />
              </a>
            </Magnetic>
          </div>
        </div>
        <p className="absolute bottom-5 right-5 z-10 text-[10px] uppercase tracking-wide2 text-ivory/40 lg:right-12">AI-assisted concept still</p>
      </div>

      <div id="enquire" className="cta-panel container-lux grid gap-16 py-[14vh] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6 flex items-center gap-4"><span className="h-px w-10 bg-gold" aria-hidden="true" />Contact</p>
          <h3 className="display text-[clamp(40px,4.6vw,68px)]">Tell us about<br /><em className="text-gold">your property.</em></h3>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-ivory/65">
            Share your villa, hotel or resort and the photos or footage you already have. We reply by email or WhatsApp.
          </p>
          <ul className="mt-10 space-y-5">
            <li>
              <a href={`mailto:${EMAIL}`} className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center border border-line text-gold transition-colors group-hover:border-gold"><Mail size={18} aria-hidden="true" /></span>
                <span><span className="block text-[11px] uppercase tracking-wide2 text-ivory/50">Email</span><span className="font-serif text-xl break-all sm:text-2xl">{EMAIL}</span></span>
              </a>
            </li>
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center border border-line text-gold transition-colors group-hover:border-gold"><MessageCircle size={18} aria-hidden="true" /></span>
                <span><span className="block text-[11px] uppercase tracking-wide2 text-ivory/50">WhatsApp</span><span className="font-serif text-xl sm:text-2xl">{WHATSAPP_DISPLAY}</span></span>
              </a>
            </li>
            <li>
              <a href={PDF.href} download className="group flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center border border-line text-gold transition-colors group-hover:border-gold"><Download size={18} aria-hidden="true" /></span>
                <span><span className="block text-[11px] uppercase tracking-wide2 text-ivory/50">Download Portfolio PDF</span><span className="font-serif text-xl sm:text-2xl">{PDF.label}</span></span>
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
