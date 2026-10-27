"use client";

import { useRef } from "react";
import { Eye, Target, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";

const cards: { title: string; text: string; icon: LucideIcon; bg: string }[] = [
  {
    title: "Misión",
    text: "Acompañar a personas, familias y empresas en el cuidado de su salud mental y física, con atención cercana, profesional y accesible, en la modalidad que cada quien necesite.",
    icon: Target,
    bg: "bg-butter",
  },
  {
    title: "Visión",
    text: "Ser una fundación de referencia en bienestar emocional, donde pedir ayuda sea algo natural y cada comunidad cuente con un espacio seguro para sanar y crecer.",
    icon: Eye,
    bg: "bg-[#e0e0e0]",
  },
];

export function AboutMission() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, scroller, start: "top 70%" } });
        tl.from(".ms-media", { clipPath: "inset(0 100% 0 0)", duration: 1.3, ease: "expo.out" }, 0)
          .from(".ms-img", { scale: 1.25, duration: 1.8, ease: "power2.out" }, 0)
          .from(".ms-card", { opacity: 0, x: 40, duration: 0.9, stagger: 0.15, ease: "power3.out" }, 0.3)
          .from(".ms-in", { opacity: 0, y: 18, duration: 0.7, stagger: 0.07, ease: "power3.out" }, 0.6);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="-mt-[50px] px-[18px] py-6">
      <div className="mx-auto grid max-w-[1400px] gap-4 rounded-[22px] p-4 md:grid-cols-[0.8fr_1.2fr] md:p-5">
        <div className="ms-media relative min-h-[420px] overflow-hidden rounded-[22px]">
          <Photo
            src="/images/person-chair.jpg"
            alt="Terapeuta conversando con una persona durante una sesión"
            sizes="(min-width: 768px) 40vw, 100vw"
            className="ms-img absolute inset-0"
            position="50% 40%"
          />
        </div>

        <div className="flex flex-col gap-4">
          {cards.map(({ title, text, icon: Icon, bg }) => (
            <article key={title} className={`ms-card flex flex-1 flex-col justify-between gap-8 rounded-[22px] p-7 md:p-9 ${bg}`}>
              <span className="ms-in grid size-[52px] place-items-center rounded-full bg-white/70">
                <Icon className="size-5" strokeWidth={1.3} />
              </span>
              <div>
                <h2 className="ms-in text-[clamp(26px,3vw,40px)] font-medium leading-[1.1] tracking-tight">{title}</h2>
                <p className="ms-in mt-3 max-w-[560px] text-[15px] leading-snug text-ink/80">{text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
