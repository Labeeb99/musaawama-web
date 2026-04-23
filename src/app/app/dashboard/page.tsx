import { createServerClient } from "@/lib/supabase-server";
import { Card } from "@/components/app/card";

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const [
    { data: projects },
    { data: leads },
    { data: updates },
  ] = await Promise.all([
    supabase.from("projects").select("id, status"),
    supabase.from("leads").select("id, stage"),
    supabase
      .from("project_updates")
      .select("id, title, project_slug, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalProjects = projects?.length || 0;
  const activeProjects =
    projects?.filter((p) => p.status === "Active").length || 0;

  const totalLeads = leads?.length || 0;
  const convertedLeads =
    leads?.filter((l) => l.stage === "Converted").length || 0;


  return (
    <div className="space-y-8">
      <div className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
          Portfolio overview and current activity
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card title="Total Projects" value={totalProjects} />
        <Card title="Active Projects" value={activeProjects} />
        <Card title="Total Leads" value={totalLeads} />
        <Card title="Converted Leads" value={convertedLeads} />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-medium text-neutral-900">
          Recent activity
        </h2>

        <div className="space-y-3">
          {updates && updates.length ? (
            updates.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <p className="font-medium text-neutral-900">{u.title}</p>
                <p className="text-sm text-neutral-500">
                  Project: {u.project_slug}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 shadow-sm">
              No recent activity recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
