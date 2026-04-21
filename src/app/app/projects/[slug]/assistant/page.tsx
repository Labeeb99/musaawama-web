"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { Breadcrumbs } from "@/components/app/breadcrumbs";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const suggestedQuestions = [
  "What is the project status?",
  "What is the latest update?",
  "What client actions are pending?",
  "Are there any milestone risks?",
  "What should be reviewed next?",
];

export default function ProjectAssistantPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I’m the project-specific assistant. I can explain project status, latest updates, milestones, client actions, and likely delivery attention points for this workspace.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${slug}/assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendMessage(input);
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Projects", href: "/app/projects" },
              { label: slug, href: `/app/projects/${slug}` },
              { label: "Assistant" },
            ]}
          />

          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Assistant
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              AI workspace for {slug}
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This assistant uses the selected project context to answer questions about
              status, updates, milestones, actions, and delivery attention points.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold">Project chat</h2>

              <div className="mt-6 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={
                      message.role === "user"
                        ? "ml-auto max-w-xl rounded-2xl bg-neutral-100 p-4"
                        : "max-w-xl rounded-2xl bg-neutral-900 p-4 text-white"
                    }
                  >
                    <p
                      className={
                        message.role === "user"
                          ? "text-sm font-medium text-neutral-900"
                          : "text-sm font-medium"
                      }
                    >
                      {message.role === "user" ? "You" : "Project AI"}
                    </p>
                    <p
                      className={
                        message.role === "user"
                          ? "mt-2 text-sm leading-6 text-neutral-700"
                          : "mt-2 text-sm leading-6 text-neutral-300"
                      }
                    >
                      {message.content}
                    </p>
                  </div>
                ))}

                {loading && (
                  <div className="max-w-xl rounded-2xl bg-neutral-900 p-4 text-white">
                    <p className="text-sm font-medium">Project AI</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">
                      Thinking...
                    </p>
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 rounded-2xl border border-neutral-200 p-4"
              >
                <textarea
                  rows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the selected project..."
                  className="w-full resize-none rounded-xl border border-neutral-300 px-4 py-3"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold">Suggested questions</h2>
              <div className="mt-6 space-y-3">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    className="w-full rounded-xl bg-neutral-50 p-4 text-left text-sm leading-6 text-neutral-700 transition hover:bg-neutral-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
