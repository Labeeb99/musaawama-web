import Link from "next/link";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type Project = {
  slug: string;
  title: string;
  status: string;
  phase: string;
  summary: string;
};

export default async function AppProjectsPage() {
  const supabase = createServerClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("slug, title, status, phase, summary")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Client Projects
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Project portfolio workspace
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              This section allows clients and teams to open individual project workspaces,
              review updates, and interact with the AI assistant for each live project.
            </p>
          </div>

          <div className="mt-10 grid gap-6">
            {(projects as Project[] | null)?.map((project) => (
              <div
                key={project.slug}
                className="rounded-2xl border border-neutral-200 p-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-neutral-500">{project.phase}</p>
                    <h2 className="mt-1 text-2xl font-semibold">{project.title}</h2>
                  </div>

                  <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                    {project.status}
                  </span>
                </div>

                <p className="mt-4 max-w-3xl text-sm leading-6 text-neutral-600">
                  {project.summary}
                </p>

                <div className="mt-6">
                  <Link
                    href={`/app/projects/${project.slug}`}
                    className="inline-block rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
                  >
                    Open project workspace
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
