import Link from "next/link";
import { Container } from "@/components/layout/container";

export function PlatformTeaser() {
  return (
    <section className="py-24">
      <Container>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-10 sm:p-12">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Visibility
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Clients should not have to chase clarity during live projects
            </h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              During project delivery, clients should be able to understand what is happening,
              what is delayed, what decisions are needed, and how progress is evolving — all from a structured portal.
            </p>

            <div className="mt-8">
              <Link
                href="/platform"
                className="rounded-full border border-neutral-900 px-5 py-3 text-sm font-medium text-neutral-900"
              >
                See platform vision
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
