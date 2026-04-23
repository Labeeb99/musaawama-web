import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
};

export default async function SettingsPage() {
  const supabase = await createServerClient();

  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, role")
    .limit(5);

  const typedProfiles = (profiles ?? []) as Profile[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Settings
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            User and workspace preferences
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Manage account visibility, role groundwork, and future platform preference
            settings for notifications, workspace behavior, and AI guidance.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Account
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                Preference direction
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-neutral-50 p-5">
                <p className="font-medium text-neutral-900">Email notifications</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  Users will later control how often project updates and action reminders
                  are sent.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-5">
                <p className="font-medium text-neutral-900">Workspace role visibility</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  Future versions will show project permissions, user roles, and access
                  boundaries more clearly.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                AI
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                Assistant preference direction
              </h2>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-neutral-50 p-5">
                <p className="font-medium text-neutral-900">Assistant tone and style</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  Later, users may choose how concise or detailed the AI assistant should be.
                </p>
              </div>

              <div className="rounded-2xl bg-neutral-50 p-5">
                <p className="font-medium text-neutral-900">Summary priorities</p>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  Future settings may let users prioritize risk, cost, progress, or actions
                  in AI-generated summaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Profiles
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              User profile groundwork
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {typedProfiles.length ? (
              typedProfiles.map((profile) => (
                <div key={profile.id} className="rounded-2xl bg-neutral-50 p-5">
                  <p className="font-medium text-neutral-900">
                    {profile.email || "No email"}
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Role: {profile.role}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                No user profiles synced yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
