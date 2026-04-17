import Link from "next/link";
import { Container } from "@/components/layout/container";
import { projects } from "@/data/projects";

export function ProjectsPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Projects
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Selected work and delivery experience
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <div key={project.slug} className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-sm text-neutral-500">{project.location}</p>
              <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {project.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/projects" className="text-sm font-medium text-neutral-900">
            View all projects →
          </Link>
        </div>
      </Container>
    </section>
  );
}
