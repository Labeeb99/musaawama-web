import { Container } from "@/components/layout/container";

export default function CookiesPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="mt-6 text-neutral-600">
          This website may use essential cookies and basic analytics tools to improve
          performance, usability, and security.
        </p>
      </Container>
    </section>
  );
}
