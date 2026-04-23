import { AuthGuard } from "@/components/app/auth-guard";

const knowledgeAreas = [
  {
    title: "Project delivery logic",
    description:
      "Understanding how updates, actions, milestones, and decisions affect delivery continuity.",
  },
  {
    title: "Systems thinking approach",
    description:
      "Treating construction as an interconnected system rather than isolated tasks and issues.",
  },
  {
    title: "Client visibility needs",
    description:
      "Helping clients understand what is happening, what is pending, and what matters next.",
  },
  {
    title: "Estimate direction logic",
    description:
      "Supporting rough cost-direction guidance using assumptions and structured thinking.",
  },
];

export default function KnowledgePage() {
  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Knowledge
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Knowledge foundation for the platform and assistant
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            This area represents the conceptual knowledge base behind the Musaawama
            platform, including delivery logic, systems thinking, project visibility,
            and AI-guided understanding.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {knowledgeAreas.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-neutral-900">
                {item.title}
              </h2>
              <p className="mt-4 text-base leading-8 text-neutral-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
