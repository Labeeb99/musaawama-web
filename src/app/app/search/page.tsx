import Link from "next/link";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

type Project = {
  slug: string;
  title: string;
  summary: string;
};

type ProjectUpdate = {
  id: number;
  title: string;
  description: string;
  project_slug: string;
};

type ClientAction = {
  id: number;
  title: string;
  description: string;
  project_slug: string;
};

type Lead = {
  id: number;
  name: string;
  summary: string;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const supabase = await createServerClient();

  let projects: Project[] = [];
  let updates: ProjectUpdate[] = [];
  let actions: ClientAction[] = [];
  let leads: Lead[] = [];

  if (query) {
    const [
      { data: projectData },
      { data: updateData },
      { data: actionData },
      { data: leadData },
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("slug, title, summary")
        .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
        .limit(10),

      supabase
        .from("project_updates")
        .select("id, title, description, project_slug")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10),

      supabase
        .from("client_actions")
        .select("id, title, description, project_slug")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10),

      supabase
        .from("leads")
        .select("id, name, summary")
        .or(`name.ilike.%${query}%,summary.ilike.%${query}%`)
        .limit(10),
    ]);

    projects = (projectData ?? []) as Project[];
    updates = (updateData ?? []) as ProjectUpdate[];
    actions = (actionData ?? []) as ClientAction[];
    leads = (leadData ?? []) as Lead[];
  }

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Search
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Find projects, updates, actions, and leads across the workspace
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            This search layer helps you move quickly across the platform and will
            evolve into a more intelligent discovery experience over time.
          </p>
        </div>

        <form className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <label
            htmlFor="q"
            className="mb-3 block text-sm font-medium text-neutral-700"
          >
            Search the workspace
          </label>

          <div className="flex flex-col gap-3 md:flex-row">
            <input
              id="q"
              name="q"
              defaultValue={query}
              placeholder="Try: Aldershot, kitchen, approval, refurbishment..."
              className="w-full rounded-full border border-neutral-300 px-5 py-3 text-sm focus:outline-none"
            />

            <button
              type="submit"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Search
            </button>
          </div>
        </form>

        {query && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">Projects</h2>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {projects.length ? (
                  projects.map((project) => (
                    <Link
                      key={project.slug}
                      href={`/app/projects/${project.slug}`}
                      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
                    >
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {project.summary}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                    No matching projects.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">Updates</h2>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {updates.length ? (
                  updates.map((update) => (
                    <Link
                      key={update.id}
                      href={`/app/projects/${update.project_slug}`}
                      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
                    >
                      <p className="text-sm text-neutral-500">{update.project_slug}</p>
                      <h3 className="mt-2 text-xl font-semibold text-neutral-900">
                        {update.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {update.description}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                    No matching updates.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">Actions</h2>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {actions.length ? (
                  actions.map((action) => (
                    <Link
                      key={action.id}
                      href={`/app/projects/${action.project_slug}/health`}
                      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
                    >
                      <p className="text-sm text-neutral-500">{action.project_slug}</p>
                      <h3 className="mt-2 text-xl font-semibold text-neutral-900">
                        {action.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {action.description}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                    No matching actions.
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-neutral-900">Leads</h2>
              <div className="mt-4 grid gap-4 xl:grid-cols-2">
                {leads.length ? (
                  leads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/app/leads/${lead.id}`}
                      className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-neutral-300 hover:shadow-md"
                    >
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {lead.name}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-neutral-600">
                        {lead.summary}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                    No matching leads.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
