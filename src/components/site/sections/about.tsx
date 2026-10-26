"use client";

import { useRef } from "react";
import { MapPin } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";

// Datos comerciales de ejemplo: reemplazar por los reales antes de publicar.
const stats = [
  { value: 1200, prefix: "+", suffix: "", label: "Sesiones realizadas" },
  { value: 12, prefix: "", suffix: "", label: "Profesionales" },
  { value: 98, prefix: "", suffix: "%", label: "Recomienda el servicio" },
];

export function About() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, scroller, start: "top 75%" } });
        tl.from(".ab-media", { clipPath: "inset(0 100% 0 0)", duration: 1.3, ease: "expo.out" }, 0)
          .from(".ab-img", { scale: 1.25, duration: 1.8, ease: "power2.out" }, 0)
          .from(".ab-in", { opacity: 0, x: 40, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.3);

        // las cifras cuentan desde cero hasta su valor
        gsap.utils.toArray<HTMLElement>(".ab-num").forEach((el, i) => {
          const { value, prefix, suffix } = stats[i];
          const counter = { n: 0 };
          const render = () => (el.textContent = `${prefix}${Math.round(counter.n)}${suffix}`);
          render();
          tl.to(counter, { n: value, duration: 1.6, ease: "power2.out", onUpdate: render }, 0.6);
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="grid w-full bg-mint md:min-h-[520px] md:grid-cols-2">
      <div className="ab-media relative min-h-[320px] overflow-hidden">
        <Photo
          src="/images/therapist-office.jpg"
          alt="Consultorio de Nueve Lunas"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="ab-img absolute inset-0"
          position="50% 50%"
        />
      </div>

      <div className="flex flex-col justify-center gap-6 px-[18px] py-14 md:px-14 md:py-16">
        <div>
          <span className="ab-in block text-[13px] text-ink/60">Sobre Nueve Lunas</span>
          <h2 className="ab-in mt-2 text-[clamp(26px,3vw,40px)] font-medium leading-[1.1] tracking-tight">
            Un equipo cercano, a tu lado
          </h2>
          <p className="ab-in mt-4 max-w-[480px] text-[14px] leading-snug text-ink/80">
            Desde 2024 acompañamos a personas, familias y empresas con un equipo de psicólogos y terapeutas
            certificados. Atendemos de forma virtual o presencial, con horarios flexibles y un trato humano.
          </p>
        </div>

        <ul className="flex gap-8">
          {stats.map((s) => (
            <li key={s.label} className="ab-in">
              <p className="ab-num text-[clamp(26px,2.6vw,36px)] font-medium leading-none tabular-nums">
                {s.prefix}
                {s.value}
                {s.suffix}
              </p>
              <p className="mt-1.5 text-[12px] text-ink/60">{s.label}</p>
            </li>
          ))}
        </ul>

        <p className="ab-in flex items-center gap-2 text-[13px] text-ink/70">
          <MapPin className="size-4 shrink-0" strokeWidth={1.5} />
          Lunes a sábado, de 8:00 a 19:00 · Consultorio en Av. Reforma 245, Ciudad de México
        </p>
      </div>
    </section>
  );
}
