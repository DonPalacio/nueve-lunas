import Image from "next/image";
import { cn } from "@/lib/utils";

const SRC = "/images/bench-trees.jpg";
const RATIO = 2586 / 2000;

/** Caras de la foto del grupo (posición relativa en la imagen) para usarlas como avatares. */
export const faces = {
  a: { x: 0.14, y: 0.54 },
  b: { x: 0.3, y: 0.54 },
  c: { x: 0.51, y: 0.54 },
  d: { x: 0.67, y: 0.54 },
  e: { x: 0.82, y: 0.54 },
} as const;

type FaceCropProps = {
  face: keyof typeof faces;
  /** lado del círculo en px */
  size: number;
  /** cuánto se amplía la foto respecto al círculo */
  zoom?: number;
  className?: string;
};

/** Círculo con el recorte de una cara de la foto grupal. Solo usa <span>/<img>, así que sirve dentro de un <p>. */
export function FaceCrop({ face, size, zoom = 5.5, className }: FaceCropProps) {
  const w = size * zoom;
  const h = w * RATIO;
  const f = faces[face];
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size }}
    >
      <Image
        src={SRC}
        alt=""
        width={2000}
        height={2586}
        sizes={`${Math.round(w)}px`}
        className="absolute max-w-none"
        style={{ width: w, height: h, left: size / 2 - f.x * w, top: size / 2 - f.y * h }}
      />
    </span>
  );
}
