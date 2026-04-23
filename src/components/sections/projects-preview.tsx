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

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Practical project experience shaped by delivery complexity and coordination needs
          </h2>

          <p className="mt-6 text-base leading-8 text-neutral-600">
            Musaawama is rooted in real construction delivery. These project examples reflect
            the type of visibility, structure, and decision-making support that informs the
            wider platform vision.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <div
              key={project.slug}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <p className="text-sm text-neutral-500">{project.location}</p>

              <h3 className="mt-3 text-2xl font-semibold text-neutral-900">
                {project.title}
              </h3>

              <p className="mt-4 text-base leading-8 text-neutral-600">
                {project.summary}
              </p>

              <p className="mt-4 text-base leading-8 text-neutral-600">
                <span className="font-medium text-neutral-700">Challenge:</span>{" "}
                {project.challenges}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/projects"
            className="text-sm font-medium text-neutral-900 transition hover:text-neutral-600"
          >
            Explore all project experience →
          </Link>
        </div>
      </Container>
    </section>
  );
}
