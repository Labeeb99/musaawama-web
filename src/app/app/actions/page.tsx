import { Container } from "@/components/layout/container";
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
  const supabase = createServerClient();

  const { data: actions, error } = await supabase
    .from("client_actions")
    .select("id, project_slug, title, description, status, due_date")
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
              Client Actions
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Pending approvals and actions
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This section highlights what clients need to review, approve, or confirm
              so the project can continue moving without unnecessary delay.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {(actions as ClientAction[] | null)?.length ? (
              (actions as ClientAction[]).map((action) => (
                <div
                  key={action.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">{action.project_slug}</p>
                      <h2 className="mt-1 text-xl font-semibold">{action.title}</h2>
                    </div>

                    <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                      {action.status}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-neutral-600">
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

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">AI action support preview</h2>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “What approvals are currently blocking progress?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Which client action is most urgent this week?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Show me all pending approvals for Aldershot.”
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
