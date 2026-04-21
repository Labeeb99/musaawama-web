import Link from "next/link";
import { Container } from "@/components/layout/container";

export function SolutionsSplit() {
  return (
    <section className="py-24">
      <Container>
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Two Layers of Support
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Musaawama brings together real project support and a future-facing digital platform.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Services
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              Practical construction and project delivery support
            </h3>
            <p className="mt-4 text-sm leading-7 text-neutral-600">
              We help clients and teams manage complexity across planning, coordination,
              project delivery, and operational decision-making.
            </p>
            <Link
              href="/solutions"
              className="mt-6 inline-block text-sm font-medium text-neutral-900"
            >
              View solutions →
            </Link>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-neutral-900 p-8 text-white shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
              Platform
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              A digital layer for visibility, guidance, and future SaaS delivery
            </h3>
            <p className="mt-4 text-sm leading-7 text-neutral-300">
              Our platform vision is to give clients and teams a clearer way to track projects,
              understand progress, and use AI to navigate delivery with greater confidence.
            </p>
            <Link
              href="/platform"
              className="mt-6 inline-block text-sm font-medium text-white"
            >
              Explore platform →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
