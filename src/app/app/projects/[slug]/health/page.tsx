import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/app/auth-guard";
import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { Container } from "@/components/layout/container";
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
  const supabase = await createServerClient();

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
      <div className="space-y-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Projects", href: "/app/projects" },
              { label: typedProject.title, href: `/app/projects/${typedProject.slug}` },
              { label: "Health" },
            ]}
          />

          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Health
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
              {typedProject.title}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                {typedProject.status}
              </span>

              <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                {typedProject.phase}
              </span>
            </div>

            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
              This screen brings together project updates, milestones, and client actions
              so the current delivery picture can be understood more clearly.
            </p>
          </div>
        </Container>

        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">Recent Updates</p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
                {typedUpdates.length}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">Pending Milestones</p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
                {pendingMilestones.length}
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-neutral-500">Pending Client Actions</p>
              <p className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
                {pendingActions.length}
              </p>
            </div>
          </div>
        </Container>

        <Container>
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Updates
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                  Latest project activity
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {typedUpdates.length ? (
                  typedUpdates.map((update) => (
                    <div key={update.id} className="rounded-2xl bg-neutral-50 p-5">
                      <h3 className="text-lg font-medium text-neutral-900">
                        {update.title}
                      </h3>
                      <p className="mt-3 text-sm leading-6 text-neutral-600">
                        {update.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                    No updates available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Actions
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                  Pending client actions
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {pendingActions.length ? (
                  pendingActions.map((action) => (
                    <div key={action.id} className="rounded-2xl bg-neutral-50 p-5">
                      <h3 className="text-base font-medium text-neutral-900">
                        {action.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Status: {action.status}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Due:{" "}
                        {action.due_date
                          ? new Date(action.due_date).toLocaleDateString()
                          : "No due date set"}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                    No pending actions.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>

        <Container>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                AI Summary
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                Delivery attention preview
              </h2>
            </div>

            <div className="mt-6 rounded-2xl bg-neutral-900 p-6 text-white">
              <p className="text-sm font-medium">Example AI summary</p>
              <p className="mt-3 text-sm leading-7 text-neutral-300">
                This project currently requires attention on pending client actions and
                milestone sequencing. The next priority should be resolving open approvals
                before they affect programme continuity.
              </p>
            </div>
          </div>
        </Container>
      </div>
    </AuthGuard>
  );
}
