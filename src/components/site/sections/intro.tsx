"use client";

import { useRef } from "react";
import { ArrowRight, Brain, HandHeart, HeartHandshake, HeartPulse, Sprout, type LucideIcon } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { FaceCrop } from "../face-crop";
import { useScroller } from "../scroller-context";

type Pill = { icon?: LucideIcon; bg: string; face?: "a" | "b" | "c" | "d" | "e" };
type Token = string | Pill;

const pills: Pill[] = [
  { icon: HeartPulse, bg: "bg-sage" },
  { icon: Brain, bg: "bg-butter" },
  { icon: HandHeart, bg: "bg-mint" },
  { bg: "bg-periwinkle", face: "b" },
];

const tokens: Token[] = [
  "Estamos", "transformando", "el", "cuidado", "de", "la", "salud", "mental",
  pills[0],
  "al", "acercar", "acompañamiento", "profesional", pills[1],
  "a", "tu", "comunidad", "a", "través", "de", "nuestra", "red", "de",
  "terapeutas", pills[2], "y", "programas", "de", "contención", "emocional.", pills[3],
];

/** Palabras que quedan en negro al final del texto; el resto queda en gris. */
const strong = new Set(["salud", "mental", "acompañamiento", "profesional", "terapeutas", "contención", "emocional."]);

const cards = [
  {
    key: "flex",
    title: "Atención flexible",
    text: "Sesiones presenciales y virtuales que se adaptan a tu ritmo y a tu historia.",
    icon: Sprout,
    bg: "bg-[#e7f3d9]",
  },
  { key: "cerca", photo: "/images/bench-trees.jpg", pos: "50% 70%", label: "Cercanía y calidez", bg: "bg-butter" },
  {
    key: "integral",
    title: "Acompañamiento integral",
    text: "Terapia individual, familiar y grupal con un mismo equipo que te conoce.",
    icon: HeartHandshake,
    bg: "bg-mint",
    swoosh: true,
  },
  { key: "prof", photo: "/images/therapist-office.jpg", pos: "70% 50%", label: "Profesionales certificados", bg: "bg-periwinkle" },
] as const;

const ROW_GAP = 76;
const DOT = 46;

export function Intro() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller || !stage.current || !wrap.current) return;
      const q = gsap.utils.selector(root.current);
      const words = q(".in-word");
      const pillEls = q(".in-pill") as HTMLElement[];
      const flyEls = q(".in-fly") as HTMLElement[];
      const cardEls = q(".in-card") as HTMLElement[];
      const inners = q(".in-inner");
      const photos = q(".in-photo");
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const stageBox = () => stage.current!.getBoundingClientRect();
        // centro de la "píldora" i dentro del escenario
        const pillCenter = (i: number) => {
          const r = pillEls[i].getBoundingClientRect();
          const s = stageBox();
          return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width };
        };
        // centro natural de la tarjeta i dentro del escenario (offset* ignora transforms)
        const cardGeom = (i: number) => {
          const c = cardEls[i];
          return {
            x: wrap.current!.offsetLeft + c.offsetLeft + c.offsetWidth / 2,
            y: wrap.current!.offsetTop + c.offsetTop + c.offsetHeight / 2,
            w: c.offsetWidth,
            h: c.offsetHeight,
          };
        };
        const rowCenter = (i: number) => ({
          x: stage.current!.clientWidth / 2 + (i - 1.5) * ROW_GAP,
          y: stage.current!.clientHeight / 2,
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            scroller,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        // 0–5: el texto se revela palabra por palabra y aparecen los iconos
        tl.fromTo(words, { opacity: 0.14 }, { opacity: 1, duration: 1, stagger: { amount: 4 } }, 0);
        tl.fromTo(pillEls, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: { amount: 4 } }, 0.2);
        // 6–7: el texto se desvanece, los iconos se quedan
        tl.to(words, { opacity: 0, duration: 1 }, 6);
        // 7: los iconos pasan a elementos "volantes" que viajan hasta una fila central
        tl.set(pillEls, { opacity: 0 }, 7);
        flyEls.forEach((fly, i) => {
          tl.fromTo(
            fly,
            { x: () => pillCenter(i).x - DOT / 2, y: () => pillCenter(i).y - DOT / 2, opacity: 1 },
            {
              x: () => rowCenter(i).x - DOT / 2,
              y: () => rowCenter(i).y - DOT / 2,
              duration: 1,
              ease: "power2.inOut",
            },
            7,
          );
        });
        // 8: cada círculo se convierte en su tarjeta, que crece hasta su lugar
        tl.set(flyEls, { opacity: 0 }, 8);
        cardEls.forEach((card, i) => {
          tl.fromTo(
            card,
            {
              x: () => rowCenter(i).x - cardGeom(i).x,
              y: () => rowCenter(i).y - cardGeom(i).y,
              scaleX: () => DOT / cardGeom(i).w,
              scaleY: () => DOT / cardGeom(i).h,
              borderRadius: 220,
              opacity: 0,
            },
            { opacity: 1, duration: 0.01 },
            8,
          );
          tl.to(
            card,
            { x: 0, y: 0, scaleX: 1, scaleY: 1, borderRadius: 22, duration: 1.6, ease: "power3.inOut" },
            8,
          );
        });
        // 9.2–10: aparece el contenido de cada tarjeta
        tl.fromTo(photos, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, 9.35);
        tl.fromTo(inners, { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.08 }, 9.55);
        tl.fromTo(".in-cta", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 9.5);
        tl.to({}, { duration: 0.6 }, 10);
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.set(flyEls, { opacity: 0 });
        gsap.fromTo(words, { opacity: 0.2 }, {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: { trigger: ".in-text", scroller, start: "top 80%", end: "bottom 55%", scrub: 0.5 },
        });
        gsap.from(cardEls, {
          y: 50,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: wrap.current, scroller, start: "top 85%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <section
      ref={root}
      id="servicios"
      className="relative lg:h-[calc(var(--frame-h)*4.4)]"
    >
      <div ref={stage} className="relative lg:sticky lg:top-0 lg:h-[var(--frame-h)] lg:overflow-hidden">
        <div className="in-text px-8 py-24 lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center lg:px-[52px] lg:py-0">
          <p className="mx-auto max-w-[1100px] text-center text-[clamp(28px,3.9vw,50px)] font-medium leading-[1.22] tracking-tight">
            {tokens.map((t, i) => {
              if (typeof t === "string") {
                return (
                  <span
                    key={i}
                    className={`in-word mr-[0.26em] inline-block ${strong.has(t) ? "text-ink" : "text-[#8c8f8a]"}`}
                  >
                    {t}
                  </span>
                );
              }
              const Icon = t.icon;
              return (
                <span
                  key={i}
                  className={`in-pill relative mr-[0.26em] inline-grid size-[46px] translate-y-[0.12em] place-items-center overflow-hidden rounded-full ${t.bg}`}
                >
                  {Icon ? (
                    <Icon className="size-[22px] text-ink" strokeWidth={1.4} />
                  ) : (
                    <FaceCrop face={t.face!} size={46} zoom={5} />
                  )}
                </span>
              );
            })}
          </p>
        </div>

        {/* iconos que viajan desde el texto hasta la fila central (solo escritorio) */}
        {pills.map((p, i) => {
          const Icon = p.icon;
          return (
            <span
              key={i}
              className={`in-fly pointer-events-none absolute left-0 top-0 z-10 hidden size-[46px] place-items-center overflow-hidden rounded-full opacity-0 lg:grid ${p.bg}`}
            >
              {Icon ? (
                <Icon className="size-[22px] text-ink" strokeWidth={1.4} />
              ) : (
                <FaceCrop face={p.face!} size={46} zoom={5} />
              )}
            </span>
          );
        })}

        <div
          ref={wrap}
          className="relative px-[34px] pb-24 lg:absolute lg:inset-x-0 lg:top-[calc(50%-192px)] lg:pb-0"
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((c) => (
              <article
                key={c.key}
                className={`in-card relative h-[304px] overflow-hidden rounded-[22px] will-change-transform lg:opacity-0 ${c.bg}`}
              >
                {"photo" in c ? (
                  <>
                    <Photo src={c.photo} position={c.pos} alt={c.label} className="in-photo absolute inset-0" />
                    <span className="in-inner absolute bottom-3.5 left-3.5 rounded-xl bg-white px-3.5 py-2 text-[15px]">
                      {c.label}
                    </span>
                  </>
                ) : (
                  <div className="in-inner flex h-full flex-col justify-between p-[18px]">
                    {"swoosh" in c && (
                      <svg viewBox="0 0 260 304" className="pointer-events-none absolute inset-0 size-full text-periwinkle" fill="none">
                        <path d="M0 200 C40 330 90 290 120 240 L160 304 L190 300 L140 220 C170 160 230 190 250 304" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
                      </svg>
                    )}
                    <div className="relative">
                      <span className="grid size-[58px] place-items-center rounded-full bg-white/70">
                        <c.icon className="size-5" strokeWidth={1.4} />
                      </span>
                      <h3 className="mt-[22px] text-[21px] font-medium tracking-tight">{c.title}</h3>
                    </div>
                    <p className="relative max-w-[210px] text-[14px] leading-snug">{c.text}</p>
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="in-cta mt-10 flex justify-center">
            <a
              href="#programas"
              className="inline-flex items-center gap-2 rounded-full bg-[#3b3d39] px-6 py-3 text-[13px] text-white transition-transform hover:scale-[1.04]"
            >
              Conocer todos los beneficios
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
