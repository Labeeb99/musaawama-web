import { Container } from "@/components/layout/container";

const platformFeatures = [
  "Project visibility for clients during live delivery",
  "Structured updates, milestones, and progress tracking",
  "A future-ready portal for documents, decisions, and communication",
  "A foundation for SaaS use by other construction teams and companies",
];

export default function PlatformPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Platform
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            A digital construction platform designed for visibility, navigation, and better project understanding
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            The Musaawama platform is being designed to help clients and teams understand what is
            happening across project delivery without being lost in fragmented updates, disconnected
            systems, and unclear next steps.
          </p>
        </div>

        <div className="mt-12 grid gap-4">
          {platformFeatures.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl border border-neutral-200 px-6 py-5 text-sm text-neutral-700"
            >
              {feature}
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-semibold">Client Portal Vision</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              During project delivery, clients should be able to log in and see updates, understand
              what is happening on site, follow milestones, and ask better questions without chasing
              information across multiple channels.
            </p>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-semibold">Future SaaS Direction</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              Over time, Musaawama aims to offer this as a broader platform for other companies,
              combining project structure, systems thinking, and AI assistance in a way that makes
              construction workflows easier to navigate.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
