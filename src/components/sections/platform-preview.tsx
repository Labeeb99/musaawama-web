import Link from "next/link";
import { Container } from "@/components/layout/container";

export function PlatformPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-sm sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
              Client Portal
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              A project workspace built for live delivery visibility
            </h2>

            <p className="mt-6 text-base leading-8 text-neutral-300">
              Clients can log in to view project updates, milestones, pending actions,
              uploaded documents, and AI-assisted summaries that explain what is happening
              across the project.
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

          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Platform Capabilities
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Built to support Musaawama projects first, then expand into SaaS
            </h2>

            <p className="mt-6 text-base leading-8 text-neutral-600">
              The long-term goal is to build a construction intelligence platform that
              combines project visibility, systems thinking, and AI guidance for delivery
              teams and clients.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                Project updates, milestones, and client actions in one place
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                AI-guided summaries across delivery, approvals, and risk areas
              </div>

              <div className="rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                A foundation for future multi-company construction SaaS workflows
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
