"use client";

import { useRef } from "react";
import { ArrowRight, ClipboardList, CircleHelp, Play, Video } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { lockedSequence } from "../locked-sequence";
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
  const { scroller, stop, start, glideTo } = useScroller();

  useGSAP(
    () => {
      if (!scroller || !root.current) return;
      const mm = gsap.matchMedia();
      const swirlPaths = gsap.utils.toArray<SVGPathElement>(".ia-swirl");

      // con "reducir movimiento" todo queda visible y los trazos dibujados, sin bloqueo
      mm.add("(prefers-reduced-motion: reduce)", () => {
        swirlPaths.forEach((p) => gsap.set(p, { strokeDasharray: p.getTotalLength(), strokeDashoffset: 0 }));
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const lens = swirlPaths.map((p) => p.getTotalLength());
        const cards = gsap.utils.toArray<HTMLElement>(".ia-card");

        // estado inicial oculto
        gsap.set(".ia-hicon", { scale: 0, rotate: -50 });
        gsap.set(".ia-clip", { scale: 0, rotate: 40, backgroundColor: "#ffffff" });
        gsap.set(".ia-cta", { opacity: 0, x: 24 });
        gsap.set(cards, { opacity: 0, y: 90, scale: 0.94, rotateX: 14, transformPerspective: 900, transformOrigin: "50% 100%" });
        swirlPaths.forEach((p, i) => gsap.set(p, { strokeDasharray: lens[i], strokeDashoffset: lens[i] }));
        gsap.set(".ia-play", { scale: 0 });
        gsap.set(".ia-ring", { opacity: 0 });
        gsap.set(".ia-chip", { opacity: 0, x: 18 });
        gsap.set(".ia-title, .ia-text", { opacity: 0, y: 18, filter: "blur(6px)" });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: true });
        tl.to(".ia-hicon", { scale: 1, rotate: 0, duration: 0.8, stagger: 0.12, ease: "back.out(2.4)" }, 0);
        tl.to(".wr-word", { opacity: 1, duration: 0.5, stagger: 0.09, ease: "power2.out" }, 0.2);
        // el icono dentro del título se pinta de menta al girar hasta su lugar
        tl.to(".ia-clip", { scale: 1, rotate: 0, backgroundColor: "#d9efe0", duration: 0.9, ease: "back.out(2.2)" }, 0.9);
        tl.to(".ia-cta", { opacity: 1, x: 0, duration: 0.9 }, 1.1);

        // cada tarjeta se levanta como una página que se abre; su trazo azul se dibuja y el contenido llega en cascada
        cards.forEach((card, i) => {
          const t = 1.2 + i * 0.4;
          const sel = (q: string) => card.querySelector(q);
          tl.to(card, { opacity: 1, y: 0, scale: 1, rotateX: 0, duration: 1.1 }, t);
          tl.to(sel(".ia-swirl"), { strokeDashoffset: 0, duration: 1.5, ease: "sine.inOut" }, t + 0.2);
          tl.to(sel(".ia-play"), { scale: 1, duration: 0.7, ease: "back.out(2.6)" }, t + 0.35);
          tl.fromTo(sel(".ia-ring"), { scale: 1, opacity: 0.6 }, { scale: 2, opacity: 0, duration: 0.8, ease: "power2.out", immediateRender: false }, t + 0.35);
          tl.to(sel(".ia-chip"), { opacity: 1, x: 0, duration: 0.7 }, t + 0.45);
          tl.to(sel(".ia-title"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 }, t + 0.5);
          tl.to(sel(".ia-text"), { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 }, t + 0.62);
        });

        // ya mostradas, los trazos siguen borrándose y dibujándose en bucle mientras la sección esté a la vista
        const loops: gsap.core.Tween[] = [];
        tl.call(() => {
          swirlPaths.forEach((p, i) => {
            loops.push(
              gsap.to(p, {
                strokeDashoffset: lens[i],
                duration: 2.6,
                delay: 1 + i * 0.35,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                repeatDelay: 0.8,
                scrollTrigger: { trigger: root.current, scroller, start: "top 85%", toggleActions: "play pause resume pause" },
              }),
            );
          });
        });

        const release = lockedSequence({ root: root.current!, scroller, tl, stop, start, glideTo });
        return () => {
          release();
          loops.forEach((l) => l.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="overflow-hidden px-[18px] pb-24 pt-12">
      <div className="ia-head flex flex-wrap items-center gap-6 px-1">
        <div className="flex gap-2">
          <span className="ia-hicon grid size-[46px] place-items-center rounded-full bg-periwinkle">
            <Video className="size-[18px]" strokeWidth={1.4} />
          </span>
          <span className="ia-hicon grid size-[46px] place-items-center rounded-full bg-periwinkle">
            <CircleHelp className="size-[18px]" strokeWidth={1.4} />
          </span>
        </div>
        <h2 className="mx-auto flex-1 text-[clamp(30px,3.4vw,44px)] font-normal leading-[1.15] tracking-tight md:ml-[10%] md:max-w-[620px]">
          <WordReveal text="Míralo en acción:" start="top 85%" end="top 60%" />
          <br />
          <WordReveal text="Vive" start="top 80%" end="top 55%" />
          <span className="ia-clip mx-1 inline-grid size-[1.1em] translate-y-[0.1em] place-items-center rounded-full bg-mint">
            <ClipboardList className="size-[45%]" strokeWidth={1.4} />
          </span>{" "}
          <WordReveal text="la diferencia" start="top 75%" end="top 50%" />
        </h2>
        <a href="#contacto" className="ia-cta inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12px] text-white">
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
              <span className="ia-play relative grid size-9 place-items-center rounded-full bg-white">
                <span aria-hidden className="ia-ring pointer-events-none absolute inset-0 rounded-full border-2 border-[#9db6e0]" />
                <Play className="size-3.5" strokeWidth={1.5} />
              </span>
              <span className="ia-chip inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-[13px]">
                Explorar <ArrowRight className="size-3" />
              </span>
            </div>
            <div className="absolute inset-x-[27px] bottom-[26px]">
              <h3 className="ia-title whitespace-pre-line text-[19px] leading-[1.15] tracking-tight">{it.title}</h3>
              <p className="ia-text mt-3 text-[12.5px] leading-snug text-[#8e928c]">{it.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
