"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FaceCrop, type faces } from "../face-crop";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  service: string;
  face: keyof typeof faces;
};

// Opiniones de ejemplo: reemplazar por las reales antes de publicar.
const testimonials: Testimonial[] = [
  {
    id: "laura",
    quote:
      "Llegué sin saber por dónde empezar. En la terapia individual encontré un espacio donde por fin pude hablar sin sentirme juzgada. Hoy duermo mejor y me siento más tranquila.",
    name: "Laura M.",
    service: "Terapia Individual",
    face: "a",
  },
  {
    id: "carlos",
    quote:
      "Con mi esposa y mis hijos aprendimos a escucharnos de nuevo. Las sesiones familiares nos dieron herramientas concretas y el ambiente en casa cambió.",
    name: "Carlos R.",
    service: "Terapia Familiar",
    face: "b",
  },
  {
    id: "ana",
    quote:
      "El taller de parejas nos ayudó a reconstruir la confianza. Los grupos son pequeños y se siente un trato muy cercano y respetuoso.",
    name: "Ana y Julián",
    service: "Talleres de Parejas",
    face: "c",
  },
  {
    id: "sofia",
    quote:
      "Contratamos los talleres para nuestro equipo y se notó rápido: menos tensión, mejor comunicación y una forma más sana de resolver los problemas del trabajo.",
    name: "Sofía P.",
    service: "Talleres para Empresas",
    face: "d",
  },
  {
    id: "diego",
    quote:
      "Pude hacer todo el proceso desde casa por videollamada, con la misma calidad que en persona. Cuando quise, pasé al consultorio sin ningún problema.",
    name: "Diego T.",
    service: "Terapia Individual",
    face: "e",
  },
];

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrada distinta a la de las tarjetas de servicios (que suben con fundido):
        // aquí el fondo se asienta, el título se revela con una cortina, la tarjeta
        // entra desde la izquierda y las estrellas y flechas "saltan" una a una.
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, scroller, start: "top 70%" } });
        tl.from(".tm-bg", { scale: 1.2, duration: 1.8, ease: "power2.out" }, 0)
          .from(".tm-label", { opacity: 0, x: -24, duration: 0.7, ease: "power3.out" }, 0.1)
          .from(".tm-title", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "expo.out" }, 0.2)
          .from(".tm-lead", { opacity: 0, filter: "blur(8px)", duration: 0.9, ease: "power2.out" }, 0.6)
          .from(
            ".tm-card",
            { opacity: 0, x: -90, clipPath: "inset(0 100% 0 0 round 22px)", duration: 1.2, ease: "expo.out" },
            0.5,
          )
          .from(".tm-avatar", { scale: 0, duration: 0.6, ease: "back.out(2)" }, 1.1)
          .from(".tm-star", { scale: 0, rotate: -90, duration: 0.5, stagger: 0.08, ease: "back.out(2.4)" }, 1.25)
          .from(".tm-nav", { scale: 0.6, opacity: 0, transformOrigin: "left center", duration: 0.7, ease: "back.out(1.7)" }, 1.4);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  // cada vez que cambia la opinión, el contenido de la tarjeta entra con un fundido suave
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tm-body", { opacity: 0, x: 24, duration: 0.5, ease: "power3.out" });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  const go = (step: number) => setIndex((i) => (i + step + testimonials.length) % testimonials.length);

  return (
    <section ref={root} className="relative w-full overflow-hidden bg-ink text-white">
      <Photo src="/images/bench-trees.jpg" alt="" sizes="100vw" className="tm-bg absolute inset-0" position="50% 40%" />
      <div aria-hidden className="absolute inset-0 bg-ink/80" />

      <div className="relative mx-auto max-w-[1180px] px-[18px] py-24 md:px-10">
        <header className="tm-head max-w-[520px]">
          <span className="tm-label block text-[13px] text-white/70">Opiniones</span>
          <h2 className="tm-title mt-2 text-[clamp(30px,4vw,52px)] font-medium leading-[1.05] tracking-tight">
            Historias reales. Personas que sanan.
          </h2>
          <p className="tm-lead mt-4 text-[15px] leading-snug text-white/70">
            No tienes que creernos a nosotros. Esto es lo que dicen quienes han pasado por nuestros servicios.
          </p>
        </header>

        <div className="mt-12 flex flex-col gap-6 md:mt-14 md:flex-row md:items-end">
          <div
            className="tm-card w-full max-w-[640px] rounded-[22px] bg-white p-6 text-ink md:p-8"
            aria-live="polite"
          >
            <div key={current.id} className="tm-body flex flex-col gap-5 sm:flex-row sm:gap-6">
              <FaceCrop face={current.face} size={72} className="tm-avatar" />
              <div className="flex-1">
                <p className="text-[15px] leading-relaxed">&ldquo;{current.quote}&rdquo;</p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-medium">{current.name}</p>
                    <p className="text-[13px] text-ink/50">{current.service}</p>
                  </div>
                  <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="tm-star size-4 fill-[#f5b82e] text-[#f5b82e]" strokeWidth={0} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tm-nav flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Opinión anterior"
              className="grid size-11 place-items-center rounded-full bg-white/15 transition-transform hover:scale-105 hover:bg-white/25"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Opinión siguiente"
              className="grid size-11 place-items-center rounded-full bg-white/15 transition-transform hover:scale-105 hover:bg-white/25"
            >
              <ArrowRight className="size-4" />
            </button>
            <span className="ml-2 text-[13px] tabular-nums text-white/60">
              {String(index + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
