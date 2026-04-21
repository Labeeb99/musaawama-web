import { Container } from "@/components/layout/container";

const problems = [
  "Project information is often fragmented across emails, calls, drawings, and verbal updates.",
  "Clients and teams struggle to understand what is happening on site and what decisions matter most.",
  "Construction advice is often difficult to access early, which leads to delays, confusion, and reactive planning.",
];

export function ProblemSection() {
  return (
    <section className="bg-neutral-50 py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            The Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Construction projects break down when visibility, coordination, and decision-making are disconnected.
          </h2>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Most project problems are not caused by a single issue. They emerge from fragmented systems,
            delayed decisions, unclear ownership, and weak visibility across the whole project environment.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div
              key={problem}
              className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
            >
              <p className="text-sm leading-7 text-neutral-600">{problem}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
