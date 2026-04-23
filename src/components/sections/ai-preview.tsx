import Link from "next/link";
import { Container } from "@/components/layout/container";

const aiCapabilities = [
  {
    title: "Client guidance",
    description:
      "Help clients understand project stages, delivery risks, pending decisions, and what needs attention next.",
  },
  {
    title: "Estimate direction",
    description:
      "Provide rough cost-direction guidance with assumptions, helping users think more clearly before formal project engagement.",
  },
  {
    title: "Workspace navigation",
    description:
      "Support future users across updates, milestones, actions, and documents with clearer AI-assisted project visibility.",
  },
];

export function AIPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Construction Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              An AI assistant designed for construction delivery and structured decision-making
            </h2>

            <p className="mt-6 text-base leading-8 text-neutral-600">
              Musaawama is evolving beyond a service website into a project intelligence
              platform. The AI assistant is being developed to help clients and teams
              understand project information, navigate delivery workflows, and identify
              where attention is needed most.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {aiCapabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-neutral-50 p-6"
              >
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/app/assistant"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Explore AI assistant
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
            >
              Discuss your project
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
