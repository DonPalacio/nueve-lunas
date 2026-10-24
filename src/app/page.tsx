import { Hero } from "@/components/site/sections/hero";
import { Intro } from "@/components/site/sections/intro";
import { Timeline } from "@/components/site/sections/timeline";
import { Solutions } from "@/components/site/sections/solutions";
import { Checklist } from "@/components/site/sections/checklist";
import { Enhance } from "@/components/site/sections/enhance";
import { InAction } from "@/components/site/sections/in-action";
import { Cta } from "@/components/site/sections/cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Timeline />
      <Solutions />
      <Checklist />
      <Enhance />
      <InAction />
      <Cta />
    </>
  );
}
