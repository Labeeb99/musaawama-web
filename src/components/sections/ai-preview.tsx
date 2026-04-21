import Link from "next/link";
import { Container } from "@/components/layout/container";

export function AIPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Construction Intelligence
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              An AI assistant designed for construction delivery and systems thinking
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Musaawama is evolving beyond a service website into a project intelligence
              platform. Our AI assistant will help clients understand delivery risks,
              navigate project updates, ask practical construction questions, and explore
              how a systems thinking approach improves long-term outcomes.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-6">
              <h3 className="text-xl font-semibold">Client guidance</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Answer common questions about project stages, coordination, risks, and
                what decisions are needed from the client.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-6">
              <h3 className="text-xl font-semibold">Estimate direction</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Offer rough cost-direction guidance with assumptions, helping users
                understand scope before formal project engagement.
              </p>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-6">
              <h3 className="text-xl font-semibold">Platform navigation</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Support future clients and teams inside the portal by helping them find
                updates, documents, actions, and project intelligence quickly.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/app/assistant"
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Explore AI assistant
            </Link>

            <Link
              href="/contact"
              className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-900"
            >
              Discuss your project
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
