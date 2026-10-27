"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useScroller } from "./scroller-context";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/services" },
  { label: "Conócenos", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

export function Nav() {
  const root = useRef<HTMLElement>(null);
  const { scroller } = useScroller();
  const pathname = usePathname();
  // sobre la foto del hero se ve el logo blanco; al pasar a las secciones claras, el de colores
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    if (!scroller) return;
    // solo la portada tiene foto detrás; en las demás páginas siempre va el logo de colores
    const update = () => setOverHero(pathname === "/" && scroller.scrollTop < scroller.clientHeight - 90);
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    return () => scroller.removeEventListener("scroll", update);
  }, [scroller, pathname]);

  useGSAP(
    () => {
      gsap.from(".nav-item", {
        opacity: 0,
        y: -10,
        duration: 0.8,
        stagger: 0.07,
        delay: 0.6,
        ease: "power3.out",
      });
    },
    { scope: root },
  );

  return (
    <nav
      ref={root}
      className="pointer-events-none absolute inset-x-0 top-0 z-50 flex h-[112px] items-start px-[46px] pt-[44px] text-[15px] text-ink"
    >
      <Link
        href="/"
        aria-label="Nueve Lunas — inicio"
        className="nav-item pointer-events-auto relative -ml-1 -mt-0.5 block h-[48px] w-[211px] transition-transform hover:scale-[1.03]"
      >
        <Image
          src="/images/logo-blanco-recortado.png"
          alt="Nueve Lunas"
          width={1920}
          height={436}
          priority
          className={`absolute inset-0 h-full w-full object-contain object-left drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)] transition-opacity duration-500 ${overHero ? "opacity-100" : "opacity-0"}`}
        />
        <Image
          src="/images/logo-full.png"
          alt=""
          aria-hidden
          width={1920}
          height={436}
          className={`absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500 ${overHero ? "opacity-0" : "opacity-100"}`}
        />
      </Link>
      <ul className="absolute left-1/2 top-[44px] hidden -translate-x-1/2 gap-10 md:flex" style={{ marginLeft: "-40px" }}>
        {links.map((l) => (
          <li key={l.label} className="nav-item pointer-events-auto relative">
            {pathname === l.href && (
              <span className="absolute -left-3.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-sage" />
            )}
            <Link href={l.href} className="transition-opacity hover:opacity-60">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <button
        aria-label="Buscar"
        className="nav-item pointer-events-auto absolute right-[22px] top-[26px] grid size-[38px] place-items-center rounded-full bg-white shadow-sm"
      >
        <Search className="size-4" />
      </button>
    </nav>
  );
}
