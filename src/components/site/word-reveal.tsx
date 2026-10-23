"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "./scroller-context";

type WordRevealProps = {
  text: string;
  className?: string;
  /** palabras que quedan en gris más oscuro al final (como "Experience" en el diseño) */
  start?: string;
  end?: string;
};

/** Texto que pasa de gris claro a negro palabra por palabra mientras se hace scroll. */
export function WordReveal({ text, className, start = "top 88%", end = "top 50%" }: WordRevealProps) {
  const root = useRef<HTMLSpanElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      gsap.to(".wr-word", {
        opacity: 1,
        ease: "none",
        stagger: 0.15,
        scrollTrigger: { trigger: root.current, scroller, start, end, scrub: 0.5 },
      });
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <span ref={root} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="wr-word inline-block opacity-[0.16]">
          {w}
          {" "}
        </span>
      ))}
    </span>
  );
}
