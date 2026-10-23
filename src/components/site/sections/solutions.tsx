"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, HeartHandshake, MessagesSquare, Brain, Users, Sprout, type LucideIcon } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";

const cards: { title: string; text: string; icon: LucideIcon; bg: string }[] = [
  { title: "Terapia personalizada", text: "Procesos individuales y a tu medida, con profesionales que se adaptan a lo que necesitas y a lo que estás viviendo.", icon: Brain, bg: "bg-butter" },
  { title: "Apoyo familiar", text: "Acompañamos a madres, padres e hijos para fortalecer los vínculos y construir espacios de diálogo y confianza.", icon: Users, bg: "bg-butter" },
  { title: "Grupos de contención", text: "Espacios grupales guiados donde compartir, escuchar y sanar en comunidad junto a otras personas.", icon: MessagesSquare, bg: "bg-butter" },
  { title: "Primera infancia", text: "Programas de crianza y desarrollo emocional para niñas y niños en sus primeros años de vida.", icon: Sprout, bg: "bg-butter" },
  { title: "Salud mental comunitaria", text: "Talleres, charlas y jornadas abiertas que llevan el cuidado emocional a barrios, escuelas y organizaciones.", icon: HeartHandshake, bg: "bg-butter" },
];

const N = cards.length;
const FLY_Y = 460;
/** Inclinación de cada tarjeta cuando está al frente (la primera entra recta, las demás ladeadas). */
const TILT = [0, -9, -12, -13, -10];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const stackRot = (i: number, d: number) => (i % 2 ? 1 : -1) * (2 + d * 1.2);

/** Coloca cada tarjeta según el progreso p ∈ [0, N-1]: la pasada sube y se endereza, las siguientes se apilan debajo. */
function layout(els: HTMLElement[], p: number) {
  els.forEach((el, i) => {
    const d = i - p;
    if (d < 0) {
      const t = Math.min(1, -d);
      gsap.set(el, {
        y: -t * FLY_Y,
        rotation: lerp(TILT[i], 0, Math.min(1, t * 1.6)),
        scale: 1,
        opacity: 1 - Math.max(0, t - 0.55) / 0.45,
        zIndex: N + 1,
      });
    } else {
      const dd = Math.min(d, 1);
      gsap.set(el, {
        y: d * 9,
        rotation: d >= 1 ? stackRot(i, d) : lerp(TILT[i], stackRot(i, 1), dd),
        scale: 1 - Math.min(d, 4) * 0.02,
        opacity: d > 3 ? 0 : 1,
        zIndex: N - Math.round(d),
      });
    }
  });
}

export function Solutions() {
  const root = useRef<HTMLElement>(null);
  const { scroller, scrollTo } = useScroller();
  const [index, setIndex] = useState(0);
  const stRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!scroller) return;
      const els = gsap.utils.toArray<HTMLElement>(".sol-card");
      layout(els, 0);

      // el título (desenfocado) y la pila de tarjetas suben desde abajo al entrar
      const enter = { trigger: root.current, scroller, start: "top 95%", end: "top 15%", scrub: 0.8 };
      gsap.fromTo(".sol-title", { filter: "blur(14px)", y: 90, opacity: 0.4 }, { filter: "blur(0px)", y: 0, opacity: 1, ease: "none", scrollTrigger: enter });
      gsap.fromTo(".sol-stack", { y: 360 }, { y: 0, ease: "none", scrollTrigger: enter });
      gsap.fromTo(".sol-arrows", { opacity: 0 }, { opacity: 1, ease: "none", scrollTrigger: enter });

      stRef.current = ScrollTrigger.create({
        trigger: root.current,
        scroller,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress * (N - 1);
          layout(els, p);
          setIndex(Math.round(p));
        },
      });
    },
    { scope: root, dependencies: [scroller] },
  );

  const go = (dir: number) => {
    const st = stRef.current;
    if (!st) return;
    const next = Math.max(0, Math.min(N - 1, index + dir));
    scrollTo(st.start + (st.end - st.start) * (next / (N - 1)));
  };

  return (
    <section ref={root} className="relative" style={{ height: "calc(var(--frame-h) * 4)" }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: "var(--frame-h)" }}>
        <h2 className="sol-title absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[58%] whitespace-nowrap text-[clamp(40px,6.6vw,96px)] font-medium uppercase leading-none tracking-tight text-[#e4e6e2]">
          Nuestros servicios
        </h2>

        <div className="sol-arrows absolute left-[140px] top-[calc(50%+78px)] flex gap-1.5 max-lg:left-8">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              onClick={() => go(dir)}
              aria-label={dir < 0 ? "Anterior" : "Siguiente"}
              className="grid size-[38px] place-items-center rounded-full border border-ink/70 transition-colors hover:bg-ink hover:text-white"
            >
              {dir < 0 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          ))}
        </div>

        <div className="sol-stack absolute left-1/2 top-1/2 h-[190px] w-[336px] -translate-x-1/2 -translate-y-[44%]">
          {cards.map(({ title, text, icon: Icon, bg }) => (
            <article
              key={title}
              className="sol-card absolute inset-0 rounded-[26px] bg-[#f6f8f5] p-[26px] shadow-[0_14px_30px_-16px_rgba(0,0,0,0.25)] will-change-transform"
            >
              <div className="flex items-center gap-4">
                <span className={`grid size-[60px] place-items-center rounded-full ${bg}`}>
                  <Icon className="size-6" strokeWidth={1.3} />
                </span>
                <h3 className="text-[19px] font-medium tracking-tight">{title}</h3>
              </div>
              <p className="mt-4 text-[13px] leading-[1.25]">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
