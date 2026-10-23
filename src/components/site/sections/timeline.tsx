"use client";

import { useRef } from "react";
import { Phone } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const steps = [
  { n: "01", title: "Semana 1", text: "Primer contacto y entrevista de acogida" },
  { n: "02", title: "Semanas 2-3", text: "Evaluación y definición de objetivos terapéuticos" },
  { n: "03", title: "Semanas 4-5", text: "Inicio del proceso con tu terapeuta" },
  { n: "04", title: "Semanas 5-7", text: "Seguimiento y ajuste del plan de acompañamiento" },
  { n: "05", title: "Semanas 6-7", text: "Cierre de etapa y plan de continuidad" },
];

export function Timeline() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const scrollTrigger = { trigger: root.current, scroller, start: "top 62%" };
      gsap.from(".tl-head > :not(h2)", { opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger });
      gsap.from(".tl-step", { opacity: 0, y: 24, duration: 0.8, stagger: 0.18, ease: "power3.out", scrollTrigger });

      // cada número y sus puntos se rellenan en orden, de izquierda a derecha, como una ola
      const wave: Element[] = [];
      gsap.utils.toArray<HTMLElement>(".tl-step").forEach((step) => {
        wave.push(step.querySelector(".tl-num")!, ...Array.from(step.querySelectorAll(".tl-dot")));
      });
      gsap.to(wave, {
        backgroundColor: "#e3f2d6",
        duration: 0.4,
        stagger: 0.11,
        delay: 0.5,
        ease: "power1.out",
        scrollTrigger,
      });
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} id="programas" className="px-[30px] pb-32 pt-24">
      <div className="tl-head flex flex-wrap items-center justify-between gap-6 px-[2px]">
        <h2 className="text-[clamp(38px,4.4vw,56px)] font-medium tracking-tight">
          <WordReveal text="Cómo empezar" start="top 85%" end="top 55%" />
        </h2>
        <p className="flex items-start gap-2 text-[13px] leading-tight">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-ink" />
          Empieza hoy,
          <br />
          transforma tu mañana
        </p>
        <div className="flex items-center gap-2">
          <span className="grid size-[34px] place-items-center rounded-full bg-sage">
            <Phone className="size-3.5" strokeWidth={1.5} />
          </span>
          <a href="#contacto" className="rounded-full bg-sage px-5 py-2.5 text-[13px]">
            Contáctanos
          </a>
        </div>
      </div>

      <ol className="mt-[70px] grid grid-cols-2 gap-y-12 md:grid-cols-5">
        {steps.map((s, i) => (
          <li key={s.n} className="tl-step">
            <div className="flex items-center">
              <span className="tl-num grid size-[48px] shrink-0 place-items-center rounded-full bg-[#f1f5ee] text-[22px]">
                {s.n}
              </span>
              <span
                className={`ml-4 hidden flex-1 pr-4 md:flex ${i === steps.length - 1 ? "gap-[18px]" : "justify-between"}`}
              >
                {Array.from({ length: i === steps.length - 1 ? 3 : 6 }).map((_, d) => (
                  <span key={d} className="tl-dot size-[11px] rounded-full bg-[#f1f5ee]" />
                ))}
              </span>
            </div>
            <h3 className="mt-[40px] text-[20px] font-medium tracking-tight" style={{ marginTop: 40 + i * 2 }}>
              {s.title}
            </h3>
            <p className="mt-2 max-w-[170px] text-[13px] leading-snug text-[#a8aca6]">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
