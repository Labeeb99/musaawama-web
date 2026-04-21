import Link from "next/link";
import { Container } from "@/components/layout/container";

export function PlatformPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-neutral-900 p-8 text-white sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
              Client Portal
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A project workspace for live delivery visibility
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-300">
              Clients will be able to log in and see project updates, risks, pending
              approvals, documents, delivery summaries, and AI-assisted explanations of
              what is happening on site.
            </p>

            <div className="mt-8">
              <Link
                href="/app/dashboard"
                className="inline-block rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:opacity-90"
              >
                View platform preview
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              SaaS Direction
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built to support Musaawama projects first, then expand to other teams
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600">
              The long-term goal is to turn the platform into a construction SaaS product
              for other companies, combining project visibility, systems thinking, and a
              trained AI assistant that helps users navigate complexity more easily.
            </p>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                Project tracking and live updates
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                AI-guided navigation and summaries
              </div>
              <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                Long-term multi-company SaaS potential
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
