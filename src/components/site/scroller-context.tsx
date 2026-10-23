"use client";

import { createContext, useContext } from "react";

type ScrollerValue = {
  scroller: HTMLDivElement | null;
  scrollTo: (y: number) => void;
};

export const ScrollerContext = createContext<ScrollerValue>({
  scroller: null,
  scrollTo: () => {},
});

export const useScroller = () => useContext(ScrollerContext);
