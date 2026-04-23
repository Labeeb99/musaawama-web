import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Cta() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-neutral-900 p-8 text-white shadow-sm sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
              Next Step
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start with clarity, then build better project control
            </h2>

            <p className="mt-6 text-base leading-8 text-neutral-300">
              Whether you need project support, delivery visibility, or a smarter way
              to understand decisions and risks, Musaawama is building the platform and
              expertise to support that journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900 transition hover:opacity-90"
              >
                Discuss your project
              </Link>

              <Link
                href="/app"
                className="rounded-full border border-neutral-600 px-5 py-3 text-sm font-medium text-white transition hover:border-white"
              >
                Explore platform
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
