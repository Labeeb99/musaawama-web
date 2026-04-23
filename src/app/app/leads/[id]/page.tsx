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
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Failed to load lead."
        );
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
          <Container>
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600 shadow-sm">
              Loading lead details...
            </div>
          </Container>
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

          <div className="mt-8 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Lead Detail
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
              {lead.name}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                {lead.stage}
              </span>

              {lead.budget && (
                <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                  Budget: {lead.budget}
                </span>
              )}

              {lead.timeline && (
                <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                  Timeline: {lead.timeline}
                </span>
              )}
            </div>

            <p className="mt-6 text-base leading-8 text-neutral-600">
              {lead.summary}
            </p>

            <p className="mt-4 text-sm text-neutral-500">
              Received: {new Date(lead.created_at).toLocaleString()}
            </p>

                        {message && (
              <div className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
                {message}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => updateStatus("Qualified")}
                disabled={statusLoading || convertLoading}
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900 disabled:opacity-50"
              >
                {statusLoading ? "Updating..." : "Mark Qualified"}
              </button>

              <button
                onClick={() => updateStatus("Reviewing")}
                disabled={statusLoading || convertLoading}
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900 disabled:opacity-50"
              >
                {statusLoading ? "Updating..." : "Mark Reviewing"}
              </button>

              <button
                onClick={convertLead}
                disabled={convertLoading || statusLoading || lead.stage === "Converted"}
                className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                
                {convertLoading
                  ? "Converting lead..."
                  : lead.stage === "Converted"
                  ? "Project already created"
                  : "Convert lead to project"}
              </button>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
