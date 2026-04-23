"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { createBrowserClientSingleton } from "@/lib/supabase-browser";

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClientSingleton();

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

      const rawText = await res.text();
      let data: { reply?: string; error?: string } = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error("The assistant returned an invalid response.");
      }

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}.`);
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

  return (
    <AuthGuard>
      <section className="space-y-10">
        <Container>
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              AI Assistant
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
              Musaawama Construction Intelligence Assistant
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
              Ask questions about services, project delivery, systems thinking,
              rough cost-direction guidance, and how the platform can support
              clients through live construction work.
            </p>
          </div>
        </Container>

        <Container>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Conversation
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                  Workspace chat
                </h2>
              </div>

              <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto">
                {historyLoading && (
                  <div className="rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600">
                    Loading previous conversation...
                  </div>
                )}

                {!historyLoading &&
                  messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={message.role === "user" ? "text-right" : "text-left"}
                    >
                      <div
                        className={
                          message.role === "user"
                            ? "inline-block rounded-2xl bg-neutral-900 px-4 py-3 text-sm text-white"
                            : "inline-block rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-900"
                        }
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                {loading && (
                  <div className="rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600">
                    Thinking...
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Musaawama, delivery, costs, AI, or project support..."
                  className="flex-1 rounded-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "..." : "Send"}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Suggested prompts
                </p>
                <div className="mt-4 space-y-3">
                  {suggestedQuestions.map((question) => (
                    <button
                      key={question}
                      onClick={() => setInput(question)}
                      className="w-full rounded-2xl bg-neutral-50 p-4 text-left text-sm text-neutral-700 transition hover:bg-neutral-100"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Capabilities
                </p>
                <div className="mt-4 space-y-3">
                  {capabilities.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Important limits
                </p>
                <div className="mt-4 space-y-3">
                  {limitations.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
