"use client";

import { useRef } from "react";
import { Phone } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockedSequence } from "../locked-sequence";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const PAINT = "#cfe8b4";

const steps = [
  { n: "01", title: "Semana 1", text: "Primer contacto y entrevista de acogida" },
  { n: "02", title: "Semanas 2-3", text: "Evaluación y definición de objetivos terapéuticos" },
  { n: "03", title: "Semanas 4-5", text: "Inicio del proceso con tu terapeuta" },
  { n: "04", title: "Semanas 5-7", text: "Seguimiento y ajuste del plan de acompañamiento" },
  { n: "05", title: "Semanas 6-7", text: "Cierre de etapa y plan de continuidad" },
];

export function Timeline() {
  const root = useRef<HTMLElement>(null);
  const { scroller, stop, start, glideTo } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const steps = gsap.utils.toArray<HTMLElement>(".tl-step");
      const mm = gsap.matchMedia();

      // con "reducir movimiento" todo queda pintado de una vez
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".tl-num, .tl-dot", { backgroundColor: PAINT });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {

        // el título y el texto de cada paso nacen desenfocados y suben; se ocultan desde el inicio para no parpadear
        gsap.set(".tl-title, .tl-text", { opacity: 0, y: 22, filter: "blur(8px)" });
        gsap.set(".tl-num", { scale: 0.6, opacity: 0 });
        steps.forEach((st) => {
          const n = st.querySelector<HTMLElement>(".tl-n");
          if (n) n.textContent = "00";
        });
        gsap.set(".tl-ring", { opacity: 0 });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: true });
        tl.from(".tl-head > :not(h2)", { opacity: 0, y: 24, duration: 0.9, stagger: 0.1 }, 0);
        const STEP = 0.9; // tiempo entre un paso y el siguiente

        steps.forEach((step, i) => {
          const t = i * STEP;
          const num = step.querySelector(".tl-num");
          const digit = step.querySelector<HTMLElement>(".tl-n");
          const ring = step.querySelector(".tl-ring");
          const dots = Array.from(step.querySelectorAll(".tl-dot"));
          const target = i + 1;
          const counter = { v: 0 };

          // el número aparece con rebote, se pinta y cuenta hasta su valor; un anillo se expande como pulso
          tl.to(num, { scale: 1, opacity: 1, backgroundColor: PAINT, duration: 0.7, ease: "back.out(2.2)" }, t);
          tl.fromTo(ring, { scale: 1, opacity: 0.7 }, { scale: 2, opacity: 0, duration: 0.8, ease: "power2.out", immediateRender: false }, t);
          tl.to(
            counter,
            {
              v: target,
              duration: 0.55,
              ease: "power2.out",
              onUpdate: () => {
                if (digit) digit.textContent = String(Math.round(counter.v)).padStart(2, "0");
              },
            },
            t,
          );
          // los puntos se pintan uno a uno hacia el siguiente paso, cada uno con un pequeño golpe de escala
          dots.forEach((dot, d) => {
            const at = t + 0.3 + d * 0.085;
            tl.to(dot, { scale: 1.7, backgroundColor: PAINT, duration: 0.18, ease: "power2.out" }, at);
            tl.to(dot, { scale: 1, duration: 0.35, ease: "back.out(3)" }, at + 0.18);
          });
          tl.to(step.querySelector(".tl-title"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, t + 0.12);
          tl.to(step.querySelector(".tl-text"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 }, t + 0.24);
        });

        // el scroll queda congelado hasta que todo se muestre; si la persona insiste, la animación acelera
        return lockedSequence({ root: root.current!, scroller, tl, stop, start, glideTo });
      });

      return () => mm.revert();
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
              <span className="tl-num relative grid size-[48px] shrink-0 place-items-center rounded-full bg-[#f1f5ee] text-[22px]">
                <span aria-hidden className="tl-ring pointer-events-none absolute inset-0 rounded-full border-2 border-[#9fd07a]" />
                <span className="tl-n tabular-nums" aria-label={s.n}>
                  {s.n}
                </span>
              </span>
              <span
                className={`ml-4 hidden flex-1 pr-4 md:flex ${i === steps.length - 1 ? "gap-[18px]" : "justify-between"}`}
              >
                {Array.from({ length: i === steps.length - 1 ? 3 : 6 }).map((_, d) => (
                  <span key={d} className="tl-dot size-[11px] rounded-full bg-[#f1f5ee]" />
                ))}
              </span>
            </div>
            <h3 className="tl-title mt-[40px] text-[20px] font-medium tracking-tight" style={{ marginTop: 40 + i * 2 }}>
              {s.title}
            </h3>
            <p className="tl-text mt-2 max-w-[170px] text-[13px] leading-snug text-[#a8aca6]">{s.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
