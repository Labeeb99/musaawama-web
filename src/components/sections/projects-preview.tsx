import Link from "next/link";
import { Container } from "@/components/layout/container";
import { projects } from "@/data/projects";

export function ProjectsPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Project Experience
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Practical project experience shaped by delivery complexity and coordination needs
          </h2>
          <p className="mt-4 text-neutral-600 leading-7">
            Musaawama is rooted in real construction delivery. These project examples reflect the type
            of visibility, structure, and decision-making support that informs the wider platform vision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <div
              key={project.slug}
              className="rounded-3xl border border-neutral-200 p-8"
            >
              <p className="text-sm uppercase tracking-[0.15em] text-neutral-500">
                {project.location}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">{project.title}</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-600">
                {project.summary}
              </p>
              <p className="mt-4 text-sm leading-7 text-neutral-500">
                <span className="font-medium text-neutral-700">Challenge:</span> {project.challenges}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/projects" className="text-sm font-medium text-neutral-900">
            Explore all project experience →
          </Link>
        </div>
      </Container>
    </section>
  );
}
