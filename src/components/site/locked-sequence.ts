import { gsap, ScrollTrigger } from "@/lib/gsap";

type Options = {
  root: HTMLElement;
  scroller: HTMLElement;
  /** animación pausada que se reproduce mientras el scroll está congelado */
  tl: gsap.core.Timeline;
  stop: () => void;
  start: () => void;
  glideTo: (y: number, opts?: { duration?: number; onComplete?: () => void }) => void;
  /** elemento que se centra en pantalla (por defecto, la sección completa) */
  focus?: HTMLElement;
  /** cuándo se dispara: posición de la sección respecto al visor */
  triggerAt?: string;
};

/**
 * Congela el scroll al llegar a una sección, reproduce su animación completa y luego baja
 * con animación a la siguiente sección. Si la persona insiste con la rueda o el dedo, la
 * animación se acelera (hasta 5x) y vuelve poco a poco a su ritmo. Solo ocurre una vez.
 * Devuelve la función que libera el scroll (úsala como limpieza).
 */
export function lockedSequence({ root, scroller, tl, stop, start, glideTo, focus, triggerAt = "top 60%" }: Options) {
  let boost = 1;
  let locked = false;
  let touchY = 0;
  const bump = (amount: number) => {
    boost = Math.min(5, boost + amount);
  };
  const onWheel = (e: WheelEvent) => bump(Math.abs(e.deltaY) / 250);
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent) => {
    const y = e.touches[0].clientY;
    bump(Math.abs(y - touchY) / 90);
    touchY = y;
  };
  const decay = () => {
    boost += (1 - boost) * 0.04;
    tl.timeScale(boost);
  };
  const release = () => {
    if (!locked) return;
    locked = false;
    gsap.ticker.remove(decay);
    scroller.removeEventListener("wheel", onWheel);
    scroller.removeEventListener("touchstart", onTouchStart);
    scroller.removeEventListener("touchmove", onTouchMove);
    start();
  };

  tl.eventCallback("onComplete", () => {
    release();
    const next = root.nextElementSibling as HTMLElement | null;
    if (next) {
      const y = next.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
      gsap.delayedCall(0.4, () => glideTo(y, { duration: 1.4 }));
    }
  });

  const begin = () => {
    locked = true;
    stop();
    scroller.addEventListener("wheel", onWheel, { passive: true });
    scroller.addEventListener("touchstart", onTouchStart, { passive: true });
    scroller.addEventListener("touchmove", onTouchMove, { passive: true });
    gsap.ticker.add(decay);
    tl.play();
    gsap.delayedCall(25, release); // por seguridad: nunca dejar a la persona atrapada
  };

  ScrollTrigger.create({
    trigger: root,
    scroller,
    start: triggerAt,
    once: true,
    onEnter: () => {
      // primero centra la sección en pantalla y recién ahí congela el scroll y arranca
      const el = focus ?? root;
      const box = el.getBoundingClientRect();
      // si el elemento todavía está desplazado por su animación de entrada, se mide donde terminará
      const shift = Number(gsap.getProperty(el, "y")) || 0;
      const view = scroller.getBoundingClientRect();
      // centrado, pero nunca por debajo de la barra de navegación (112px)
      const target = scroller.scrollTop + box.top - shift - view.top - Math.max(120, (view.height - box.height) / 2);
      if (Math.abs(target - scroller.scrollTop) > 6) glideTo(target, { duration: 0.8, onComplete: begin });
      else begin();
    },
  });

  return release;
}
