import { Container } from "@/components/layout/container";

const items = [
  "Project Delivery",
  "Systems Thinking",
  "Digital Visibility",
  "AI-Guided Support",
];

export function TrustStrip() {
  return (
    <section className="border-y border-neutral-200 py-6">
      <Container>
        <div className="grid gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <div
              key={item}
              className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500"
            >
              {item}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
