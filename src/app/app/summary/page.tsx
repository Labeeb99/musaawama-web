import { Container } from "@/components/layout/container";
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
  const supabase = createServerClient();

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
        .limit(5),
      supabase
        .from("client_actions")
        .select("id, title, status, project_slug")
        .order("due_date", { ascending: true })
        .limit(5),
    ]);

  const activeProjects =
    (projects as Project[] | null)?.filter((project) => project.status === "Active") ?? [];

  const pendingMilestones =
    (milestones as Milestone[] | null)?.filter(
      (milestone) => milestone.status !== "Completed"
    ) ?? [];

  const pendingActions =
    (actions as ClientAction[] | null)?.filter(
      (action) => action.status !== "Completed"
    ) ?? [];

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              AI Portfolio Summary
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Construction intelligence overview
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This page represents the portfolio-level intelligence layer of the platform.
              Over time, the AI assistant will generate real summaries from live project
              data, documents, actions, milestones, and delivery updates.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <p className="text-sm text-neutral-500">Active Projects</p>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {activeProjects.length}
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
                {(updates as ProjectUpdate[] | null)?.map((update) => (
                  <div key={update.id} className="rounded-xl bg-neutral-50 p-4">
                    <p className="text-sm text-neutral-500">{update.project_slug}</p>
                    <h3 className="mt-1 font-medium">{update.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                      {update.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">AI summary preview</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-neutral-900 p-4 text-white">
                  <p className="text-sm font-medium">Example AI summary</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-300">
                    Active projects currently show a concentration of pending client
                    decisions around finishes and coordination. The most immediate focus
                    should be on approvals that affect sequencing and procurement timing.
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                  In the future, this summary will be generated dynamically by the AI
                  assistant from real project records, updates, actions, milestones, and
                  documents.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
