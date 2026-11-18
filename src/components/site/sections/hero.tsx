"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search, Star } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { useScroller } from "../scroller-context";
import { AnimatedTooltip, type TooltipPerson } from "../animated-tooltip";

type Segment = { words: string[]; brush?: 0 | 1 | 2; after?: string };

const segments: Segment[] = [
  { words: ["Un", "espacio", "seguro,"] },
  { words: ["sin juicios"], brush: 1, after: "," },
  { words: ["sin miedos"], brush: 0, after: "," },
  { words: ["sin presiones"], brush: 2 },
  { words: ["para", "tu", "mente", "y", "corazón"] },
];

/** Qué segmentos van en cada línea del titular. */
const layoutLines = [[0], [1, 2], [3], [4]];

/** Orden en que se escriben: primero "sin miedos", luego "sin juicios" y al final "sin presiones". */
const ORDER = [0, 2, 1, 3, 4];

/** Trazos de pincel irregulares (no son rectángulos) con degradados pastel distintos. */
const brushes = [
  {
    d: "M8 14 C26 4 58 9 96 6 C138 3 190 7 228 12 C238 18 236 30 231 38 C236 46 230 54 218 57 C170 61 120 55 82 59 C48 62 20 58 9 50 C2 42 5 34 9 28 C4 22 4 18 8 14Z",
    stops: ["#bfe3f5", "#d6d2f4", "#f6d3e6"],
    rotate: -1.4,
  },
  {
    d: "M5 20 C20 8 48 7 80 9 C124 11 170 3 214 8 C232 10 239 22 235 32 C233 42 238 50 226 55 C190 63 140 56 100 58 C62 60 30 62 14 54 C4 46 9 38 5 30 C3 26 4 23 5 20Z",
    stops: ["#cdeeb8", "#f4efb4", "#bfe9d9"],
    rotate: 1,
  },
  {
    d: "M10 10 C40 3 84 8 118 5 C160 2 200 9 226 13 C236 22 232 31 236 40 C232 50 220 56 200 58 C158 62 118 54 80 58 C44 62 18 56 8 47 C1 38 8 30 4 22 C3 16 6 12 10 10Z",
    stops: ["#fbd5bd", "#f8cadf", "#dccdf5"],
    rotate: -0.8,
  },
] as const;

function Brush({ i }: { i: 0 | 1 | 2 }) {
  const b = brushes[i];
  const id = `hero-brush-${i}`;
  return (
    <svg
      viewBox="0 0 240 64"
      preserveAspectRatio="none"
      aria-hidden
      className="hero-brush pointer-events-none absolute -left-4 -top-1 h-[calc(100%+0.5rem)] w-[calc(100%+2.25rem)] opacity-90"
      style={{ clipPath: "inset(0 100% 0 0)", transform: `rotate(${b.rotate}deg)` }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0" stopColor={b.stops[0]} />
          <stop offset="0.5" stopColor={b.stops[1]} />
          <stop offset="1" stopColor={b.stops[2]} />
        </linearGradient>
      </defs>
      <path d={b.d} fill={`url(#${id})`} />
      {/* vetas de pincel seco para que no se vea como un bloque plano */}
      <g stroke="#fff" strokeLinecap="round" fill="none" opacity="0.4">
        <path d="M14 22 C60 14 120 27 224 19" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path d="M18 44 C70 38 140 51 220 41" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

/** Nombres y roles de ejemplo para la etiqueta; cámbialos por los reales. El zoom de la cara del medio es mayor porque sale más lejos en la foto. */
const people: TooltipPerson[] = [
  { id: 1, name: "Camila R.", designation: "Psicóloga clínica", face: "a" },
  { id: 2, name: "Sofía L.", designation: "Orientadora familiar", face: "b" },
  { id: 3, name: "Andrés M.", designation: "Terapeuta", face: "c", zoom: 7.5 },
  { id: 4, name: "Daniel T.", designation: "Psiquiatra", face: "d" },
  { id: 5, name: "Valentina P.", designation: "Acompañante", face: "e" },
];

/** Parte una palabra en letras para animarlas una a una. */
function Letters({ word }: { word: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {word.split("").map((c, i) => (
        <span key={i} className="hero-char inline-block whitespace-pre">
          {c}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { scroller, scrollTo } = useScroller();
  // en móvil los avatares van a la mitad de tamaño
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // si la persona pidió menos movimiento, se queda la foto fija
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // con "reducir movimiento" todo se muestra ya terminado, sin escritura ni trazos animados
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".hero-veil", { opacity: 0 });
        gsap.set(".hero-brush", { clipPath: "inset(0 0% 0 0)" });
      });
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to(".hero-veil", { opacity: 0, duration: 1.1, ease: "power1.inOut" })
          // los avatares salen apilados desde el primero
          // un solo tween con valores finales explícitos: así ninguno se queda a medio escalar
          .fromTo(
            ".hero-avatar",
            { scale: 0.4, opacity: 0, x: (i) => -56 * i },
            { scale: 1, opacity: 1, x: 0, duration: 1, ease: "back.out(1.4)" },
            0.5,
          )
          .from(".hero-trust", { opacity: 0, x: -10, duration: 0.6 }, 1.5)
          .from(".hero-cta", { opacity: 0, y: 12, duration: 0.7 }, 3.9)
          .from(".hero-scroll", { opacity: 0, duration: 0.8 }, 4.4);

        // cada frase se escribe letra por letra; las de "sin ..." se pintan con su trazo a la vez que se escriben
        ORDER.forEach((li, n) => {
          const at = 0.7 + n * 0.62;
          tl.from(
            `.hero-seg[data-i="${li}"] .hero-char`,
            { opacity: 0, filter: "blur(10px)", duration: 0.5, stagger: 0.03, ease: "power2.out" },
            at,
          );
          if (segments[li].brush !== undefined) {
            // el trazo avanza a la vez que el barrido de letras (misma velocidad, sin esperar a que termine)
            const chars = segments[li].words[0].length + (segments[li].after?.length ?? 0);
            tl.to(
              `.hero-seg[data-i="${li}"] .hero-brush`,
              { clipPath: "inset(0 0% 0 0)", duration: chars * 0.03 + 0.3, ease: "none" },
              at + 0.04,
            );
          }
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="inicio" ref={root} className="relative p-5" style={{ height: "var(--frame-h)" }}>
      <div className="relative h-full overflow-hidden rounded-[22px] [border-top-right-radius:0]">
        {/* la foto queda debajo y como póster: se ve al instante mientras carga el video */}
        <Photo
          src="/images/hero.jpg"
          alt="Mujeres de la comunidad abrazadas al aire libre"
          priority
          sizes="100vw"
          className="absolute inset-0"
        />
        <video
          ref={video}
          className="absolute inset-0 size-full object-cover"
          poster="/images/hero.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src="/videos/hero-mobile.mp4" media="(max-width: 767px)" type="video/mp4" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* vidrio esmerilado: desenfoca la foto solo detrás del texto y se desvanece hacia los bordes */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-2xl backdrop-saturate-50 [mask-image:radial-gradient(ellipse_72%_66%_at_14%_80%,#000_30%,transparent_82%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
        {/* luz suave desde la esquina del titular para que el texto oscuro se lea sobre cualquier fotograma */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_80%_at_0%_100%,rgba(255,255,255,0.4),transparent_72%)]" />
        <div className="hero-veil absolute inset-0 bg-[#fdfefb]" />

        {/* muesca con esquinas curvas hacia adentro en la esquina superior derecha; el buscador queda sobre el blanco, fuera de la foto */}
        <div className="absolute right-0 top-0 z-10 grid size-14 place-items-center rounded-bl-[20px] bg-[#fdfefb]">
          <button
            aria-label="Buscar"
            className="grid size-10 place-items-center rounded-2xl border border-ink/10 bg-white text-ink/60 transition-colors hover:bg-ink/5"
          >
            <Search className="size-[18px]" strokeWidth={2} />
          </button>
        </div>
        {/* muesca central tipo isla: queda detrás de los links del menú (centrada igual que ellos) */}
        <div
          aria-hidden
          className="absolute top-0 z-10 hidden h-[52px] w-[500px] -translate-x-1/2 rounded-b-[20px] bg-[#fdfefb] md:block"
          style={{ left: "calc(50% - 40px)" }}
        />
        <div
          aria-hidden
          className="absolute top-0 z-10 hidden size-5 md:block"
          style={{
            left: "calc(50% - 40px - 250px - 20px)",
            background: "radial-gradient(circle at 0 100%, transparent 20px, #fdfefb 20.5px)",
          }}
        />
        <div
          aria-hidden
          className="absolute top-0 z-10 hidden size-5 md:block"
          style={{
            left: "calc(50% - 40px + 250px)",
            background: "radial-gradient(circle at 100% 100%, transparent 20px, #fdfefb 20.5px)",
          }}
        />
        <div
          aria-hidden
          className="absolute right-14 top-0 z-10 size-5"
          style={{ background: "radial-gradient(circle at 0 100%, transparent 20px, #fdfefb 20.5px)" }}
        />
        <div
          aria-hidden
          className="absolute right-0 top-14 z-10 size-5"
          style={{ background: "radial-gradient(circle at 0 100%, transparent 20px, #fdfefb 20.5px)" }}
        />

        {/* prueba social abajo a la derecha: equilibra el texto de la izquierda */}
        <div className="hero-trust absolute bottom-[52px] right-[50px] rounded-[22px] bg-white/55 p-4 text-ink backdrop-blur-md max-md:grid max-md:grid-cols-[auto_auto] max-md:items-center max-md:gap-x-2.5 max-md:bottom-auto max-md:left-6 max-md:right-auto max-md:top-[104px]">
          <div className="flex items-center">
            <AnimatedTooltip items={people} size={compact ? 26 : 52} />
          </div>
          <p className="mt-3 text-[13px] font-medium max-md:order-3 max-md:col-span-2 max-md:mt-2"><span className="max-md:hidden">Acompañados por </span>+2 mil personas</p>
          {/* calificación de ejemplo: reemplazar por datos reales antes de publicar */}
          <div className="mt-1.5 flex items-center gap-1.5 max-md:mt-0">
            <div className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-[#f5b72e] text-[#f5b72e]" strokeWidth={1.5} />
              ))}
            </div>
            <span className="text-[12px] text-ink/70 max-md:hidden">4.9 · Opiniones de la comunidad</span>
          </div>
        </div>

        <button
          type="button"
          aria-label="Ir a la siguiente sección"
          onClick={() => scrollTo(scroller?.clientHeight ?? window.innerHeight)}
          className="hero-scroll absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] md:flex"
        >
          Desliza
          <ChevronDown className="size-4 motion-safe:animate-bounce" />
        </button>

        <div className="absolute bottom-[52px] left-[50px] max-w-[820px] max-md:left-6 max-md:right-6">
          <h1 className="text-[clamp(26px,3.3vw,42px)] font-medium leading-[1.2] tracking-tight text-ink">
            {layoutLines.map((ids, row) => (
              <span key={row} className="block">
                {ids.map((id) => {
                  const { words, brush, after } = segments[id];
                  return (
                    <span key={id} data-i={id} className="hero-seg mr-[0.28em] inline-block">
                      {brush !== undefined ? (
                        <>
                          <span className="relative inline-block px-0.5">
                            <Brush i={brush} />
                            <span className="relative">
                              <Letters word={words[0]} />
                            </span>
                          </span>
                          {after && <Letters word={after} />}
                        </>
                      ) : (
                        words.map((w) => (
                          <span key={w} className="mr-[0.28em] inline-block">
                            <Letters word={w} />
                          </span>
                        ))
                      )}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <div className="hero-cta mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] text-ink shadow-sm transition-transform hover:scale-[1.03]"
            >
              Agendar una consulta
              <ArrowRight className="size-3.5" />
            </a>
            <Link
              href="/services"
              className="inline-flex items-center rounded-full border border-ink/25 bg-white/20 px-5 py-3 text-[13px] text-ink backdrop-blur-md transition-colors hover:bg-white/50"
            >
              Conocer los servicios
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
