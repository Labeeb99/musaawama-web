import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-4xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Construction Intelligence • Systems Thinking • AI-Guided Delivery
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Building a smarter way to manage construction projects, decisions, and delivery.
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
            Musaawama combines practical construction expertise, digital project visibility,
            and an AI assistant trained to help clients understand their options before, during,
            and beyond project delivery.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Discuss your project
            </Link>

            <Link
              href="/ai-assistant"
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-900"
            >
              Explore AI Assistant
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
