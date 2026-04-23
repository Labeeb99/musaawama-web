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
  const supabase = await createServerClient();

  const { data: updates, error } = await supabase
    .from("project_updates")
    .select("id, title, description, project_slug, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedUpdates = (updates ?? []) as ProjectUpdate[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Updates
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Live delivery update feed
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Review project activity across the workspace and understand what has changed,
            what decisions may be pending, and which updates matter most right now.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {typedUpdates.length ? (
            typedUpdates.map((update) => (
              <div
                key={update.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                    {update.project_slug}
                  </span>

                  <span className="text-sm text-neutral-500">
                    {new Date(update.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-neutral-900">
                  {update.title}
                </h2>

                <p className="mt-4 text-base leading-8 text-neutral-600">
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

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              AI Support
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              Update interpretation preview
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “Summarise the latest changes across all active projects.”
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “Which update suggests the highest delivery risk this week?”
            </div>

            <div className="rounded-2xl bg-neutral-50 p-5 text-sm leading-7 text-neutral-700">
              “What client decisions are most likely to affect progress?”
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
