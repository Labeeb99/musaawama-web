import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Construction • Systems Thinking • Digital Delivery
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Building better project delivery with structure, clarity, and code.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Musaawama helps bridge practical construction delivery with modern digital
            systems, creating a stronger foundation for projects, operations, and future products.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Start a conversation
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-900"
            >
              View services
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
