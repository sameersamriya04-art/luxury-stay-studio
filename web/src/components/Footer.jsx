import { Instagram, Mail, MessageCircle } from "lucide-react";
import { EMAIL, INSTAGRAM_HANDLE, NAV, PDF, WHATSAPP_DISPLAY, whatsappLink } from "../data/content";
import { onAnchorClick } from "./Header";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#0b0b0b] pt-20 pb-8">
      <div className="container-lux">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img src="assets/logo/lss-logo.png" alt="Luxury Stay Studio — Property Cinematics" width="658" height="284" loading="lazy" className="w-[220px]" />
            <p className="mt-6 font-serif text-2xl italic text-ivory/70">We Turn Properties Into Experiences.</p>
          </div>
          <nav className="md:col-span-3" aria-label="Footer navigation">
            <p className="eyebrow mb-5">Explore</p>
            <ul className="space-y-2 text-[15px]">
              {NAV.map((n) => (
                <li key={n.href}><a href={n.href} onClick={(e) => onAnchorClick(e, n.href)} className="text-ivory/60 transition-colors hover:text-gold">{n.label}</a></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow mb-5">Contact</p>
            <ul className="space-y-3 text-[15px] text-ivory/70">
              <li><a href={`mailto:${EMAIL}`} className="flex items-center gap-3 break-all hover:text-gold"><Mail size={16} className="shrink-0 text-gold" aria-hidden="true" />{EMAIL}</a></li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-gold"><MessageCircle size={16} className="text-gold" aria-hidden="true" />WhatsApp {WHATSAPP_DISPLAY}</a></li>
              {INSTAGRAM_HANDLE && (
                <li><a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noopener" className="flex items-center gap-3 hover:text-gold"><Instagram size={16} className="text-gold" aria-hidden="true" />@{INSTAGRAM_HANDLE}</a></li>
              )}
              <li><a href={PDF.href} download className="text-gold underline-offset-4 hover:underline">Download Portfolio PDF</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 text-[12px] text-ivory/40 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Luxury Stay Studio · Property Cinematics</p>
          <p>The Art of Escape and Villa in Motion are AI-assisted concept projects, not commissioned client work. Site imagery is from these concept films.</p>
          <a href="#home" onClick={(e) => onAnchorClick(e, "#home")} className="uppercase tracking-wide2 text-gold">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
