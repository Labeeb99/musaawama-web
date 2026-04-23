import Link from "next/link";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";

type Lead = {
  id: number;
  name: string;
  stage: string;
  budget: string | null;
  timeline: string | null;
  summary: string;
  created_at?: string;
};

export default async function LeadsPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    notFound();
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  const allowedRoles = ["admin", "project_manager"];

  if (!allowedRoles.includes(profile.role)) {
    notFound();
  }

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, stage, budget, timeline, summary, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const typedLeads = (leads ?? []) as Lead[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Leads
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Qualified enquiries and intake workflow
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Review incoming enquiries, understand delivery context, update lead status,
            and convert strong opportunities into project workspaces.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {typedLeads.length ? (
            typedLeads.map((lead) => (
              <div
                key={lead.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                    {lead.stage}
                  </span>
                </div>

                <h2 className="mt-5 text-2xl font-semibold text-neutral-900">
                  {lead.name}
                </h2>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
                  <span>Budget: {lead.budget || "Not set"}</span>
                  <span>Timeline: {lead.timeline || "Not set"}</span>
                </div>

                {lead.created_at && (
                  <p className="mt-3 text-sm text-neutral-500">
                    Received: {new Date(lead.created_at).toLocaleString()}
                  </p>
                )}

                <div className="mt-5 rounded-2xl bg-neutral-50 p-5">
                  <p className="text-sm leading-7 text-neutral-700">
                    {lead.summary}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={`/app/leads/${lead.id}`}
                    className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Open lead
                  </Link>

                  <Link
                    href={`/app/leads/${lead.id}`}
                    className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
                  >
                    Review workflow
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              No leads available yet.
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
