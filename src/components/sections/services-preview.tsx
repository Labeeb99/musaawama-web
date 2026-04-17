import Link from "next/link";
import { Container } from "@/components/layout/container";
import { services } from "@/data/services";

export function ServicesPreview() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Services
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            Practical expertise for construction and project delivery
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.slug} className="rounded-2xl border border-neutral-200 p-6">
              <h3 className="text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {service.description}
              </p>
              <Link
                href="/services"
                className="mt-6 inline-block text-sm font-medium text-neutral-900"
              >
                Learn more →
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
