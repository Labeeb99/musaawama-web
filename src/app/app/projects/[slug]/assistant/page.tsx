"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/app/auth-guard";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestedPrompts = [
  "Summarise the current project status",
  "What are the key risks right now?",
  "What actions are pending from the client?",
  "Explain the current phase and next steps",
  "What milestones are coming up?",
];

export default function ProjectAssistantPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSend(messageText?: string) {
    const text = (messageText ?? input).trim();
    if (!text) return;

    const userMessage: Message = {
      role: "user",
      content: text,
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
        body: JSON.stringify({ message: text }),
      });

      const rawText = await res.text();
      let data: { reply?: string; error?: string } = {};

      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch {
        throw new Error("The assistant returned an invalid response.");
      }
 
            if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in to use this project assistant.");
        }

        if (res.status === 403) {
          throw new Error("You do not have access to this project's assistant.");
        }

        throw new Error(data.error || `Request failed with status ${res.status}.`);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply || "No response.",
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
              : "Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Project Assistant
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            AI support for project understanding and decisions
          </h1>

          <p className="mt-4 text-base leading-8 text-neutral-600">
            Ask questions about the project, request summaries, or explore risks,
            milestones, and actions. This assistant will evolve into a fully
            project-aware intelligence layer.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleSend(prompt)}
              className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              {prompt}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="max-h-[400px] space-y-4 overflow-y-auto">
            {messages.length ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.role === "user" ? "text-right" : "text-left"}
                >
                  <div
                    className={
                      msg.role === "user"
                        ? "inline-block rounded-2xl bg-neutral-900 px-4 py-3 text-sm text-white"
                        : "inline-block rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-900"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">
                No messages yet. Ask about project status, milestones, actions, or documents.
              </p>
            )}

            {loading && (
              <div className="text-left">
                <div className="inline-block rounded-2xl bg-neutral-100 px-4 py-3 text-sm text-neutral-900">
                  Reviewing project context...
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about status, risks, actions, milestones, or documents..."
              className="flex-1 rounded-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading}
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Working..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
