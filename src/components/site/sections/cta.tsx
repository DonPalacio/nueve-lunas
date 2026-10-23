"use client";

import { useRef } from "react";
import { Download } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

export function Cta() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      // la imagen entra desde abajo y se asienta con un leve zoom; la tarjeta aparece después
      gsap.fromTo(
        ".cta-img",
        { scale: 1.2, yPercent: 8 },
        { scale: 1, yPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, scroller, start: "top 100%", end: "top 25%", scrub: 0.8 } },
      );
      gsap.from(".cta-card", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, scroller, start: "top 55%" },
      });
      gsap.from(".cta-btn", {
        opacity: 0,
        y: 10,
        duration: 0.6,
        stagger: 0.12,
        delay: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, scroller, start: "top 55%" },
      });
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} id="contacto" className="px-[18px] pb-24 pt-10">
      <div className="relative h-[380px] overflow-hidden rounded-[22px] md:h-[420px]">
        <Photo src="/images/living.jpg" alt="Sesión de acompañamiento" position="50% 40%" sizes="100vw" className="cta-img absolute inset-0" />
        <div className="cta-card absolute bottom-4 left-4 max-w-[520px] rounded-[22px] bg-white p-6 shadow-sm">
          <h2 className="text-[clamp(26px,2.9vw,36px)] font-normal leading-[1.12] tracking-tight">
            <WordReveal text="¿Lista para dar el primer paso hacia tu bienestar?" start="top 60%" end="top 30%" />
          </h2>
          <div className="mt-5 flex items-center gap-2.5">
            <a href="#" className="cta-btn rounded-full bg-ink px-4 py-2.5 text-[12px] text-white">
              Escríbenos
            </a>
            <a href="#" className="cta-btn rounded-full bg-sage px-4 py-2.5 text-[12px]">
              Descargar folleto
            </a>
            <span className="cta-btn grid size-[35px] place-items-center rounded-full bg-sage">
              <Download className="size-3.5" strokeWidth={1.5} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
