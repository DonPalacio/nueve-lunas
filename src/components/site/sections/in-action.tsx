"use client";

import { useRef } from "react";
import { ArrowRight, ClipboardList, CircleHelp, Play, Video } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const items = [
  { title: "Primeros pasos:\nTu primera sesión", text: "Te contamos cómo es el primer encuentro con la fundación." },
  { title: "Confirmación de citas:\nPerspectiva del paciente", text: "Mira cómo agendas y gestionas tus sesiones paso a paso." },
  { title: "Programas y paquetes\n+ Reserva de sesiones", text: "Conoce los planes de acompañamiento y cómo reservarlos." },
];

/** Un trazo distinto por tarjeta; se dibuja y se borra en bucle. */
const swirls = [
  "M-10 30 C60 20 140 140 210 230 C250 275 320 280 350 215 L380 330",
  "M-20 235 C30 175 80 120 150 118 C215 115 215 190 205 330",
  "M-30 255 C60 190 170 255 400 150",
];

export function InAction() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const scrollTrigger = { trigger: root.current, scroller, start: "top 70%" };
      gsap.from(".ia-head > :not(h2)", { opacity: 0, y: 24, stagger: 0.1, duration: 0.9, ease: "power3.out", scrollTrigger });
      gsap.from(".ia-card", { opacity: 0, y: 50, stagger: 0.14, duration: 1, ease: "power3.out", scrollTrigger });

      // los trazos azules se dibujan y se borran en bucle, desfasados entre tarjetas
      gsap.utils.toArray<SVGPathElement>(".ia-swirl").forEach((p, i) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, {
          strokeDashoffset: 0,
          duration: 2.6,
          delay: 0.6 + i * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.8,
          scrollTrigger: { trigger: root.current, scroller, start: "top 85%", toggleActions: "play pause resume pause" },
        });
      });
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="overflow-hidden px-[18px] pb-24 pt-12">
      <div className="ia-head flex flex-wrap items-center gap-6 px-1">
        <div className="flex gap-2">
          <span className="grid size-[46px] place-items-center rounded-full bg-periwinkle">
            <Video className="size-[18px]" strokeWidth={1.4} />
          </span>
          <span className="grid size-[46px] place-items-center rounded-full bg-periwinkle">
            <CircleHelp className="size-[18px]" strokeWidth={1.4} />
          </span>
        </div>
        <h2 className="mx-auto flex-1 text-[clamp(30px,3.4vw,44px)] font-normal leading-[1.15] tracking-tight md:ml-[10%] md:max-w-[620px]">
          <WordReveal text="Míralo en acción:" start="top 85%" end="top 60%" />
          <br />
          <WordReveal text="Vive" start="top 80%" end="top 55%" />
          <span className="mx-1 inline-grid size-[1.1em] translate-y-[0.1em] place-items-center rounded-full bg-mint">
            <ClipboardList className="size-[45%]" strokeWidth={1.4} />
          </span>{" "}
          <WordReveal text="la diferencia" start="top 75%" end="top 50%" />
        </h2>
        <a href="#contacto" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12px] text-white">
          Comenzar <ArrowRight className="size-3" />
        </a>
      </div>

      <div className="mt-12 grid gap-[26px] md:grid-cols-3">
        {items.map((it, i) => (
          <article key={it.title} className="ia-card relative h-[304px] overflow-hidden rounded-[22px] bg-panel p-[27px]">
            <svg viewBox="0 0 352 304" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full text-periwinkle" fill="none">
              <path className="ia-swirl" d={swirls[i]} stroke="currentColor" strokeWidth="30" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="relative flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-full bg-white">
                <Play className="size-3.5" strokeWidth={1.5} />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[13px]">
                Explorar <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="absolute inset-x-[27px] bottom-[26px]">
              <h3 className="whitespace-pre-line text-[19px] leading-[1.15] tracking-tight">{it.title}</h3>
              <p className="mt-3 text-[12.5px] leading-snug text-[#8e928c]">{it.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
