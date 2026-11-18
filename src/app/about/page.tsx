import { AboutHero } from "@/components/site/sections/about-hero";
import { AboutHistory } from "@/components/site/sections/about-history";
import { AboutManifesto } from "@/components/site/sections/about-manifesto";
import { AboutMission } from "@/components/site/sections/about-mission";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutManifesto />
      <AboutMission />
      <AboutHistory />
    </>
  );
}
