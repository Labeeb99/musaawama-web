import { Container } from "@/components/layout/container";

const problems = [
  "Project information is often fragmented across emails, calls, drawings, and verbal updates.",
  "Clients and teams struggle to understand what is happening on site and what decisions matter most.",
  "Construction advice is often difficult to access early, which leads to delays, confusion, and reactive planning.",
];

export function ProblemSection() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            The Problem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Construction projects break down when visibility, coordination, and decision-making are disconnected.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <div key={problem} className="rounded-2xl border border-neutral-200 p-6">
              <p className="text-sm leading-6 text-neutral-600">{problem}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
