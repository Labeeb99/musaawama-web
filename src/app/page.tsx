import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { ProblemSection } from "@/components/sections/problem-section";
import { PlatformPreview } from "@/components/sections/platform-preview";
import { AIPreview } from "@/components/sections/ai-preview";
import { ServicesPreview } from "@/components/sections/services-preview";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { Cta } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <PlatformPreview />
      <AIPreview />
      <ServicesPreview />
      <ProjectsPreview />
      <Cta />
    </>
  );
}
