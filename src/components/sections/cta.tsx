import Link from "next/link";
import { Container } from "@/components/layout/container";

export function Cta() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-neutral-900 px-8 py-12 text-white sm:px-12">
          <h2 className="text-3xl font-bold tracking-tight">
            Looking to build something serious?
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300">
            Whether it is project delivery support, coordination, systems thinking,
            or the early shape of a digital product, let’s build with intent.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900"
          >
            Contact Musaawama
          </Link>
        </div>
      </Container>
    </section>
  );
}
