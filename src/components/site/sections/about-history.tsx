"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";

const title = "Nuestra historia";

// Hitos de ejemplo: reemplazar por los reales antes de publicar.
const steps = [
  { year: "2024", title: "Nace Nueve Lunas", text: "Abrimos con un pequeño equipo de psicólogos y una idea clara: cuidar de cerca" },
  { year: "2024", title: "Primeras terapias", text: "Empezamos a atender a personas y familias, en consultorio y en línea" },
  { year: "2025", title: "Programas comunitarios", text: "Llevamos talleres y jornadas de bienestar a escuelas y comunidades" },
  { year: "2026", title: "Un equipo de 12", text: "Crecemos con profesionales de distintas especialidades" },
  { year: "Hoy", title: "Lo que viene", text: "Más programas, más alianzas y más personas acompañadas" },
];

/**
 * Timeline vertical con título fijo por hito y un haz de luz que sigue el scroll
 * (estructura del Timeline de Aceternity UI, animada con GSAP como el resto del sitio).
 */
export function AboutHistory() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // el título sube palabra por palabra, como en el hero y el manifiesto
        gsap.from(".hs-word", {
          yPercent: 110,
          duration: 1.1,
          stagger: 0.09,
          ease: "power4.out",
          scrollTrigger: { trigger: root.current, scroller, start: "top 70%" },
        });

        // el haz crece con el scroll a lo largo de toda la lista
        gsap.from(".hs-beam", {
          height: 0,
          opacity: 0,
          ease: "none",
          scrollTrigger: { trigger: ".hs-list", scroller, start: "top 50%", end: "bottom 50%", scrub: true },
        });

        gsap.utils.toArray<HTMLElement>(".hs-step").forEach((step) => {
          // cada hito entra con su punto, el año desde la izquierda y el texto desde la derecha
          gsap
            .timeline({ scrollTrigger: { trigger: step, scroller, start: "top 80%" } })
            .from(step.querySelector(".hs-ring"), { scale: 0, duration: 0.8, ease: "back.out(1.7)" }, 0)
            .from(step.querySelector(".hs-year"), { opacity: 0, x: -40, duration: 0.9, ease: "power3.out" }, 0.1)
            .from(step.querySelector(".hs-body"), { opacity: 0, x: 40, duration: 0.9, ease: "power3.out" }, 0.2);
          // al llegar el haz a un hito, su punto y su año se encienden
          gsap
            .timeline({ scrollTrigger: { trigger: step, scroller, start: "top 55%", toggleActions: "play none none reverse" } })
            .to(step.querySelector(".hs-dot"), { backgroundColor: "#8fc766", borderColor: "#8fc766", duration: 0.4 }, 0)
            .to(step.querySelectorAll(".hs-year"), { color: "#151515", duration: 0.4 }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} id="historia" className="bg-gray-50 px-[30px] pb-32 pt-24">
      <div className="hs-head flex justify-center px-[2px] text-center">
        <h2 className="text-[clamp(38px,4.4vw,56px)] font-medium tracking-tight">
          {title.split(" ").map((w, i) => (
            <span key={i} className="-mb-[0.12em] mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span className="hs-word inline-block">{w}</span>
            </span>
          ))}
        </h2>
      </div>

      <div className="hs-list relative mx-auto mt-6 max-w-[980px] pb-10 md:mt-10">
        {steps.map((s) => (
          <div key={s.title} className="hs-step flex justify-start pt-10 first:pt-8 md:gap-10 md:pt-28 md:first:pt-16">
            <div className="sticky top-32 z-10 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="hs-ring absolute left-3 grid size-10 place-items-center rounded-full bg-[#f1f5ee]">
                <div className="hs-dot size-4 rounded-full border border-[#d4dbd0] bg-white" />
              </div>
              <h3 className="hs-year hidden text-[clamp(32px,3.6vw,52px)] font-medium tracking-tight text-[#a8aca6] md:block md:pl-20">
                {s.year}
              </h3>
            </div>

            <div className="hs-body relative w-full pl-20 pr-4 md:pl-4">
              <h3 className="hs-year mb-3 block text-[28px] font-medium tracking-tight text-[#a8aca6] md:hidden">{s.year}</h3>
              <h4 className="text-[clamp(20px,2vw,28px)] font-medium leading-[1.1] tracking-tight">{s.title}</h4>
              <p className="mt-3 max-w-[420px] text-[14px] leading-snug text-ink/60">{s.text}</p>
            </div>
          </div>
        ))}

        <div className="absolute left-[30.5px] top-0 h-full w-[3px] overflow-hidden bg-gradient-to-b from-transparent via-[#e4e8e1] to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
          <div className="hs-beam absolute inset-x-0 top-0 h-full w-[3px] rounded-full bg-gradient-to-t from-[#8fc766] from-[0%] via-[#9db4e0] via-[10%] to-transparent" />
        </div>
      </div>
    </section>
  );
}
