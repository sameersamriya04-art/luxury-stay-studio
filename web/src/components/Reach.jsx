import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { gsap } from "../lib/smooth";
import { use3D, isMobile, isFinePointer, prefersReducedMotion } from "../lib/env";
import useInView from "../hooks/useInView";
import { MARKETS } from "../data/content";
import landDots from "../data/land-dots.json";

const Globe = lazy(() => import("../three/Globe"));

// 2D dotted map — used when 3D isn't available (or as reduced-motion view)
function FlatMap({ active }) {
  const W = 360, H = 170;
  const x = (lon) => ((lon + 180) / 360) * W;
  const y = (lat) => ((80 - lat) / 140) * H;
  const dots = [];
  for (let i = 0; i < landDots.length; i += 2) dots.push(<circle key={i} cx={x(landDots[i + 1])} cy={y(landDots[i])} r="0.75" />);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="World map highlighting our focus markets">
      <g fill="#c6a46a" opacity="0.4">{dots}</g>
      {MARKETS.map((m, i) => (
        <g key={m.name}>
          <circle cx={x(m.lon)} cy={y(m.lat)} r={i === active ? 4.5 : 2.6} fill="none" stroke="#c6a46a" strokeWidth="0.5" opacity={i === active ? 1 : 0.5} />
          <circle cx={x(m.lon)} cy={y(m.lat)} r="1.6" fill="#f1d9a8" />
        </g>
      ))}
    </svg>
  );
}

export default function Reach() {
  const root = useRef(null);
  const stage = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [active, setActive] = useState(4); // start on the Maldives
  const [paused, setPaused] = useState(false);
  const [enable3D] = useState(() => use3D());
  const [mobile] = useState(() => isMobile());
  const near = useInView(root, "300px");
  const visible = useInView(stage, "0px");

  // Gentle auto-tour through the markets until the visitor picks one
  useEffect(() => {
    if (paused || !visible || prefersReducedMotion()) return;
    const id = setInterval(() => setActive((a) => (a + 1) % MARKETS.length), 3200);
    return () => clearInterval(id);
  }, [paused, visible]);

  useEffect(() => {
    if (!paused) return;
    const id = setTimeout(() => setPaused(false), 9000);
    return () => clearTimeout(id);
  }, [paused, active]);

  useEffect(() => {
    if (!isFinePointer()) return;
    const el = stage.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const leave = () => { pointer.current.x = 0; pointer.current.y = 0; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".rc-reveal", { autoAlpha: 0, y: 40 }, {
        autoAlpha: 1, y: 0, stagger: 0.08, duration: 1.2, ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
      gsap.fromTo(stage.current, { scale: 0.82, autoAlpha: 0 }, {
        scale: 1, autoAlpha: 1, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const pick = (i) => { setActive(i); setPaused(true); };

  return (
    <section ref={root} id="reach" className="relative overflow-hidden bg-ink py-[16vh]" aria-labelledby="reach-title">
      <div className="container-lux grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="rc-reveal eyebrow mb-6 flex items-center gap-4"><span className="h-px w-10 bg-gold" aria-hidden="true" />Global Reach</p>
          <h2 id="reach-title" className="rc-reveal display text-[clamp(46px,6.5vw,96px)]">Wherever<br /><em className="text-gold">luxury lives.</em></h2>
          <p className="rc-reveal mt-6 max-w-md text-[16px] leading-relaxed text-ivory/65">
            Remote production means location is never a limit. These are the international markets we are focused on —
            our target markets, not a list of past clients.
          </p>
          <ul className="rc-reveal mt-10 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
            {MARKETS.map((m, i) => (
              <li key={m.name}>
                <button
                  type="button"
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  aria-pressed={i === active}
                  className={`group flex w-full items-center gap-2 border-b py-3 text-left text-[13px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                    i === active ? "border-gold text-gold" : "border-line text-ivory/60 hover:text-ivory"
                  }`}
                >
                  <MapPin size={13} className={i === active ? "text-gold" : "text-ivory/30"} aria-hidden="true" />
                  {m.short}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-7">
          <div ref={stage} className="relative mx-auto aspect-square w-full max-w-[640px]" data-cursor="Explore">
            {enable3D ? (
              near && (
                <Suspense fallback={null}>
                  <Globe markets={MARKETS} active={active} pointer={pointer} running={visible} mobile={mobile} />
                </Suspense>
              )
            ) : (
              <div className="flex h-full items-center"><FlatMap active={active} /></div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center" aria-live="polite">
              <p className="eyebrow">Focus market</p>
              <p className="mt-1 font-serif text-3xl font-light">{MARKETS[active].name}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
