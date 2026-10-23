import { SiteFrame } from "@/components/site/site-frame";
import { Hero } from "@/components/site/sections/hero";
import { Intro } from "@/components/site/sections/intro";
import { Timeline } from "@/components/site/sections/timeline";
import { Solutions } from "@/components/site/sections/solutions";
import { Checklist } from "@/components/site/sections/checklist";
import { Enhance } from "@/components/site/sections/enhance";
import { InAction } from "@/components/site/sections/in-action";
import { Cta } from "@/components/site/sections/cta";
import { Footer } from "@/components/site/sections/footer";

export default function Home() {
  return (
    <SiteFrame>
      <Hero />
      <Intro />
      <Timeline />
      <Solutions />
      <Checklist />
      <Enhance />
      <InAction />
      <Cta />
      <Footer />
    </SiteFrame>
  );
}
