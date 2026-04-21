"use client";

import { createBrowserClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";

const suggestedQuestions = [
  "What does Musaawama do differently from a normal construction consultancy?",
  "How does your systems thinking approach improve project delivery?",
  "Can you give rough cost-direction guidance for a refurbishment project?",
  "What will clients be able to see inside the project portal?",
  "How can the AI assistant help me during a live construction project?",
];

const capabilities = [
  "Explain Musaawama’s services and systems thinking approach",
  "Provide rough construction cost-direction guidance with assumptions",
  "Describe how the client portal and project workspace will function",
  "Help users understand project delivery risks and coordination issues",
];

const limitations = [
  "Not a replacement for formal cost plans or contract advice",
  "Cannot guarantee exact pricing or project outcomes",
  "Should guide users toward proper engagement for detailed project support",
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type StoredMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export default function AssistantPage() {
  const [userId, setUserId] = useState<string | null>(null); 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);


  useEffect(() => {
    const supabase = createBrowserClient();

    async function loadUserAndHistory() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const currentUserId = user?.id ?? null;
        setUserId(currentUserId);

        const historyUrl = currentUserId
          ? `/api/assistant/history?userId=${currentUserId}`
          : "/api/assistant/history";

        const res = await fetch(historyUrl);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load history.");
        }

        const historyMessages =
          (data.messages as StoredMessage[] | undefined)?.map((message) => ({
            role: message.role,
            content: message.content,
          })) ?? [];

        if (historyMessages.length > 0) {
          setMessages(historyMessages);
        } else {
          setMessages([
            {
              role: "assistant",
              content:
                "Hello. I’m the Musaawama Construction Intelligence Assistant. I can help explain Musaawama’s services, systems thinking approach, project platform vision, rough cost-direction guidance, and how clients may use the portal during live delivery.",
            },
          ]);
        }
      } catch {
        setMessages([
          {
            role: "assistant",
            content:
              "Hello. I’m the Musaawama Construction Intelligence Assistant. I can help explain Musaawama’s services, systems thinking approach, project platform vision, rough cost-direction guidance, and how clients may use the portal during live delivery.",
          },
        ]);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadUserAndHistory();
  }, []);    

  async function sendMessage(messageText: string) {
    const trimmed = messageText.trim();

    if (!trimmed) return;

    const nextUserMessage: ChatMessage = {
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, nextUserMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, userId }),
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
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, something went wrong.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    await sendMessage(input);
  }

  async function handleSuggestedQuestion(question: string) {
    await sendMessage(question);
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              AI Assistant
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Musaawama Construction Intelligence Assistant
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This assistant is evolving into a trained construction AI that can answer
              project questions, explain delivery risks, guide clients, and support
              long-term decision-making using a systems thinking approach.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold">Chat</h2>

              <div className="mt-6 space-y-4">
                {historyLoading && (
                  <div className="max-w-xl rounded-2xl bg-neutral-900 p-4 text-white">
                    <p className="text-sm font-medium">Musaawama AI</p>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">
                      Loading previous conversation...
                    </p>
                  </div>
                )}

                {!historyLoading &&
                  messages.map((message, index) => (
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
                        {message.role === "user" ? "You" : "Musaawama AI"}
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
                    <p className="text-sm font-medium">Musaawama AI</p>
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
                  placeholder="Ask about project delivery, cost guidance, systems thinking, or platform features..."
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
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full rounded-xl bg-neutral-50 p-4 text-left text-sm leading-6 text-neutral-700 transition hover:bg-neutral-100"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">What the assistant can do</h2>
              <div className="mt-6 space-y-3">
                {capabilities.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Important limits</h2>
              <div className="mt-6 space-y-3">
                {limitations.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
