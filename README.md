# Nueve Lunas

Este es el sitio web de la fundación **Nueve Lunas**, una fundación de salud mental y física. Lo estoy construyendo con Next.js y mucha animación. Mi idea es que se sienta calmado y cercano, sin dejar de ser moderno: una sola pantalla con scroll dentro de una tarjeta, textos que se van revelando y secciones que se transforman unas en otras.

El diseño parte de una referencia gratuita que me gustó mucho. Yo la fui adaptando a la fundación, con sus colores, su logo, su tono y textos propios.

## Qué uso

- **Next.js 16** con App Router y TypeScript
- **Tailwind CSS v4** para los estilos
- **shadcn/ui** para los componentes base
- **GSAP + ScrollTrigger** para casi todas las animaciones
- **Lenis** para el scroll suave
- **Three.js** (con React Three Fiber y Drei) ya instalado, para cuando quiera meter escenas 3D
- **Motion** también instalado, por si lo necesito
- **Manrope** como tipografía

## Cómo lo corro

Necesito Node 20 o superior (yo uso la 22).

```bash
npm install
npm run dev
```

Lo abro en [http://localhost:3000](http://localhost:3000). Si ese puerto ya lo tengo ocupado con otro proyecto, uso otro:

```bash
npm run dev -- -p 3002
```

Los cambios se ven al instante cada vez que guardo un archivo.

Antes de subir algo, reviso que todo compile bien:

```bash
npx tsc --noEmit
npx eslint src
```

## Cómo está organizado

```
src/
├─ app/                      layout, estilos globales y la página principal
├─ components/
│  ├─ site/
│  │  ├─ site-frame.tsx      la tarjeta con scroll interno (Lenis + ScrollTrigger)
│  │  ├─ nav.tsx             barra de navegación y logo (cambia de color según la sección)
│  │  ├─ photo.tsx           imagen con degradado de reserva si no hay foto
│  │  ├─ face-crop.tsx       recorte de caras para los avatares
│  │  ├─ word-reveal.tsx     texto que pasa de gris a negro palabra por palabra
│  │  └─ sections/           una carpeta por sección de la página
│  │     ├─ hero.tsx         video de fondo y titular con trazos de pincel
│  │     ├─ intro.tsx        texto que se transforma en las tarjetas de beneficios
│  │     ├─ timeline.tsx     pasos para empezar
│  │     ├─ solutions.tsx    servicios en tarjetas apiladas
│  │     ├─ checklist.tsx    lista de lo que ofrecemos
│  │     ├─ enhance.tsx      tarjetas de servicio
│  │     ├─ in-action.tsx    carrusel con trazos animados
│  │     ├─ cta.tsx          llamado a la acción
│  │     └─ footer.tsx       pie de página con texto en movimiento
│  └─ ui/                    componentes de shadcn
└─ lib/                      utilidades y registro de GSAP
public/
├─ images/                   fotos y logos
└─ videos/                   video del hero
```

## Imágenes y video

- Las fotos son de [Unsplash](https://unsplash.com) con licencia gratuita. Dejé los autores y los IDs en `public/images/CREDITS.md`.
- Los logos de la fundación están en `public/images/`. Para el header uso una versión blanca (sobre la foto) y otra de colores (sobre las secciones claras).
- El video del hero es `public/videos/hero.mp4`: 30 segundos, sin audio, en bucle. Lo armé con ffmpeg a partir de las fotos, con un zoom lento y fundidos. Si pido menos movimiento en mi navegador, se queda la foto fija.

Para cambiar el video, basta con reemplazar ese archivo por otro con el mismo nombre (y si quiero que el bucle no dé saltos, que empiece y termine con la misma imagen).

## Lo que me falta

- Cambiar los textos de ejemplo por los reales de la fundación
- Reemplazar el video del hero por uno con más personas y escenas reales
- Revisar cómo se ve en celular y en tablet; hasta ahora lo he trabajado sobre todo para escritorio
- Hacer más liviano el video antes de publicarlo
- Decidir si cambio los colores pastel de la referencia por los del logo (azul petróleo y durazno)

## Notas

- Trabajo en la rama `santiago`.
- Este proyecto usa una versión de Next.js con cambios respecto a lo que suele conocerse. El archivo `AGENTS.md` lo recuerda, y la documentación está dentro de `node_modules/next/dist/docs/`.
