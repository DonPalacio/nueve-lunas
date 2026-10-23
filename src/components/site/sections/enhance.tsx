"use client";

import { useRef } from "react";
import { ArrowUpRight, ClipboardPlus, Globe, HandHeart, TrendingUp, Timer, FileText, LayoutGrid } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const cards = [
  { title: "Terapia individual", src: "/images/therapy-session.jpg", pos: "50% 40%" },
  { title: "Terapia familiar", src: "/images/stacking-hands.jpg", pos: "50% 50%" },
  { title: "Programas comunitarios", src: "/images/outdoor-booth.jpg", pos: "50% 40%" },
];

const bullets = [
  { icon: Globe, text: "Atención en toda la región" },
  { icon: FileText, text: "Profesionales colegiados" },
  { icon: LayoutGrid, text: "Enfoques para cada etapa de vida" },
  { icon: Timer, text: "Primera cita en menos de 72 horas" },
  { icon: HandHeart, text: "Continuidad y seguimiento del cuidado" },
];

export function Enhance() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const st = { trigger: root.current, scroller, start: "top 85%", end: "top 5%", scrub: 0.8 };
      const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: st });
      // el título sube y el icono crece; primero llega la tarjeta central y de ella salen las laterales
      tl.from(".en-title", { y: 80, opacity: 0.3, duration: 1 }, 0)
        .from(".en-icon", { scale: 0, duration: 0.6 }, 0.2)
        .from(".en-mid", { y: 160, scale: 0.7, opacity: 0, duration: 0.6 }, 0.1)
        .from(".en-side-l", { xPercent: 106, scale: 0.9, duration: 0.5 }, 0.55)
        .from(".en-side-r", { xPercent: -106, scale: 0.9, duration: 0.5 }, 0.55)
        .from(".en-side-l, .en-side-r", { opacity: 0, duration: 0.2 }, 0.55);
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="px-[34px] pb-36 pt-6">
      <h2 className="en-title mx-auto flex flex-wrap items-center justify-center gap-x-5 text-center text-[clamp(34px,4.6vw,60px)] font-normal leading-tight tracking-tight">
        <WordReveal text="Mejora" start="top 90%" end="top 60%" />
        <span className="en-icon grid size-[1.15em] place-items-center rounded-full bg-sage">
          <TrendingUp className="size-[45%]" strokeWidth={1.5} />
        </span>
        <WordReveal text="tu bienestar emocional" start="top 85%" end="top 45%" />
      </h2>

      <div className="mx-auto mt-12 grid max-w-[1010px] gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <article
            key={c.title}
            className={`${i === 0 ? "en-side-l" : i === 1 ? "en-mid relative z-10" : "en-side-r"} rounded-[22px] bg-panel p-4`}
          >
            <div className="relative h-[146px] overflow-hidden rounded-2xl">
              <Photo src={c.src} position={c.pos} alt={c.title} className="absolute inset-0" />
              <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full border border-white/70 text-white">
                <ArrowUpRight className="size-4" />
              </span>
              <span className="absolute right-3 top-3 rounded-lg border border-white/80 px-3 py-1.5 text-[13px] text-white">
                Servicio
              </span>
            </div>
            <div className="mt-5 flex items-center justify-between px-1">
              <h3 className="text-[22px] font-normal tracking-tight">{c.title}</h3>
              <span className="grid size-9 place-items-center rounded-full bg-white">
                <ClipboardPlus className="size-4" strokeWidth={1.4} />
              </span>
            </div>
            <ul className="mt-4 space-y-3 px-1 pb-2 text-[13px] text-[#8e928c]">
              {bullets.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2.5">
                  <Icon className="size-4 shrink-0 text-ink/70" strokeWidth={1.3} />
                  {text}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
