import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Cta() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-neutral-900 px-8 py-12 text-white sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Start with clarity. Build with intelligence.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300">
            Whether you need delivery support, strategic guidance, or a smarter way to understand your project,
            Musaawama is being built to help clients move with more confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900"
            >
              Contact Musaawama
            </Link>
            <Link
              href="/ai-assistant"
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white"
            >
              Explore AI Assistant
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
