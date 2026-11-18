"use client";

import { useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "../scroller-context";

// Preguntas y respuestas de ejemplo: reemplazar por las reales antes de publicar.
const faqs = [
  {
    id: "first-session",
    q: "¿Cómo agendo mi primera cita?",
    a: "Escríbenos desde la página de contacto o por WhatsApp. Te respondemos en menos de 24 horas, te ayudamos a elegir el servicio y el profesional adecuados y reservamos el horario que mejor te quede.",
  },
  {
    id: "length-cost",
    q: "¿Cuánto dura una sesión y cuánto cuesta?",
    a: "La terapia individual dura 50 minutos y la familiar 60. El costo depende del servicio y del profesional; en tu primer contacto te damos el valor exacto, sin compromisos ni cargos ocultos.",
  },
  {
    id: "modality",
    q: "¿Puedo elegir entre atención virtual y presencial?",
    a: "Sí. Todos nuestros servicios se ofrecen en las dos modalidades y puedes cambiar de una a otra cuando quieras, con el mismo equipo y la misma calidad.",
  },
  {
    id: "privacy",
    q: "¿Mi información es confidencial?",
    a: "Totalmente. Lo que hablas en sesión y tus datos personales están protegidos por el secreto profesional y solo se comparten con tu autorización expresa.",
  },
  {
    id: "business",
    q: "¿Los talleres para empresas se adaptan a mi equipo?",
    a: "Sí. Diseñamos los programas a la medida: duración, temas y formato (en tu empresa o en línea) según el tamaño y las necesidades de tu equipo. Cuéntanos tu caso y te enviamos una propuesta.",
  },
];

export function Faq() {
  const root = useRef<HTMLElement>(null);
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, scroller, start: "top 75%" } });
        tl.from(".fq-label", { opacity: 0, x: -24, duration: 0.7, ease: "power3.out" }, 0)
          .from(".fq-title", { clipPath: "inset(0 100% 0 0)", duration: 1.1, ease: "expo.out" }, 0.1)
          .from(".fq-lead", { opacity: 0, filter: "blur(8px)", duration: 0.9, ease: "power2.out" }, 0.5)
          .from(".fq-item", { opacity: 0, y: 32, duration: 0.8, stagger: 0.1, ease: "power3.out" }, 0.3);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section ref={root} className="w-full bg-white px-[18px] py-24">
      <div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[1fr_1.5fr] md:gap-16">
        <header>
          <span className="fq-label block text-[13px] text-ink/60">Preguntas frecuentes</span>
          <h2 className="fq-title mt-2 text-[clamp(28px,3.6vw,48px)] font-medium leading-[1.05] tracking-tight">
            Respuestas rápidas
          </h2>
          <p className="fq-lead mt-4 max-w-[380px] text-[15px] leading-snug text-[#6f736d]">
            Lo que más nos preguntan antes de empezar. Si tu duda no está aquí, escríbenos.
          </p>
          <Link
            href="/contact"
            className="fq-lead mt-6 inline-flex items-center gap-2 text-[13px] underline-offset-4 hover:underline"
          >
            Hablar con el equipo
            <ArrowRight className="size-3.5" />
          </Link>
        </header>

        <ul className="space-y-3">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            const panelId = `${baseId}-${f.id}`;
            return (
              <li
                key={f.id}
                className={`fq-item rounded-[22px] border border-ink/10 transition-colors duration-300 ${isOpen ? "bg-sage" : "bg-white"}`}
              >
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[15px] font-medium"
                  >
                    {f.q}
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/5">
                      <Plus
                        className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        strokeWidth={1.5}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-[14px] leading-relaxed text-ink/80">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
