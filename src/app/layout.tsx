import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteFrame } from "@/components/site/site-frame";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fundación Nueve Lunas",
  description:
    "Fundación de psicología: acompañamiento emocional, programas comunitarios y red de profesionales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${manrope.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
