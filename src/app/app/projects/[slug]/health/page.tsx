import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Project = {
  slug: string;
  title: string;
  status: string;
  phase: string;
};

type ProjectUpdate = {
  id: number;
  title: string;
  description: string;
};

type Milestone = {
  id: number;
  title: string;
  status: string;
  due_date: string | null;
};

type ClientAction = {
  id: number;
  title: string;
  status: string;
  due_date: string | null;
};

export default async function ProjectHealthPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const [
    { data: project, error: projectError },
    { data: updates, error: updatesError },
    { data: milestones, error: milestonesError },
    { data: actions, error: actionsError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("slug, title, status, phase")
      .eq("slug", slug)
      .single(),
    supabase
      .from("project_updates")
      .select("id, title, description")
      .eq("project_slug", slug)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("project_milestones")
      .select("id, title, status, due_date")
      .eq("project_slug", slug)
      .order("due_date", { ascending: true }),
    supabase
      .from("client_actions")
      .select("id, title, status, due_date")
      .eq("project_slug", slug)
      .order("due_date", { ascending: true }),
  ]);

  if (projectError || !project) {
    notFound();
  }

  if (updatesError) throw new Error(updatesError.message);
  if (milestonesError) throw new Error(milestonesError.message);
  if (actionsError) throw new Error(actionsError.message);

  const typedProject = project as Project;
  const typedUpdates = (updates ?? []) as ProjectUpdate[];
  const typedMilestones = (milestones ?? []) as Milestone[];
  const typedActions = (actions ?? []) as ClientAction[];

  const pendingMilestones = typedMilestones.filter(
    (item) => item.status !== "Completed"
  );
  const pendingActions = typedActions.filter(
    (item) => item.status !== "Completed"
  );

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Projects", href: "/app/projects" },
              { label: typedProject.title, href: `/app/projects/${typedProject.slug}` },
              { label: "Health" },
            ]}
          />
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Health
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {typedProject.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                {typedProject.status}
              </span>
              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                {typedProject.phase}
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">Recent Updates</p>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {typedUpdates.length}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">Pending Milestones</p>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {pendingMilestones.length}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">Pending Client Actions</p>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {pendingActions.length}
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Latest updates</h2>
              <div className="mt-6 space-y-4">
                {typedUpdates.length ? (
                  typedUpdates.map((update) => (
                    <div key={update.id} className="rounded-xl bg-neutral-50 p-4">
                      <h3 className="font-medium">{update.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {update.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No updates available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Pending actions</h2>
              <div className="mt-6 space-y-4">
                {pendingActions.length ? (
                  pendingActions.map((action) => (
                    <div key={action.id} className="rounded-xl bg-neutral-50 p-4">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Status: {action.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No pending actions.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">AI health summary preview</h2>
            <div className="mt-6 rounded-xl bg-neutral-900 p-4 text-white">
              <p className="text-sm font-medium">Example AI summary</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                This project currently requires attention on pending client actions and
                milestone sequencing. The next priority should be resolving open approvals
                before they affect programme continuity.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
