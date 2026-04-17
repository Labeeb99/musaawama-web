import { Container } from "@/components/layout/container";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-4xl font-bold tracking-tight">Services</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <div key={service.slug} className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold">{service.title}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
