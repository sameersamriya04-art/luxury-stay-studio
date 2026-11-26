import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { getLenis } from "../lib/smooth";

// Full-screen cinematic player for a project film (native controls, plays inline on phones).
export default function VideoModal({ project, onClose }) {
  const closeBtn = useRef(null);
  const video = useRef(null);

  useEffect(() => {
    if (!project) return;
    const lenis = getLenis();
    lenis ? lenis.stop() : (document.body.style.overflow = "hidden");
    const prev = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    setTimeout(() => closeBtn.current && closeBtn.current.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis ? lenis.start() : (document.body.style.overflow = "");
      prev && prev.focus && prev.focus({ preventScroll: true });
    };
  }, [project, onClose]);

  // Rendered into <body> so pinned/transformed sections can't trap it
  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-10"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — film`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-12 w-12 place-items-center border border-ivory/30 text-ivory transition-colors hover:border-gold hover:text-gold sm:right-8 sm:top-8"
            aria-label="Close film"
          >
            <X size={20} />
          </button>
          <motion.div
            className="w-full max-w-[1400px]"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <video
              ref={video}
              className="aspect-video w-full bg-black"
              src={project.video}
              poster={project.poster}
              controls
              autoPlay
              playsInline
              preload="auto"
              title={`${project.title} — AI-assisted concept film by Luxury Stay Studio`}
            >
              <a href={project.video}>Watch {project.title} (MP4)</a>
            </video>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow">Project {project.num} · {project.category}</p>
                <p className="mt-1 font-serif text-2xl">{project.title}</p>
              </div>
              <span className="chip">AI-assisted concept — not commissioned client work</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
