import Link from "next/link";
import { Container } from "@/components/layout/container";
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

  const supabase = createServerClient();

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
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Platform Search
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Find projects, updates, actions, and leads
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This search layer will evolve into an AI-assisted navigation tool across the
              full Musaawama workspace.
            </p>
          </div>

          <form className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6">
            <label htmlFor="q" className="mb-2 block text-sm font-medium text-neutral-700">
              Search the workspace
            </label>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                id="q"
                name="q"
                defaultValue={query}
                placeholder="Try: Aldershot, kitchen, approval, refurbishment..."
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              />
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <div className="mt-10 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold">Projects</h2>
                <div className="mt-4 space-y-4">
                  {projects.length ? (
			projects.map((project) => (
			 <Link
				key={project.slug}
				href={`/app/projects/${project.slug}`}
				className="block rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
			 >
				<h3 className="text-xl font-semibold">{project.title}</h3>
				<p className="mt-3 text-sm leading-6 text-neutral-600">{project.summary}</p>
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
                <h2 className="text-2xl font-semibold">Updates</h2>
                <div className="mt-4 space-y-4">
                 {updates.length ? (
                    updates.map((update) => (
                     <Link
                       key={update.id}
                       href={`/app/projects/${update.project_slug}`}
                       className="block rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
                      >
                       <p className="text-sm text-neutral-500">{update.project_slug}</p>
                       <h3 className="mt-1 text-xl font-semibold">{update.title}</h3>
                       <p className="mt-3 text-sm leading-6 text-neutral-600">{update.description}</p>
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
                <h2 className="text-2xl font-semibold">Actions</h2>
                <div className="mt-4 space-y-4">
                  {actions.length ? (
                    actions.map((action) => (
                     <Link
                         key={action.id}
                         href={`/app/projects/${action.project_slug}/health`}
                         className="block rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
                     >
                         <p className="text-sm text-neutral-500">{action.project_slug}</p>
                         <h3 className="mt-1 text-xl font-semibold">{action.title}</h3>
                         <p className="mt-3 text-sm leading-6 text-neutral-600">{action.description}</p>
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
                <h2 className="text-2xl font-semibold">Leads</h2>
                <div className="mt-4 space-y-4">
                  {leads.length ? (
			leads.map((lead) => (
			  <Link
                            key={lead.id}
                            href={`/app/leads/${lead.id}`}
                            className="block rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
                          >
                            <h3 className="text-xl font-semibold">{lead.name}</h3>
                            <p className="mt-3 text-sm leading-6 text-neutral-600">{lead.summary}</p>
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
        </Container>
      </section>
    </AuthGuard>
  );
}
