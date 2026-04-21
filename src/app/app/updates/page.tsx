import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type ProjectUpdate = {
  id: number;
  title: string;
  description: string;
  project_slug: string;
  created_at: string;
};

export default async function UpdatesPage() {
  const supabase = createServerClient();

  const { data: updates, error } = await supabase
    .from("project_updates")
    .select("id, title, description, project_slug, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Updates
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Live delivery update feed
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This section brings together project updates across the workspace so clients
              and teams can quickly understand what has changed, what decisions are pending,
              and what needs attention next.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {(updates as ProjectUpdate[] | null)?.length ? (
              (updates as ProjectUpdate[]).map((update) => (
                <div
                  key={update.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">{update.project_slug}</p>
                      <h2 className="mt-1 text-xl font-semibold">{update.title}</h2>
                    </div>
                    <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                      {new Date(update.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-neutral-600">
                    {update.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                No updates available yet.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">AI update support preview</h2>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              The assistant will later help summarize this feed with prompts such as:
            </p>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Summarize the latest updates across all active projects.”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Which update suggests the highest delivery risk this week?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “What client actions are currently pending across the portfolio?”
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
