import { Container } from "@/components/layout/container";

export default function TermsPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
        <p className="mt-6 text-neutral-600">
          The content on this website is provided for general information about services,
          projects, and business activity. Nothing on this site constitutes a binding offer
          unless confirmed separately in writing.
        </p>
      </Container>
    </section>
  );
}
