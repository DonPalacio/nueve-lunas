"use client";

import { useRef } from "react";
import { Check, CircleHelp } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const items = [
  "Terapia individual", "Orientación familiar", "Acompañamiento en duelo",
  "Atención en crisis", "Terapia de pareja", "Talleres para escuelas",
  "Evaluación psicológica", "Grupos de apoyo", "Atención virtual y presencial",
];

export function Checklist() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      // el panel sube desde abajo; los ítems aparecen en cascada por filas
      gsap.fromTo(
        ".ck-panel",
        { y: 120, opacity: 0.3 },
        { y: 0, opacity: 1, ease: "none", scrollTrigger: { trigger: root.current, scroller, start: "top 100%", end: "top 55%", scrub: 0.6 } },
      );
      const scrollTrigger = { trigger: root.current, scroller, start: "top 55%" };
      gsap.from(".ck-aside", { opacity: 0, duration: 0.8, delay: 0.3, scrollTrigger });
      gsap.from(".ck-item", { opacity: 0, x: -16, duration: 0.7, stagger: 0.12, delay: 0.5, ease: "power3.out", scrollTrigger });
      gsap.from(".ck-check", { scale: 0, duration: 0.5, stagger: 0.12, delay: 0.7, ease: "back.out(3)", scrollTrigger });
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="px-[18px] pb-40">
      <div className="ck-panel rounded-[22px] bg-panel px-[30px] pb-[56px] pt-[56px]">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h2 className="max-w-[520px] text-[clamp(30px,3.4vw,44px)] font-medium leading-[1.12] tracking-tight">
            <WordReveal text="Adaptado a cada historia y a cada proceso" start="top 70%" end="top 35%" />
          </h2>
          <p className="ck-aside flex max-w-[280px] items-start gap-3 pr-10 text-[12px] leading-snug text-[#9a9e98]">
            <CircleHelp className="mt-0.5 size-5 shrink-0 rounded-full bg-white p-1 text-ink" />
            Llevamos el bienestar emocional al siguiente nivel con un equipo cercano, diseñado para tu realidad.
          </p>
        </div>

        <ul className="mt-[72px] grid gap-x-10 gap-y-9 md:grid-cols-3">
          {items.map((t) => (
            <li key={t} className="ck-item flex items-center gap-4 text-[clamp(17px,1.7vw,22px)] leading-tight tracking-tight">
              <span className="ck-check grid size-9 shrink-0 place-items-center rounded-full bg-periwinkle">
                <Check className="size-4" strokeWidth={2} />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
