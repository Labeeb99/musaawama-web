import { Container } from "@/components/layout/container";

const assistantCapabilities = [
  "Answer questions about project stages and delivery options",
  "Give rough estimate guidance with assumptions and context",
  "Explain systems thinking in a practical construction setting",
  "Help users understand how Musaawama can support them over the long term",
  "Guide visitors toward the right next step before they contact the team",
];

const assistantBoundaries = [
  "It does not replace formal cost plans, contracts, or professional appointments.",
  "It should provide guidance, assumptions, and direction — not false precision.",
  "Complex decisions should still move into direct human support when needed.",
];

export default function AIAssistantPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            AI Assistant
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            An assistant trained to answer construction questions before clients ever need to book a call
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            The Musaawama AI assistant is being designed to help users understand projects, likely
            directions, delivery trade-offs, systems thinking concepts, and how our services and
            platform can support them over time.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-semibold">What it will help with</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-neutral-600">
              {assistantCapabilities.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-neutral-200 p-8">
            <h2 className="text-2xl font-semibold">What it will not pretend to be</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-neutral-600">
              {assistantBoundaries.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Why this matters
          </h2>
          <p className="mt-4 text-neutral-600 leading-8">
            Most clients do not know what to ask at the beginning of a project. A trained assistant
            can reduce confusion, surface better questions, and help people move toward clearer and
            more informed engagement before the project becomes reactive.
          </p>
        </div>
      </Container>
    </section>
  );
}
