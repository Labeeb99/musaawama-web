import { Hero } from "@/components/sections/hero";
import { ServicesPreview } from "@/components/sections/services-preview";
import { ProjectsPreview } from "@/components/sections/projects-preview";
import { AIPreview } from "@/components/sections/ai-preview";
import { PlatformPreview } from "@/components/sections/platform-preview";
import { Cta } from "@/components/sections/cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesPreview />
      <ProjectsPreview />
      <AIPreview />
      <PlatformPreview />
      <Cta />
    </>
  );
}
