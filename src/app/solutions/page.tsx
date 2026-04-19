import { Container } from "@/components/layout/container";

const solutionAreas = [
  {
    title: "Project Delivery Support",
    description:
      "Structured support across coordination, planning, communication, and on-site execution to reduce confusion and improve delivery clarity.",
  },
  {
    title: "Construction Advisory",
    description:
      "Practical guidance for clients and teams who need help understanding project direction, risk, likely requirements, and strategic decisions.",
  },
  {
    title: "Systems Thinking Approach",
    description:
      "A way of working that treats the project as an interconnected system rather than isolated tasks, helping improve visibility and long-term decision-making.",
  },
];

export default function SolutionsPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Solutions
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Support for construction projects that need more clarity, structure, and intelligence
          </h1>
          <p className="mt-6 text-lg leading-8 text-neutral-600">
            Musaawama is designed to help clients and teams move through project complexity with
            stronger coordination, clearer decision-making, and a more connected delivery approach.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {solutionAreas.map((item) => (
            <div key={item.title} className="rounded-3xl border border-neutral-200 p-8">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            What this means in practice
          </h2>
          <p className="mt-4 text-neutral-600 leading-8">
            Some clients need hands-on project support. Others need better visibility, strategic
            guidance, or help understanding how to move through uncertainty. Musaawama sits between
            operational delivery and intelligent project support, with the long-term goal of turning
            that approach into a scalable platform.
          </p>
        </div>
      </Container>
    </section>
  );
}
