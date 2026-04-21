import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type Milestone = {
  id: number;
  project_slug: string;
  title: string;
  status: string;
  due_date: string | null;
};

export default async function MilestonesPage() {
  const supabase = createServerClient();

  const { data: milestones, error } = await supabase
    .from("project_milestones")
    .select("id, project_slug, title, status, due_date")
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Milestones
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Programme and delivery milestones
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This section tracks important project stages, upcoming deadlines, and
              milestone progress so clients and teams can understand what is due next.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6">
            <div className="grid grid-cols-1 gap-4 border-b border-neutral-200 pb-4 text-sm font-medium text-neutral-500 md:grid-cols-4">
              <div>Project</div>
              <div>Milestone</div>
              <div>Status</div>
              <div>Due date</div>
            </div>

            <div className="mt-4 space-y-4">
              {(milestones as Milestone[] | null)?.length ? (
                (milestones as Milestone[]).map((milestone) => (
                  <div
                    key={milestone.id}
                    className="grid grid-cols-1 gap-4 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-700 md:grid-cols-4"
                  >
                    <div className="font-medium text-neutral-900">
                      {milestone.project_slug}
                    </div>
                    <div>{milestone.title}</div>
                    <div>
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-neutral-700">
                        {milestone.status}
                      </span>
                    </div>
                    <div>
                      {milestone.due_date
                        ? new Date(milestone.due_date).toLocaleDateString()
                        : "No date set"}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  No milestones available yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">AI milestone support preview</h2>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Which milestones are currently overdue or at risk?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “What is the next key approval required from the client?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Show me all pending milestones for Aldershot.”
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
