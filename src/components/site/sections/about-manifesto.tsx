"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

const title = "Nuestra razón de ser";
const text =
  "Creemos que cuidar la mente y el cuerpo es la base de una vida plena. Por eso acompañamos a cada persona con cercanía, sin juicios y a su propio ritmo.";

export function AboutManifesto() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, scroller, start: "top 70%" } });
        tl.from(".mf-word", { yPercent: 110, duration: 1.1, stagger: 0.09, ease: "power4.out" }, 0).from(
          ".mf-line",
          { scaleY: 0, transformOrigin: "top", duration: 1.4, ease: "expo.out" },
          0.2,
        );
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="px-[30px] py-24 md:py-32">
      <div className="mx-auto grid max-w-[1300px] gap-10 md:grid-cols-[0.7fr_1.3fr] md:gap-0">
        <h2 className="text-[clamp(28px,3.2vw,44px)] font-medium leading-[1.1] tracking-tight md:pr-12">
          {title.split(" ").map((w, i) => (
            <span key={i} className="-mb-[0.12em] mr-[0.25em] inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span className="mf-word inline-block">{w}</span>
            </span>
          ))}
        </h2>
        <div className="relative md:pl-12">
          <span aria-hidden className="mf-line absolute inset-y-0 left-0 hidden w-px bg-ink/20 md:block" />
          <p className="text-[clamp(22px,2.6vw,36px)] font-medium leading-[1.2] tracking-tight">
            <WordReveal text={text} start="top 85%" end="top 40%" />
          </p>
        </div>
      </div>
    </section>
  );
}
