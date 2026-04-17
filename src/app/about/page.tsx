import { Container } from "@/components/layout/container";

export default function AboutPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          About
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          A practical foundation with a long-term vision
        </h1>
        <p className="mt-6 text-lg leading-8 text-neutral-600">
          Musaawama sits at the intersection of construction delivery, operational clarity,
          and future digital systems. The goal is not just to complete projects, but to
          build better ways of working.
        </p>
      </Container>
    </section>
  );
}
