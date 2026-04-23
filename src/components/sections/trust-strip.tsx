import { Container } from "@/components/layout/container";

const trustItems = [
  "Project visibility",
  "Structured delivery",
  "AI guidance",
  "Systems thinking",
];

export function TrustStrip() {
  return (
    <section className="py-8">
      <Container>
        <div className="rounded-2xl border border-neutral-200 bg-white px-6 py-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-neutral-600">
            {trustItems.map((item, index) => (
              <div key={item} className="flex items-center gap-4">
                <span>{item}</span>
                {index < trustItems.length - 1 && (
                  <span className="text-neutral-300">•</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
