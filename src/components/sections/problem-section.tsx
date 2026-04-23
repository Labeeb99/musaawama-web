import { Container } from "@/components/layout/container";

const problemPoints = [
  {
    title: "Fragmented information",
    description:
      "Project knowledge is often spread across calls, emails, documents, and site conversations, making it hard to maintain clarity.",
  },
  {
    title: "Delayed decisions",
    description:
      "Approvals and client actions can slow delivery when there is no clear visibility into what is pending and why it matters.",
  },
  {
    title: "Reactive project control",
    description:
      "Teams often respond to issues after they appear instead of using structured visibility and better systems to identify risks earlier.",
  },
];

export function ProblemSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Why Musaawama
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Construction projects become harder when visibility, decisions, and delivery are disconnected
          </h2>

          <p className="mt-6 text-base leading-8 text-neutral-600">
            Musaawama is being built to address that gap. By combining practical delivery
            experience, systems thinking, and AI-assisted workflows, the platform aims to
            make project information easier to understand and act on.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {problemPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-lg font-medium">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
