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
  const supabase = await createServerClient();

  const { data: milestones, error } = await supabase
    .from("project_milestones")
    .select("id, project_slug, title, status, due_date")
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const typedMilestones = (milestones ?? []) as Milestone[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Milestones
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Programme and delivery milestone view
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Track important project stages, review what is pending, and understand
            which milestone items may affect the sequence of delivery.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {typedMilestones.length ? (
            typedMilestones.map((milestone) => (
              <div
                key={milestone.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                    {milestone.project_slug}
                  </span>

                  <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                    {milestone.status}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-neutral-900">
                  {milestone.title}
                </h2>

                <p className="mt-4 text-sm text-neutral-500">
                  Due:{" "}
                  {milestone.due_date
                    ? new Date(milestone.due_date).toLocaleDateString()
                    : "No due date set"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              No milestones available yet.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              AI Support
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              Milestone interpretation preview
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “Which milestones are currently overdue or at risk?”
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “What is the next key approval required from the client?”
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “Show me all pending milestones for Aldershot.”
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
