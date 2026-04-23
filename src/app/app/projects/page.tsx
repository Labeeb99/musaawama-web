import Link from "next/link";
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
  const supabase = await createServerClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("slug, title, status, phase, summary")
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const typedProjects = (projects ?? []) as Project[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Projects
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Project workspaces across delivery and coordination
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Open project workspaces, review delivery context, and move into the
            health, documents, and AI assistant layers for each active project.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {typedProjects.length ? (
            typedProjects.map((project) => (
              <div
                key={project.slug}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                    {project.status}
                  </span>

                  <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                    {project.phase}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-neutral-900">
                  {project.title}
                </h2>

                <p className="mt-4 text-base leading-8 text-neutral-600">
                  {project.summary}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/app/projects/${project.slug}`}
                    className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Open workspace
                  </Link>

                  <Link
                    href={`/app/projects/${project.slug}/health`}
                    className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
                  >
                    Health
                  </Link>

                  <Link
                    href={`/app/projects/${project.slug}/assistant`}
                    className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
                  >
                    Assistant
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              No projects available yet.
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
