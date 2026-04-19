import { Hero } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionsSplit } from "@/components/sections/solutions-split";
import { AITeaser } from "@/components/sections/ai-teaser";
import { PlatformTeaser } from "@/components/sections/platform-teaser";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { Cta } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionsSplit />
      <AITeaser />
      <PlatformTeaser />
      <ProjectsPreview />
      <Cta />
    </>
  );
}
