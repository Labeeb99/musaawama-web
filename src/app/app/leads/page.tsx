import Link from "next/link";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createServerClient } from "@/lib/supabase-server";

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
  const supabase = createServerClient();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, name, stage, budget, timeline, summary, created_at")
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
              Lead Intake
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Qualified enquiry workspace
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This section now acts as the first internal bridge between public website
              enquiries and managed project opportunities.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {(leads as Lead[] | null)?.length ? (
              (leads as Lead[]).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/app/leads/${lead.id}`}
                  className="block rounded-2xl border border-neutral-200 bg-white p-6 transition hover:border-neutral-900"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{lead.name}</h2>
                      <p className="mt-2 text-sm text-neutral-500">
                        Budget: {lead.budget || "Not set"} • Timeline:{" "}
                        {lead.timeline || "Not set"}
                      </p>
                    </div>

                    <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                      {lead.stage}
                    </span>
                  </div>

                  {lead.created_at && (
                    <p className="mt-4 text-sm text-neutral-500">
                      Received: {new Date(lead.created_at).toLocaleString()}
                    </p>
                  )}

                  <div className="mt-4 rounded-xl bg-neutral-50 p-4">
                    <p className="text-sm leading-6 text-neutral-700">
                      {lead.summary}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
                    >
                      Convert to project
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
                    >
                      Mark in review
                    </button>
                  </div>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                No leads available yet.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
            <h2 className="text-xl font-semibold">AI lead qualification preview</h2>
            <div className="mt-6 space-y-3">
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “What is the client actually asking for?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “What budget and delivery assumptions are visible from this enquiry?”
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                “Should this be converted into a managed project opportunity?”
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
