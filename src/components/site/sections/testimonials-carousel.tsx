"use client";

import { useRef } from "react";
import { Star } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { FaceCrop, type faces } from "../face-crop";
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

/** Segundos que tarda en recorrerse una copia completa de las tarjetas. */
const LOOP_SECONDS = 45;

export function TestimonialsCarousel() {
  const root = useRef<HTMLElement>(null);
  const loop = useRef<gsap.core.Tween | null>(null);
  const tapPaused = useRef(false);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // movimiento constante: la pista tiene dos copias, así que al recorrer
        // la mitad vuelve al inicio sin que se note el salto
        loop.current = gsap.to(".tc-track", { xPercent: -50, duration: LOOP_SECONDS, ease: "none", repeat: -1 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, scroller, start: "top 75%" } });
        tl.from(".tc-title", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "expo.out" }, 0)
          .from(".tc-lead", { opacity: 0, filter: "blur(8px)", duration: 0.9, ease: "power2.out" }, 0.5)
          .from(".tc-viewport", { opacity: 0, x: 120, duration: 1.2, ease: "expo.out" }, 0.4);
        return () => {
          loop.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  const setSpeed = (scale: number) => {
    if (loop.current) gsap.to(loop.current, { timeScale: scale, duration: 0.5, ease: "power2.out", overwrite: true });
  };

  return (
    <section ref={root} className="w-full px-[18px] pb-24 pt-8">
      <header className="mx-auto flex max-w-[1400px] flex-col items-center px-4 text-center">
        <h2 className="tc-title text-balance text-[clamp(30px,4.4vw,56px)] md:whitespace-nowrap font-medium leading-[1.05] tracking-tight">
          Palabras amables de nuestros clientes
        </h2>
        <p className="tc-lead mt-5 max-w-[520px] text-[15px] leading-snug text-[#6f736d]">
          Esto es lo que dicen quienes han pasado por nuestros servicios.
        </p>
      </header>

      <div
        role="region"
        aria-label="Opiniones de clientes"
        // ratón: se detiene al pasar el cursor; táctil: un toque detiene y otro reanuda
        onPointerEnter={(e) => e.pointerType === "mouse" && setSpeed(0)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setSpeed(1)}
        onPointerUp={(e) => {
          if (e.pointerType === "mouse") return;
          tapPaused.current = !tapPaused.current;
          setSpeed(tapPaused.current ? 0 : 1);
        }}
        className="tc-viewport mx-auto mt-14 max-w-[1400px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] motion-reduce:overflow-x-auto"
      >
        <div className="tc-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy === 1} className="flex gap-5 pr-5">
              {testimonials.map((t) => (
                <li
                  key={t.id}
                  className="flex w-[300px] shrink-0 flex-col justify-between gap-6 rounded-[22px] border border-ink/10 bg-white p-6 sm:w-[360px]"
                >
                  <div>
                    <div className="flex gap-0.5" role="img" aria-label="5 de 5 estrellas">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="size-4 fill-[#f5b82e] text-[#f5b82e]" strokeWidth={0} />
                      ))}
                    </div>
                    <p className="mt-4 text-[14px] leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaceCrop face={t.face} size={44} />
                    <div>
                      <p className="text-[14px] font-medium">{t.name}</p>
                      <p className="text-[12px] text-ink/50">{t.service}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
