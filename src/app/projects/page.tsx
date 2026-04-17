import { Container } from "@/components/layout/container";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div key={project.slug} className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-sm text-neutral-500">{project.location}</p>
              <h2 className="mt-2 text-xl font-semibold">{project.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {project.summary}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
