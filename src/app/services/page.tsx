import { About } from "@/components/site/sections/about";
import { ServicesList } from "@/components/site/sections/services-list";
import { TestimonialsCarousel } from "@/components/site/sections/testimonials-carousel";

export default function ServicesPage() {
  return (
    <>
      <ServicesList />
      <TestimonialsCarousel />
      <About />
    </>
  );
}
