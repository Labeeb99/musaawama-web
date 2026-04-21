"use client";

import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";

type Lead = {
  id: number;
  name: string;
  stage: string;
  budget: string | null;
  timeline: string | null;
  summary: string;
  created_at: string;
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [convertLoading, setConvertLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadLead() {
      try {
        const res = await fetch(`/api/leads/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load lead.");
        }

        setLead(data.lead);
      } catch {
        router.replace("/app/leads");
      } finally {
        setLoading(false);
      }
    }

    loadLead();
  }, [id, router]);

  async function updateStatus(status: string) {
    setStatusLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/leads/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update lead.");
      }

      setLead((prev) => (prev ? { ...prev, stage: status } : prev));
      setMessage(data.message);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setStatusLoading(false);
    }
  }

  async function convertLead() {
    setConvertLoading(true);
    setMessage("");

    try {
      const res = await fetch(`/api/leads/${id}/convert`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to convert lead.");
      }

      setLead((prev) => (prev ? { ...prev, stage: "Converted" } : prev));
      setMessage(data.message);

      if (data.projectSlug) {
        setTimeout(() => {
          router.push(`/app/projects/${data.projectSlug}`);
        }, 1000);
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setConvertLoading(false);
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <section className="py-20">
          <Container>Loading lead...</Container>
        </section>
      </AuthGuard>
    );
  }

  if (!lead) {
    return null;
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Leads", href: "/app/leads" },
              { label: lead.name },
            ]}
          />
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Lead Detail
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {lead.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                {lead.stage}
              </span>
            </div>

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              {lead.summary}
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold">Lead information</h2>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Budget</p>
                  <p className="mt-2 font-medium text-neutral-900">
                    {lead.budget || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Timeline</p>
                  <p className="mt-2 font-medium text-neutral-900">
                    {lead.timeline || "Not set"}
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-50 p-4">
                  <p className="text-sm text-neutral-500">Received</p>
                  <p className="mt-2 font-medium text-neutral-900">
                    {new Date(lead.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Next workflow</h2>
              <div className="mt-6 space-y-3">
                <button
                  onClick={convertLead}
                  disabled={convertLoading}
                  className="w-full rounded-full bg-neutral-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {convertLoading ? "Converting..." : "Convert to project"}
                </button>

                <button
                  onClick={() => updateStatus("In Review")}
                  disabled={statusLoading || convertLoading}
                  className="w-full rounded-full border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 disabled:opacity-60"
                >
                  Mark in review
                </button>

                <button
                  onClick={() => updateStatus("Needs More Detail")}
                  disabled={statusLoading || convertLoading}
                  className="w-full rounded-full border border-neutral-300 px-4 py-3 text-sm font-medium text-neutral-700 disabled:opacity-60"
                >
                  Request more details
                </button>
              </div>

              {message && (
                <p className="mt-4 text-sm text-neutral-600">{message}</p>
              )}

              <div className="mt-6 rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                This lead can now be converted into a managed project workspace inside
                the platform.
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
