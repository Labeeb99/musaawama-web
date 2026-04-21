import Link from "next/link";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type Project = {
  id: number;
  status: string;
};

type ProjectUpdate = {
  id: number;
  title: string;
  description: string;
};

type ClientAction = {
  id: number;
  title: string;
  status: string;
  project_slug: string;
};

type Milestone = {
  id: number;
  title: string;
  status: string;
  project_slug: string;
};

type Lead = {
  id: number;
  name: string;
  stage: string;
};

export default async function DashboardPage() {
  const supabase = createServerClient();

  const [
    { data: projects, error: projectsError },
    { data: updates, error: updatesError },
    { data: actions, error: actionsError },
    { data: milestones, error: milestonesError },
    { data: leads, error: leadsError },
  ] = await Promise.all([
    supabase.from("projects").select("id, status"),
    supabase
      .from("project_updates")
      .select("id, title, description")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("client_actions")
      .select("id, title, status, project_slug")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("project_milestones")
      .select("id, title, status, project_slug")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("id, name, stage")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (projectsError) throw new Error(projectsError.message);
  if (updatesError) throw new Error(updatesError.message);
  if (actionsError) throw new Error(actionsError.message);
  if (milestonesError) throw new Error(milestonesError.message);
  if (leadsError) throw new Error(leadsError.message);

  const typedProjects = (projects ?? []) as Project[];
  const typedUpdates = (updates ?? []) as ProjectUpdate[];
  const typedActions = (actions ?? []) as ClientAction[];
  const typedMilestones = (milestones ?? []) as Milestone[];
  const typedLeads = (leads ?? []) as Lead[];

  const totalProjects = typedProjects.length;
  const activeProjects = typedProjects.filter((p) => p.status === "Active").length;
  const completedProjects = typedProjects.filter((p) => p.status === "Completed").length;
  const pendingActions = typedActions.filter((a) => a.status !== "Completed").length;

  const stats = [
    {
      label: "Total Projects",
      value: String(totalProjects),
      href: "/app/projects",
    },
    {
      label: "Active Projects",
      value: String(activeProjects),
      href: "/app/projects",
    },
    {
      label: "Completed Projects",
      value: String(completedProjects),
      href: "/app/projects",
    },
    {
      label: "Pending Actions",
      value: String(pendingActions),
      href: "/app/actions",
    },
  ];

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Musaawama client workspace
            </h1>
            <p className="mt-4 text-lg text-neutral-600">
              This dashboard is evolving into the main control surface for project
              visibility, AI guidance, delivery tracking, and lead-to-project workflows.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
              >
                <p className="text-sm text-neutral-500">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight">{stat.value}</p>
              </Link>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent project updates</h2>
                <Link href="/app/updates" className="text-sm font-medium text-neutral-900">
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-5">
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
                    No recent updates available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent leads</h2>
                <Link href="/app/leads" className="text-sm font-medium text-neutral-900">
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {typedLeads.length ? (
                  typedLeads.map((lead) => (
                    <Link
                      key={lead.id}
                      href={`/app/leads/${lead.id}`}
                      className="block rounded-xl bg-neutral-50 p-4 transition hover:bg-neutral-100"
                    >
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Stage: {lead.stage}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No recent leads available yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Pending actions</h2>
                <Link href="/app/actions" className="text-sm font-medium text-neutral-900">
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {typedActions.length ? (
                  typedActions.map((action) => (
                    <Link
                      key={action.id}
                      href={`/app/projects/${action.project_slug}/health`}
                      className="block rounded-xl bg-neutral-50 p-4 transition hover:bg-neutral-100"
                    >
                      <p className="text-sm text-neutral-500">{action.project_slug}</p>
                      <h3 className="mt-1 font-medium">{action.title}</h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Status: {action.status}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No pending actions available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Milestones</h2>
                <Link href="/app/milestones" className="text-sm font-medium text-neutral-900">
                  View all
                </Link>
              </div>

              <div className="mt-6 space-y-4">
                {typedMilestones.length ? (
                  typedMilestones.map((milestone) => (
                    <div key={milestone.id} className="rounded-xl bg-neutral-50 p-4">
                      <p className="text-sm text-neutral-500">{milestone.project_slug}</p>
                      <h3 className="mt-1 font-medium">{milestone.title}</h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Status: {milestone.status}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No milestones available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
