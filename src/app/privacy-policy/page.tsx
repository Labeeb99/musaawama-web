import { Container } from "@/components/layout/container";

export default function PrivacyPolicyPage() {
  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-6 text-neutral-600">
          We collect contact information submitted through this website only for responding
          to enquiries, project discussions, and relevant business communication.
        </p>
        <p className="mt-4 text-neutral-600">
          We do not sell personal data. Information submitted is stored securely and used
          only for legitimate business purposes.
        </p>
      </Container>
    </section>
  );
}
