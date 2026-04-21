import { AuthGuard } from "@/components/app/auth-guard";
import { Container } from "@/components/layout/container";

const knowledgeSections = [
  {
    title: "What Musaawama does",
    items: [
      "Provides project management, coordination, and construction consultancy support.",
      "Aims to combine practical construction delivery with digital systems and AI assistance.",
      "Supports clients during live projects and is evolving into a SaaS platform for other construction companies.",
    ],
  },
  {
    title: "Systems thinking approach",
    items: [
      "Looks at projects as interconnected systems rather than isolated tasks.",
      "Focuses on how design, procurement, sequencing, communication, cost, and site execution affect each other.",
      "Helps reduce fragmentation and improve project clarity, coordination, and delivery outcomes.",
    ],
  },
  {
    title: "AI assistant purpose",
    items: [
      "Answers common questions about services, project delivery, and platform features.",
      "Provides rough construction guidance and cost-direction suggestions with assumptions.",
      "Helps clients understand risks, pending actions, and current project status.",
    ],
  },
  {
    title: "Client portal purpose",
    items: [
      "Allows clients to log in and view project updates, documents, risks, and next actions.",
      "Will eventually support AI-assisted navigation across live project information.",
      "Will later expand into a SaaS model for other construction teams and companies.",
    ],
  },
  {
    title: "Cost guidance limits",
    items: [
      "The assistant should give rough ranges and assumptions, not final contract pricing.",
      "Final estimates should depend on scope, location, materials, procurement route, programme, and project risk.",
      "Detailed cost planning and commercial advice must still be validated properly.",
    ],
  },
];

export default function KnowledgePage() {
  return (
   <AuthGuard>
    <section className="py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            AI Knowledge Base
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Construction intelligence source material
          </h1>
          <p className="mt-4 text-lg leading-8 text-neutral-600">
            This page acts as the first structured knowledge layer for the Musaawama AI
            assistant. It defines what the platform does, how it should think, and what
            it should communicate to clients.
          </p>
        </div>

        <div className="mt-10 space-y-6">
          {knowledgeSections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <ul className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
   </AuthGuard>
  );
}
