import Image from "next/image";
import { Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  sage: "from-[#c9d9b8] via-[#dbe6cc] to-[#b9cba9]",
  sky: "from-[#c9d6ee] via-[#dde6f5] to-[#b7c7e6]",
  sand: "from-[#e8dcc0] via-[#f0e8d2] to-[#dccfa9]",
  sea: "from-[#b9d9d6] via-[#d3ebe8] to-[#a5ccc8]",
  slate: "from-[#7d8f9a] via-[#9fb0b8] to-[#6d808c]",
} as const;

type PhotoProps = {
  src?: string;
  alt?: string;
  tone?: keyof typeof tones;
  className?: string;
  /** object-position de la imagen, p. ej. "20% 60%" para recortar una cara */
  position?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Imagen con fallback: si no hay `src` muestra un degradado suave con una luna.
 * Las fotos viven en /public/images.
 */
export function Photo({
  src,
  alt = "",
  tone = "sage",
  className,
  position,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: PhotoProps) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-gradient-to-br",
        tones[tone],
        className,
      )}
    >
      <Moon className="size-1/5 max-h-24 max-w-24 text-white/40" strokeWidth={1} />
    </div>
  );
}
