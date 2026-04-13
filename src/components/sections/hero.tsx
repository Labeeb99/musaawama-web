// src/components/sections/hero.tsx
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-neutral-500">
            Construction • Systems Thinking • Digital Delivery
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Building better project delivery with structure, clarity, and code.
          </h1>
          <p className="mt-6 text-lg text-neutral-600">
            A modern construction and digital platform focused on project coordination,
            operational clarity, and future-ready systems.
          </p>
        </div>
      </Container>
    </section>
  );
}
