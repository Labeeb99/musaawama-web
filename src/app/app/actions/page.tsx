import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type ClientAction = {
  id: number;
  project_slug: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
};

export default async function ActionsPage() {
  const supabase = await createServerClient();

  const { data: actions, error } = await supabase
    .from("client_actions")
    .select("id, project_slug, title, description, status, due_date")
    .order("due_date", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const typedActions = (actions ?? []) as ClientAction[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Actions
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Pending approvals and client action view
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Track open decisions, understand what is waiting on client input,
            and identify which actions are most likely to affect progress.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {typedActions.length ? (
            typedActions.map((action) => (
              <div
                key={action.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                    {action.project_slug}
                  </span>

                  <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                    {action.status}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-neutral-900">
                  {action.title}
                </h2>

                <p className="mt-4 text-base leading-8 text-neutral-600">
                  {action.description}
                </p>

                <p className="mt-4 text-sm text-neutral-500">
                  Due:{" "}
                  {action.due_date
                    ? new Date(action.due_date).toLocaleDateString()
                    : "No due date set"}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              No client actions available yet.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              AI Support
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              Action interpretation preview
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “What approvals are currently blocking progress?”
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “Which client action is most urgent this week?”
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “Show me all pending approvals for Aldershot.”
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
