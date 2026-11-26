import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { NAV, EMAIL, WHATSAPP_DISPLAY, whatsappLink } from "../data/content";
import { scrollToTarget, getLenis } from "../lib/smooth";
import Magnetic from "./Magnetic";

export const onAnchorClick = (e, href, after) => {
  if (!href || !href.startsWith("#")) return;
  e.preventDefault();
  if (after) after();
  scrollToTarget(href);
  history.replaceState(null, "", href);
};

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive("#" + e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  // Lock scrolling while the mobile menu is open; close with Escape
  useEffect(() => {
    const lenis = getLenis();
    if (open) { lenis ? lenis.stop() : (document.body.style.overflow = "hidden"); }
    else { lenis ? lenis.start() : (document.body.style.overflow = ""); }
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color,backdrop-filter] duration-700 ease-luxe ${
        scrolled && !open ? "border-b border-line/80 bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="container-lux flex h-[68px] items-center justify-between lg:h-[76px]" aria-label="Main navigation">
        <a href="#home" onClick={(e) => onAnchorClick(e, "#home", () => setOpen(false))} className="relative z-[2] flex items-center" aria-label="Luxury Stay Studio — back to top">
          <img src="assets/logo/lss-logo.png" alt="Luxury Stay Studio" width="658" height="284" className="h-[46px] w-auto lg:h-[56px]" />
        </a>

        <ul className="hidden items-center gap-9 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={(e) => onAnchorClick(e, n.href)}
                className={`group relative py-2 text-[11px] uppercase tracking-wide2 transition-colors duration-300 ${
                  active === n.href ? "text-ivory" : "text-ivory/60 hover:text-ivory"
                }`}
              >
                {n.label}
                <span className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-gold transition-transform duration-500 ease-luxe ${active === n.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Magnetic>
            <a href="#contact" onClick={(e) => onAnchorClick(e, "#contact")} className="btn btn-gold min-h-[44px] px-6">Start a Project</a>
          </Magnetic>
        </div>

        <button
          type="button"
          className="relative z-[2] -mr-2 grid h-11 w-11 place-items-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`absolute h-px w-6 bg-ivory transition-transform duration-500 ease-luxe ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
          <span className={`absolute h-px w-6 bg-ivory transition-transform duration-500 ease-luxe ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[1] flex flex-col justify-between bg-ink px-6 pb-10 pt-[100px] lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-2">
              {NAV.map((n, i) => (
                <li key={n.href} className="overflow-hidden">
                  <motion.a
                    href={n.href}
                    onClick={(e) => onAnchorClick(e, n.href, () => setOpen(false))}
                    className="flex items-baseline gap-4 py-1 font-serif text-[42px] font-light leading-tight text-ivory"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "110%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.05 }}
                  >
                    <span className="font-sans text-[11px] tracking-wide2 text-gold">0{i + 1}</span>
                    {n.label}
                  </motion.a>
                </li>
              ))}
            </ul>
            <motion.div
              className="space-y-3 border-t border-line pt-6 text-sm text-ivory/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
            >
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-3"><Mail size={16} className="text-gold" /> {EMAIL}</a>
              <a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-3"><MessageCircle size={16} className="text-gold" /> WhatsApp {WHATSAPP_DISPLAY}</a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
