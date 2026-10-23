"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { Photo } from "../photo";
import { FaceCrop } from "../face-crop";

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

const avatarFaces = ["a", "c", "e"] as const;

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

  // si la persona pidió menos movimiento, se queda la foto fija
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) video.current?.pause();
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(".hero-veil", { opacity: 0, duration: 1.1, ease: "power1.inOut" })
        // los avatares salen apilados desde el primero
        .from(".hero-avatar", { scale: 0.4, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 0.5)
        .from(".hero-avatar:not(:first-child)", { x: (i) => -56 * (i + 1), duration: 0.9, ease: "power3.inOut" }, 0.9)
        .from(".hero-trust", { opacity: 0, x: -10, duration: 0.6 }, 1.5)
        .from(".hero-cta", { opacity: 0, y: 12, duration: 0.7 }, 3.9);

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
    },
    { scope: root },
  );

  return (
    <section id="inicio" ref={root} className="relative p-5" style={{ height: "var(--frame-h)" }}>
      <div className="relative h-full overflow-hidden rounded-[22px]">
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
          src="/videos/hero.mp4"
          poster="/images/hero.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
        {/* vidrio esmerilado: desenfoca la foto solo detrás del texto y se desvanece hacia los bordes */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-2xl backdrop-saturate-50 [mask-image:radial-gradient(ellipse_72%_66%_at_14%_80%,#000_30%,transparent_82%)]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="hero-veil absolute inset-0 bg-[#fdfefb]" />

        <div className="absolute bottom-[52px] left-[50px] max-w-[820px] max-md:left-6 max-md:right-6">
          <div className="mb-[18px] flex">
            {avatarFaces.map((face, i) => (
              <div
                key={face}
                className="hero-avatar relative -ml-4 size-[72px] overflow-hidden rounded-full border border-white/70 first:ml-0"
                style={{ zIndex: 3 - i }}
              >
                <FaceCrop face={face} size={72} />
              </div>
            ))}
          </div>
          <p className="hero-trust mb-14 inline-flex items-center gap-2 rounded-full bg-white/55 px-3 py-1.5 text-[12px] text-ink backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-white" />
            Acompañados por +2 mil personas
          </p>

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

          <a
            href="#contacto"
            className="hero-cta mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[13px] text-ink shadow-sm transition-transform hover:scale-[1.03]"
          >
            Agendar una consulta
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
