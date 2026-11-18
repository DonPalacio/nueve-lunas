"use client";

import { useRef } from "react";
import { Check, CircleHelp } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockedSequence } from "../locked-sequence";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const PAINT = "#dbe4f3";

const items = [
  "Terapia individual", "Orientación familiar", "Acompañamiento en duelo",
  "Atención en crisis", "Terapia de pareja", "Talleres para escuelas",
  "Evaluación psicológica", "Grupos de apoyo", "Atención virtual y presencial",
];

export function Checklist() {
  const root = useRef<HTMLElement>(null);
  const { scroller, stop, start, glideTo } = useScroller();

  useGSAP(
    () => {
      if (!scroller || !root.current) return;
      const mm = gsap.matchMedia();

      // con "reducir movimiento" todo se queda visible, sin bloqueo ni animación
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".ck-item");

        // estado inicial oculto (así no hay parpadeo antes de que arranque)
        gsap.set(".ck-panel", { y: 80, opacity: 0.3 });
        gsap.set(".ck-aside", { opacity: 0, y: 10 });
        gsap.set(".ck-check", { scale: 0, backgroundColor: "#ffffff" });
        gsap.set(".ck-ring", { opacity: 0 });
        gsap.set(".ck-label", { opacity: 0, x: -14, filter: "blur(6px)", clipPath: "inset(0 100% 0 0)" });
        gsap.set(".ck-line", { scaleX: 0, transformOrigin: "left center" });
        const ticks = gsap.utils.toArray<SVGPathElement>(".ck-tick path");
        ticks.forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: true });
        tl.to(".ck-panel", { y: 0, opacity: 1, duration: 1 }, 0);
        tl.to(".wr-word", { opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" }, 0.15);
        tl.to(".ck-aside", { opacity: 1, y: 0, duration: 0.8 }, 0.5);

        // cada servicio se "marca" como una historia que se confirma: el círculo se pinta, la marca se dibuja,
        // el texto se revela de izquierda a derecha y una línea fina lo subraya
        items.forEach((item, i) => {
          const t = 0.7 + i * 0.3;
          const check = item.querySelector(".ck-check");
          const ring = item.querySelector(".ck-ring");
          const tick = item.querySelector(".ck-tick path");
          tl.to(check, { scale: 1, backgroundColor: PAINT, duration: 0.7, ease: "back.out(2.4)" }, t);
          tl.fromTo(ring, { scale: 1, opacity: 0.6 }, { scale: 2.1, opacity: 0, duration: 0.8, ease: "power2.out", immediateRender: false }, t);
          tl.to(tick, { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" }, t + 0.15);
          tl.to(item.querySelector(".ck-label"), { opacity: 1, x: 0, filter: "blur(0px)", clipPath: "inset(0 0% 0 0)", duration: 0.8 }, t + 0.1);
          tl.to(item.querySelector(".ck-line"), { scaleX: 1, duration: 0.9 }, t + 0.25);
        });

        // el scroll queda congelado hasta que todo se muestre; si la persona insiste, la animación acelera
        return lockedSequence({
          root: root.current!,
          focus: root.current!.querySelector<HTMLElement>(".ck-panel")!,
          scroller,
          tl,
          stop,
          start,
          glideTo,
        });
      });

      return () => mm.revert();
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
            <li key={t} className="ck-item relative flex items-center gap-4 pb-4 text-[clamp(17px,1.7vw,22px)] leading-tight tracking-tight">
              <span className="ck-check relative grid size-9 shrink-0 place-items-center rounded-full bg-periwinkle">
                <span aria-hidden className="ck-ring pointer-events-none absolute inset-0 rounded-full border-2 border-[#9db6e0]" />
                <Check className="ck-tick size-4" strokeWidth={2} />
              </span>
              <span className="ck-label inline-block">{t}</span>
              <span aria-hidden className="ck-line absolute inset-x-0 bottom-0 h-px bg-[#dbe4f3]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
