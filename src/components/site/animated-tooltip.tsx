"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { FaceCrop, type faces } from "./face-crop";

export type TooltipPerson = {
  id: number;
  name: string;
  designation: string;
  face: keyof typeof faces;
  zoom?: number;
};

/**
 * Avatares apilados; al pasar el mouse por uno aparece una etiqueta con nombre y rol
 * que se inclina siguiendo el puntero (adaptado del AnimatedTooltip de Aceternity).
 * Cada avatar lleva la clase `hero-avatar` para que el hero lo anime al entrar.
 */
export function AnimatedTooltip({ items, size = 56 }: { items: TooltipPerson[]; size?: number }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const spring = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), spring);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), spring);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - r.width / 2);
  };

  return (
    <>
      {items.map((p, i) => (
        <div
          key={p.id}
          className="hero-avatar group relative"
          style={{ zIndex: hovered === p.id ? 30 : 10 - p.id, marginLeft: i === 0 ? 0 : -size * 0.3 }}
          onMouseEnter={() => setHovered(p.id)}
          onMouseLeave={() => setHovered(null)}
        >
          <AnimatePresence>
            {hovered === p.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 10 } }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{ translateX, rotate, whiteSpace: "nowrap" }}
                className="pointer-events-none absolute -top-16 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 shadow-xl"
              >
                <div className="absolute inset-x-10 -bottom-px z-30 h-px w-[20%] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
                <div className="absolute -bottom-px left-10 z-30 h-px w-[40%] bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                <div className="relative z-30 text-base font-bold text-white">{p.name}</div>
                <div className="text-xs text-white">{p.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={onMove}
            className="overflow-hidden rounded-full border-2 border-white transition duration-500 group-hover:scale-105"
            style={{ width: size, height: size }}
          >
            <FaceCrop face={p.face} size={size - 4} zoom={p.zoom} />
          </div>
        </div>
      ))}
    </>
  );
}
