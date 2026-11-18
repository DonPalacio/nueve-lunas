"use client";

import { createContext, useContext } from "react";

type ScrollerValue = {
  scroller: HTMLDivElement | null;
  scrollTo: (y: number) => void;
  /** congela / libera el scroll del usuario (una sección puede bloquearlo mientras corre su animación) */
  stop: () => void;
  start: () => void;
  /** desplaza con animación hasta una posición, ignorando al usuario mientras tanto */
  glideTo: (y: number, opts?: { duration?: number; onComplete?: () => void }) => void;
};

export const ScrollerContext = createContext<ScrollerValue>({
  scroller: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
  glideTo: () => {},
});

export const useScroller = () => useContext(ScrollerContext);
