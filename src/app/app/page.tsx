import { Container } from "@/components/layout/container";

export default function AppHomePage() {
  return (
    <section className="py-20">
      <Container className="max-w-4xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Client Platform
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Musaawama Project Intelligence Platform
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600">
          This will become the application layer for project tracking, client updates,
          AI assistance, and long-term SaaS delivery for construction teams.
        </p>
      </Container>
    </section>
  );
}
