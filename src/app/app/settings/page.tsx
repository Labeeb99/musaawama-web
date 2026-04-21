import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
};

export default async function SettingsPage() {
  const supabase = createServerClient();

  const { data: profiles } = await supabase
    .from("user_profiles")
    .select("id, email, full_name, role")
    .limit(5);

  const typedProfiles = (profiles ?? []) as Profile[];

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Platform Settings
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              User and workspace preferences
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This section is evolving into the settings area for account management,
              notification preferences, workspace configuration, and AI behavior controls.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Account preferences</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="font-medium">Email notifications</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Users will later control how often project updates and action reminders
                    are sent.
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="font-medium">Workspace role visibility</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Future versions will show project permissions and assigned roles.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">AI preferences</h2>
              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="font-medium">Assistant tone and guidance style</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Later, users may choose how concise or detailed the AI assistant should be.
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="font-medium">Summary priorities</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">
                    Future settings may let users prioritize risk, cost, progress, or actions
                    in AI-generated summaries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">User profiles (role groundwork)</h2>
            <div className="mt-6 space-y-4">
              {typedProfiles.length ? (
                typedProfiles.map((profile) => (
                  <div key={profile.id} className="rounded-xl bg-neutral-50 p-4">
                    <p className="font-medium text-neutral-900">
                      {profile.email || "No email"}
                    </p>
                    <p className="mt-2 text-sm text-neutral-600">
                      Role: {profile.role}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                  No user profiles synced yet.
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
