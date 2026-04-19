import { Container } from "@/components/layout/container";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Projects
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Selected project work shaped by delivery reality, structure, and coordination
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Musaawama’s project perspective is grounded in practical delivery. These examples reflect
            real project conditions where coordination, visibility, sequencing, and decision clarity matter.
          </p>
        </div>

        <div className="mt-12 space-y-8">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="rounded-3xl border border-neutral-200 p-8"
            >
              <p className="text-sm uppercase tracking-[0.15em] text-neutral-500">
                {project.location}
              </p>

              <h2 className="mt-3 text-2xl font-semibold">{project.title}</h2>

              <p className="mt-4 text-base leading-7 text-neutral-600">
                {project.summary}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                    Scope
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {project.scope}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                    Challenge
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {project.challenges}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-500">
                    Outcome
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">
                    {project.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
