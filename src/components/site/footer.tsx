"use client";

import { useRef } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Send } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "./scroller-context";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Navegación",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Servicios", href: "/services" },
      { label: "Conócenos", href: "/about" },
      { label: "Contacto", href: "/contact" },
    ],
  },
  { title: "Redes", links: ["LinkedIn", "YouTube", "Instagram", "Facebook"].map((label) => ({ label, href: "#" })) },
  { title: "Recursos", links: ["Blog", "Términos de uso", "Política de privacidad"].map((label) => ({ label, href: "#" })) },
];

const phrase = "LA EVOLUCIÓN DEL CUIDADO EMOCIONAL — ";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();

  useGSAP(
    () => {
      if (!scroller) return;
      // Marquesina infinita: dos copias del texto, se desplaza media pista.
      gsap.to(".ft-marquee", { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
      gsap.from(".ft-col", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, scroller, start: "top 70%" },
      });
    },
    { scope: root, dependencies: [scroller] },
  );

  return (
    <footer ref={root} className="px-[18px] pb-[18px]">
      <div className="relative overflow-hidden rounded-[22px] bg-periwinkle px-12 pb-9 pt-[72px]" style={{ minHeight: 608 }}>
        <div className="-mx-12 overflow-hidden">
          <div className="ft-marquee flex w-max whitespace-nowrap text-[clamp(90px,12vw,165px)] font-semibold leading-none tracking-tight text-white">
            <span>{phrase}</span>
            <span>{phrase}</span>
          </div>
        </div>

        <div className="mt-24 grid gap-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1.2fr]">
          {columns.map((c, i) => (
            <div key={c.title} className={`ft-col ${i === 0 ? "" : ""}`}>
              <h3 className="mb-5 text-[16px]">{c.title}</h3>
              <ul className="space-y-2.5 text-[13px]">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition-opacity hover:opacity-60">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="ft-col">
            <Link href="/contact" className="inline-block whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-[13px]">
              Contáctanos ahora
            </Link>
            <div className="mt-3 flex gap-2.5">
              <a href="#" aria-label="Telegram" className="grid size-[38px] place-items-center rounded-full bg-white">
                <Send className="size-4" strokeWidth={1.4} />
              </a>
              <a href="#" aria-label="WhatsApp" className="grid size-[38px] place-items-center rounded-full bg-white">
                <MessageCircle className="size-4" strokeWidth={1.4} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-24 flex items-end justify-between text-[13px]">
          <span>hola@nuevelunas.org</span>
          <a
            href="mailto:hola@nuevelunas.org"
            aria-label="Enviar correo"
            className="grid size-[82px] place-items-center rounded-full bg-[#151515] text-white transition-transform hover:scale-105"
          >
            <Mail className="size-4" />
          </a>
          <span>Desde 2024</span>
        </div>
      </div>
    </footer>
  );
}
