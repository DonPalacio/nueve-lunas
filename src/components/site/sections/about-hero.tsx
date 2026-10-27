"use client";

import { useRef } from "react";
import { Moon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";

const title = "Personas que cuidan de personas";

export function AboutHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ delay: 0.3 });
        tl.from(".ah-word", { yPercent: 110, duration: 1.1, stagger: 0.09, ease: "power4.out" }, 0)
          .from(".ah-in", { opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 0)
          .from(".ah-media", { clipPath: "inset(0 100% 0 0)", duration: 1.3, ease: "expo.out" }, 0.1)
          .from(".ah-img", { scale: 1.25, duration: 1.8, ease: "power2.out" }, 0.1)
          .from(".ah-seal", { scale: 0, rotate: -120, duration: 1, ease: "back.out(1.6)" }, 1);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pt-[104px]">
      <div className="grid overflow-hidden bg-mint md:min-h-[600px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center gap-6 px-6 py-14 md:pl-14 md:pr-20">
          <h1 className="text-[clamp(36px,4.8vw,66px)] font-medium leading-[1.04] tracking-tight">
            {title.split(" ").map((w, i) => (
              <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span className="ah-word inline-block">{w}</span>{" "}
              </span>
            ))}
          </h1>
          <p className="ah-in max-w-[460px] text-[15px] leading-snug text-ink/70">
            Somos una fundación de salud mental y física que acompaña a personas, familias y empresas desde 2024, con un
            equipo cercano y un trato humano.
          </p>
          <div className="ah-in flex flex-wrap gap-2.5">
            <a href="#historia" className="rounded-full bg-ink px-5 py-3 text-[13px] text-white transition-transform hover:scale-105">
              Nuestra historia
            </a>
            <a href="#equipo" className="rounded-full bg-white/70 px-5 py-3 text-[13px] transition-transform hover:scale-105">
              Conoce al equipo
            </a>
          </div>
        </div>

        <div className="relative min-h-[380px] md:min-h-0">
          <div className="ah-media absolute inset-0 overflow-hidden">
            <Photo
              src="/images/stacking-hands.jpg"
              alt="Manos del equipo de Nueve Lunas unidas en el centro"
              sizes="(min-width: 768px) 45vw, 100vw"
              priority
              className="ah-img absolute inset-0"
              position="38% 50%"
            />
          </div>
          <div className="ah-seal absolute bottom-10 left-6 grid size-[116px] place-items-center rounded-full bg-butter text-center md:-left-14">
            <div className="flex flex-col items-center gap-1">
              <Moon className="size-5" strokeWidth={1.3} />
              <span className="text-[13px] font-medium leading-tight">
                Desde
                <br />
                2024
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
