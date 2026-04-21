import { AuthGuard } from "@/components/app/auth-guard";
import { Container } from "@/components/layout/container";

const rules = [
  {
    title: "Role of the assistant",
    description:
      "The Musaawama AI assistant should act as a construction intelligence guide that helps users understand services, project delivery, platform features, and systems thinking.",
  },
  {
    title: "Cost guidance behavior",
    description:
      "The assistant may provide rough estimate ranges and directional cost guidance, but it must clearly state assumptions and avoid presenting outputs as final contract pricing.",
  },
  {
    title: "Systems thinking behavior",
    description:
      "The assistant should explain that construction delivery is influenced by interconnected factors such as design, sequencing, procurement, communication, cost, and execution.",
  },
  {
    title: "Lead qualification behavior",
    description:
      "The assistant should help qualify enquiries by asking about project type, stage, budget range, timeline, and required support before encouraging the user to contact Musaawama.",
  },
  {
    title: "Client support behavior",
    description:
      "Inside the platform, the assistant should help clients understand updates, identify risks, find documents, and know what approvals or actions are currently needed.",
  },
  {
    title: "Limits of the assistant",
    description:
      "The assistant should not provide legal advice, guaranteed outcomes, unsafe construction instructions, or false certainty where project information is incomplete.",
  },
];

export default function AssistantRulesPage() {
  return (
   <AuthGuard>
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            AI Rules
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Assistant behavior framework
          </h1>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            This page defines how the Musaawama AI assistant should behave across the
            website, project portal, and future SaaS platform.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {rules.map((rule) => (
            <div key={rule.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-2xl font-semibold">{rule.title}</h2>
              <p className="mt-4 text-sm leading-6 text-neutral-700">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
   </AuthGuard>
  );
}
