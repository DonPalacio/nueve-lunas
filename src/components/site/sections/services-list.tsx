"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  Clock,
  HeartHandshake,
  MapPin,
  MonitorSmartphone,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";
import { WordReveal } from "../word-reveal";

type Service = {
  id: string;
  title: string;
  short: string;
  text: string;
  points: string[];
  meta: { icon: LucideIcon; label: string }[];
  icon: LucideIcon;
  bg: string;
  chip: string;
  photo: string;
  pos?: string;
};

const services: Service[] = [
  {
    id: "individual",
    title: "Terapia Individual",
    short: "Individual",
    text: "Un espacio privado y seguro para entenderte, sanar y avanzar a tu ritmo, con un profesional que te escucha sin juzgar.",
    points: ["Ansiedad, estrés y estado de ánimo", "Duelo, crisis y cambios de vida", "Autoestima y crecimiento personal"],
    meta: [
      { icon: Clock, label: "Sesiones de 50 min" },
      { icon: User, label: "Adultos y jóvenes" },
    ],
    icon: User,
    bg: "bg-sage",
    chip: "bg-white/70",
    photo: "/images/counseling.jpg",
    pos: "50% 40%",
  },
  {
    id: "family",
    title: "Terapia Familiar",
    short: "Familiar",
    text: "Acompañamos a madres, padres e hijos para mejorar la comunicación, resolver conflictos y fortalecer los vínculos.",
    points: ["Crianza y límites con cariño", "Conflictos y cambios en la familia", "Adolescencia y primera infancia"],
    meta: [
      { icon: Clock, label: "Sesiones de 60 min" },
      { icon: Users, label: "Toda la familia" },
    ],
    icon: Users,
    bg: "bg-butter",
    chip: "bg-white/70",
    photo: "/images/group-couch.jpg",
    pos: "50% 50%",
  },
  {
    id: "couples",
    title: "Talleres de Parejas",
    short: "Parejas",
    text: "Encuentros guiados para aprender a comunicarse mejor, reconstruir la confianza y volver a disfrutar de estar juntos.",
    points: ["Comunicación y acuerdos", "Confianza e intimidad", "Herramientas para el día a día"],
    meta: [
      { icon: Clock, label: "Ciclos de varias semanas" },
      { icon: HeartHandshake, label: "Grupos pequeños" },
    ],
    icon: HeartHandshake,
    bg: "bg-periwinkle",
    chip: "bg-white/70",
    photo: "/images/stacking-hands.jpg",
    pos: "50% 55%",
  },
  {
    id: "business",
    title: "Talleres para Empresas",
    short: "Empresas",
    text: "Programas de bienestar emocional para equipos: menos estrés, mejor comunicación y un ambiente de trabajo más sano.",
    points: ["Manejo del estrés y prevención del desgaste", "Trabajo en equipo y liderazgo", "Charlas y jornadas a medida"],
    meta: [
      { icon: Clock, label: "Duración a convenir" },
      { icon: Briefcase, label: "En tu empresa o en línea" },
    ],
    icon: Briefcase,
    bg: "bg-mint",
    chip: "bg-white/70",
    photo: "/images/outdoor-booth.jpg",
    pos: "50% 50%",
  },
  {
    id: "modalities",
    title: "Atención Virtual y Presencial",
    short: "Modalidades",
    text: "Elige cómo prefieres ser atendido. El mismo equipo y la misma calidad, en la modalidad que mejor se adapte a ti.",
    points: ["Virtual: desde tu casa, por videollamada", "Presencial: en nuestro consultorio", "Puedes cambiar de modalidad cuando quieras"],
    meta: [
      { icon: MonitorSmartphone, label: "Virtual" },
      { icon: MapPin, label: "Presencial" },
    ],
    icon: MonitorSmartphone,
    bg: "bg-sage",
    chip: "bg-white/70",
    photo: "/images/therapy-talk.jpg",
    pos: "50% 40%",
  },
];

export function ServicesList() {
  const root = useRef<HTMLElement>(null);
  const { scroller, scrollTo } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".sv-head > *", { opacity: 0, y: 24, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.3 });
        gsap.from(".sv-chip", { opacity: 0, y: 12, duration: 0.6, stagger: 0.07, ease: "power3.out", delay: 0.7 });

        gsap.utils.toArray<HTMLElement>(".sv-card").forEach((card) => {
          const st = { trigger: card, scroller, start: "top 85%" };
          gsap.from(card, { opacity: 0, y: 70, duration: 1, ease: "power3.out", scrollTrigger: st });
          gsap.from(card.querySelectorAll(".sv-in"), {
            opacity: 0,
            y: 18,
            duration: 0.7,
            stagger: 0.09,
            delay: 0.25,
            ease: "power3.out",
            scrollTrigger: st,
          });
          gsap.fromTo(
            card.querySelector(".sv-img"),
            { scale: 1.18 },
            { scale: 1, ease: "none", scrollTrigger: { trigger: card, scroller, start: "top 100%", end: "bottom 40%", scrub: 0.6 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el || !scroller) return;
    const y = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 90;
    scrollTo(y);
  };

  return (
    <section ref={root} className="px-[18px] pb-24 pt-[130px]">
      <header className="sv-head mx-auto flex max-w-[900px] flex-col items-center px-4 text-center">
        <span className="rounded-full bg-sage px-4 py-1.5 text-[12px]">Nuestros servicios</span>
        <h1 className="mt-6 text-[clamp(36px,5.6vw,76px)] font-medium leading-[1.04] tracking-tight">
          <WordReveal text="Un acompañamiento para cada momento de tu vida" start="top 90%" end="top 55%" />
        </h1>
        <p className="mt-6 max-w-[520px] text-[15px] leading-snug text-[#6f736d]">
          Terapia, talleres y atención a tu medida, con profesionales cercanos y en la modalidad que prefieras.
        </p>
        <nav aria-label="Ir a un servicio" className="mt-8 flex flex-wrap justify-center gap-2">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => jump(s.id)}
              className="sv-chip rounded-full border border-ink/15 bg-white px-4 py-2 text-[13px] transition-colors hover:bg-ink hover:text-white"
            >
              {s.short}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto mt-16 flex max-w-[1180px] flex-col gap-5">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <article
              key={s.id}
              id={s.id}
              className={`sv-card grid overflow-hidden rounded-[22px] md:grid-cols-2 ${s.bg}`}
            >
              <div
                className={`flex flex-col justify-between gap-10 p-7 md:p-10 ${i % 2 ? "md:order-2" : ""}`}
              >
                <div>
                  <div className="sv-in flex items-center justify-between">
                    <span className={`grid size-[58px] place-items-center rounded-full ${s.chip}`}>
                      <Icon className="size-6" strokeWidth={1.3} />
                    </span>
                    <span className="text-[13px] tabular-nums text-ink/50">
                      {String(i + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="sv-in mt-8 text-[clamp(26px,3vw,40px)] font-medium leading-[1.1] tracking-tight">
                    {s.title}
                  </h2>
                  <p className="sv-in mt-4 max-w-[440px] text-[15px] leading-snug">{s.text}</p>
                  <ul className="mt-6 space-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="sv-in flex items-start gap-3 text-[14px] leading-snug">
                        <span className="mt-px grid size-6 shrink-0 place-items-center rounded-full bg-white/70">
                          <Check className="size-3.5" strokeWidth={2} />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <ul className="sv-in flex flex-wrap gap-2">
                    {s.meta.map(({ icon: M, label }) => (
                      <li key={label} className="flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[12px]">
                        <M className="size-3.5" strokeWidth={1.5} />
                        {label}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="sv-in mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] text-white transition-transform hover:scale-[1.04]"
                  >
                    Agendar una cita
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              <div className={`relative min-h-[280px] overflow-hidden md:min-h-[480px] ${i % 2 ? "md:order-1" : ""}`}>
                <Photo
                  src={s.photo}
                  position={s.pos}
                  alt={s.title}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="sv-img absolute inset-0"
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
