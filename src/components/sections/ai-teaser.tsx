import Link from "next/link";
import { Container } from "@/components/layout/container";

export function AITeaser() {
  return (
    <section className="py-20">
      <Container>
        <div className="rounded-3xl bg-neutral-900 px-8 py-12 text-white sm:px-12">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-400">
            AI Assistant
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            A construction assistant trained to answer questions before clients even pick up the phone
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-300">
            The Musaawama AI assistant is designed to answer questions about project stages,
            construction options, rough estimate ranges, systems thinking, and how we can support clients
            in the short and long term.
          </p>
          <Link
            href="/ai-assistant"
            className="mt-8 inline-block rounded-full bg-white px-5 py-3 text-sm font-medium text-neutral-900"
          >
            Learn about the AI assistant
          </Link>
        </div>
      </Container>
    </section>
  );
}
