import { useRef, useState } from "react";
import { Copy, Mail, MessageCircle } from "lucide-react";
import { EMAIL, whatsappLink } from "../data/content";

const TYPES = ["Luxury villa", "Boutique hotel", "Resort", "Airbnb / holiday home", "Property management portfolio", "Hospitality brand", "Other"];

// Free, serverless enquiry form: prepares an email draft (or a WhatsApp message)
// in the visitor's own app. Nothing is sent until they press Send there.
export default function ContactForm() {
  const [values, setValues] = useState({ name: "", email: "", type: TYPES[0], location: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ kind: "info", text: "This prepares a pre-filled email to " + EMAIL + " in your email app. Your enquiry is only sent when you press Send there." });
  const [fallback, setFallback] = useState(null);
  const [copied, setCopied] = useState(false);
  const formRef = useRef(null);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const build = () => {
    const subject = "Project enquiry — " + values.type + (values.location.trim() ? " in " + values.location.trim() : "");
    const body =
      "Name: " + values.name.trim() + "\n" +
      "Email: " + values.email.trim() + "\n" +
      "Property type: " + values.type + "\n" +
      "Property location: " + (values.location.trim() || "Not specified") + "\n\n" +
      "Project description:\n" + values.message.trim() + "\n";
    return { subject, body, mailto: "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body) };
  };

  const validate = () => {
    const e = {};
    if (!values.name.trim()) e.name = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = true;
    if (!values.message.trim()) e.message = true;
    setErrors(e);
    if (Object.keys(e).length) {
      const names = [e.name && "your name", e.email && "a valid email", e.message && "a project description"].filter(Boolean);
      setStatus({ kind: "error", text: "Please add " + names.join(", ") + "." });
      const first = formRef.current.querySelector(`[name="${Object.keys(e)[0]}"]`);
      first && first.focus();
      return false;
    }
    return true;
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const { subject, body, mailto } = build();
    let opened = false;
    const mark = () => { opened = true; };
    window.addEventListener("blur", mark, { once: true });
    document.addEventListener("visibilitychange", mark, { once: true });
    window.addEventListener("pagehide", mark, { once: true });
    window.location.href = mailto;
    setStatus({ kind: "info", text: "Opening your email app…" });
    setTimeout(() => {
      window.removeEventListener("blur", mark);
      document.removeEventListener("visibilitychange", mark);
      window.removeEventListener("pagehide", mark);
      if (opened) {
        setStatus({ kind: "success", text: "Your email draft is ready. Please review it and press Send in your email app — your enquiry has not been sent until you do.", manual: { subject, body, mailto } });
        setFallback(null);
      } else {
        setStatus({ kind: "error", text: "We couldn't open an email app on this device. Your enquiry has not been sent — copy it below, or send it on WhatsApp." });
        setFallback({ subject, body, mailto });
      }
    }, 1800);
  };

  const sendWhatsApp = () => {
    if (!validate()) return;
    const { subject, body } = build();
    window.open(whatsappLink(subject + "\n\n" + body), "_blank", "noopener");
    setStatus({ kind: "success", text: "WhatsApp is opening with your message. Your enquiry is only sent when you press Send in WhatsApp." });
  };

  const copy = async () => {
    const text = "To: " + EMAIL + "\nSubject: " + fallback.subject + "\n\n" + fallback.body;
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2200); }
    catch (e) { const t = formRef.current.querySelector("#cf-prepared"); t && t.select(); }
  };

  const field = (k) => `lux-field ${errors[k] ? "has-error" : ""}`;
  const color = { info: "text-ivory/50", error: "text-[#e3a090]", success: "text-gold" }[status.kind];

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-7 sm:grid-cols-2" aria-label="Project enquiry">
      <div className={field("name")}>
        <label htmlFor="cf-name">Your name</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" enterKeyHint="next" value={values.name} onChange={set("name")} required />
      </div>
      <div className={field("email")}>
        <label htmlFor="cf-email">Your email</label>
        <input id="cf-email" name="email" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" value={values.email} onChange={set("email")} required />
      </div>
      <div className="lux-field">
        <label htmlFor="cf-type">Property type</label>
        <select id="cf-type" name="type" value={values.type} onChange={set("type")}>
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="lux-field">
        <label htmlFor="cf-location">Property location</label>
        <input id="cf-location" name="location" type="text" placeholder="City, country" enterKeyHint="next" value={values.location} onChange={set("location")} />
      </div>
      <div className={`${field("message")} sm:col-span-2`}>
        <label htmlFor="cf-message">Project description</label>
        <textarea id="cf-message" name="message" rows={4} placeholder="What photos or videos do you have, and where will the film be used?" value={values.message} onChange={set("message")} required />
      </div>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row">
        <button type="submit" className="btn btn-gold w-full sm:w-auto"><Mail size={15} aria-hidden="true" /> Prepare Enquiry Email</button>
        <button type="button" onClick={sendWhatsApp} className="btn btn-ghost w-full sm:w-auto"><MessageCircle size={15} aria-hidden="true" /> Send via WhatsApp</button>
      </div>
      <p className={`-mt-2 text-[13px] leading-relaxed sm:col-span-2 ${color}`} role="status" aria-live="polite">
        {status.text}{" "}
        {status.manual && (
          <button type="button" className="text-gold underline underline-offset-4" onClick={() => { setFallback(status.manual); setStatus({ ...status, manual: null }); }}>
            Email app didn't open? Copy the enquiry instead
          </button>
        )}
      </p>
      {fallback && (
        <div className="border border-gold/40 bg-charcoal p-5 text-[14px] text-ivory/70 sm:col-span-2">
          <p className="eyebrow mb-2">Email app didn't open?</p>
          <p>Copy your enquiry and email it to <a className="text-gold" href={"mailto:" + EMAIL}>{EMAIL}</a> from any account.</p>
          <label htmlFor="cf-prepared" className="mt-4 block text-[11px] uppercase tracking-wide2 text-ivory/50">Your prepared enquiry</label>
          <textarea id="cf-prepared" readOnly rows={8} className="mt-2 w-full border border-line bg-ink p-3 text-[14px] leading-relaxed text-ivory" value={"To: " + EMAIL + "\nSubject: " + fallback.subject + "\n\n" + fallback.body} />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={copy} className="btn btn-gold min-h-[44px] px-5"><Copy size={14} aria-hidden="true" /> {copied ? "Copied ✓" : "Copy enquiry"}</button>
            <a href={fallback.mailto} className="btn btn-ghost min-h-[44px] px-5">Try email app again</a>
          </div>
        </div>
      )}
    </form>
  );
}
