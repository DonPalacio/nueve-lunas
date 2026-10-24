"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ScrollerContext } from "./scroller-context";
import { Nav } from "./nav";
import { Footer } from "./footer";

/**
 * Tarjeta blanca redondeada que contiene toda la página. El scroll ocurre
 * dentro de ella (Lenis + ScrollTrigger usan este contenedor como scroller),
 * y la barra de navegación queda fija encima. Vive en el layout: el footer
 * va al final del contenido de cada página.
 */
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const [scroller, setScroller] = useState<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!scroller || !contentRef.current) return;
    const lenis = new Lenis({
      wrapper: scroller,
      content: contentRef.current,
      lerp: 0.09,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [scroller]);

  // al cambiar de página, volver arriba (el marco no se desmonta entre rutas)
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else scroller?.scrollTo({ top: 0 });
    ScrollTrigger.refresh();
  }, [pathname, scroller]);

  const scrollTo = useCallback(
    (y: number) => {
      if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.1 });
      else scroller?.scrollTo({ top: y, behavior: "smooth" });
    },
    [scroller],
  );

  return (
    <ScrollerContext.Provider value={{ scroller, scrollTo }}>
      <main
        className="fixed overflow-hidden rounded-[28px] bg-[#fdfefb] shadow-[0_30px_80px_-40px_rgba(60,80,40,0.35)]"
        style={{
          left: "var(--frame-x)",
          right: "var(--frame-x)",
          top: "var(--frame-y)",
          bottom: "var(--frame-y)",
        }}
      >
        <Nav />
        <div
          ref={setScroller}
          data-scroller
          className="no-scrollbar absolute inset-0 overflow-y-auto overscroll-contain"
        >
          <div ref={contentRef}>
            {children}
            <Footer />
          </div>
        </div>
      </main>
    </ScrollerContext.Provider>
  );
}
