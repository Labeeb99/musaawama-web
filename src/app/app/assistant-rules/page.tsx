import { AuthGuard } from "@/components/app/auth-guard";

const rules = [
  "The assistant should support understanding before action, not create confusion.",
  "The assistant should explain assumptions clearly when discussing estimates or delivery guidance.",
  "The assistant should identify pending actions, milestones, and risks in a structured way.",
  "The assistant should guide users toward proper project engagement for detailed support.",
  "The assistant should reflect systems thinking by showing how issues connect across delivery.",
];

export default function AssistantRulesPage() {
  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            AI Rules
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Assistant behavior principles
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            These rules represent the intended behavior direction for the Musaawama
            assistant so it remains practical, structured, and useful within
            construction delivery workflows.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {rules.map((rule, index) => (
            <div
              key={index}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Rule {index + 1}
              </p>
              <p className="mt-4 text-base leading-8 text-neutral-700">{rule}</p>
            </div>
          ))}
        </div>
      </div>
    </AuthGuard>
  );
}
