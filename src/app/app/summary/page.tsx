import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type Project = {
  id: number;
  title: string;
  status: string;
  phase: string;
};

type ProjectUpdate = {
  id: number;
  title: string;
  description: string;
  project_slug: string;
};

type Milestone = {
  id: number;
  title: string;
  status: string;
  project_slug: string;
};

type ClientAction = {
  id: number;
  title: string;
  status: string;
  project_slug: string;
};

export default async function SummaryPage() {
  const supabase = await createServerClient();

  const [{ data: projects }, { data: updates }, { data: milestones }, { data: actions }] =
    await Promise.all([
      supabase.from("projects").select("id, title, status, phase"),
      supabase
        .from("project_updates")
        .select("id, title, description, project_slug")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("project_milestones")
        .select("id, title, status, project_slug")
        .order("due_date", { ascending: true })
        .limit(6),
      supabase
        .from("client_actions")
        .select("id, title, status, project_slug")
        .order("due_date", { ascending: true })
        .limit(6),
    ]);

  const typedProjects = (projects ?? []) as Project[];
  const typedUpdates = (updates ?? []) as ProjectUpdate[];
  const typedMilestones = (milestones ?? []) as Milestone[];
  const typedActions = (actions ?? []) as ClientAction[];

  const activeProjects = typedProjects.filter((project) => project.status === "Active");
  const pendingMilestones = typedMilestones.filter(
    (milestone) => milestone.status !== "Completed"
  );
  const pendingActions = typedActions.filter((action) => action.status !== "Completed");

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Summary
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Portfolio intelligence overview
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            View the current state of the wider workspace across active projects,
            delivery updates, milestone pressure points, and client actions that
            may require attention.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">Active Projects</p>
            <p className="mt-4 text-4xl font-bold tracking-tight text-neutral-900">
              {activeProjects.length}
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

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Delivery Feed
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                Latest portfolio updates
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              {typedUpdates.length ? (
                typedUpdates.map((update) => (
                  <div key={update.id} className="rounded-2xl bg-neutral-50 p-5">
                    <p className="text-sm text-neutral-500">{update.project_slug}</p>
                    <h3 className="mt-2 text-lg font-medium text-neutral-900">
                      {update.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-600">
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

          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Milestones
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                  Current delivery pressure points
                </h2>
              </div>

              <div className="mt-6 space-y-4">
                {pendingMilestones.length ? (
                  pendingMilestones.slice(0, 4).map((milestone) => (
                    <div key={milestone.id} className="rounded-2xl bg-neutral-50 p-5">
                      <p className="text-sm text-neutral-500">{milestone.project_slug}</p>
                      <h3 className="mt-2 text-base font-medium text-neutral-900">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Status: {milestone.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                    No pending milestones right now.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  AI Summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                  Portfolio attention preview
                </h2>
              </div>

              <div className="mt-6 rounded-2xl bg-neutral-900 p-6 text-white">
                <p className="text-sm font-medium">Example AI summary</p>
                <p className="mt-3 text-sm leading-7 text-neutral-300">
                  Active projects currently show a concentration of pending actions and
                  unresolved milestone items. The main delivery focus should remain on
                  closing open client decisions before they begin to affect sequencing
                  and coordination continuity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
