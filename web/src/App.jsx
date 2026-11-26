import { useEffect, useState } from "react";
import { ScrollTrigger, startSmoothScroll, scrollToTarget } from "./lib/smooth";
import Intro from "./components/Intro";
import Header from "./components/Header";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import Statement from "./components/Statement";
import Work from "./components/Work";
import Services from "./components/Services";
import Signature from "./components/Signature";
import Process from "./components/Process";
import Reach from "./components/Reach";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startSmoothScroll();
    // Recalculate pinned sections once fonts and images have settled
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts) document.fonts.ready.then(refresh).catch(() => {});
    return () => window.removeEventListener("load", refresh);
  }, []);

  // Support links like /luxury-stay-studio/#work
  useEffect(() => {
    if (ready && location.hash.length > 1) setTimeout(() => scrollToTarget(location.hash, { immediate: true }), 100);
  }, [ready]);

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink">Skip to content</a>
      <Intro onDone={() => setReady(true)} />
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero ready={ready} />
        <Statement />
        <Work />
        <Services />
        <Signature />
        <Process />
        <Reach />
        <FinalCTA />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
