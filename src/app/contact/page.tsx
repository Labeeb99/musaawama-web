"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setForm({
        name: "",
        email: "",
        phone: "",
        service: "",
        budget: "",
        message: "",
      });
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-20">
      <Container className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
        <p className="mt-4 text-lg text-neutral-600">
          Tell us about your project, your challenge, or the system you want to build.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="service" className="mb-2 block text-sm font-medium">
              Service
            </label>
            <input
              id="service"
              name="service"
              value={form.service}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="budget" className="mb-2 block text-sm font-medium">
              Budget
            </label>
            <input
              id="budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={handleChange}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send message"}
          </button>

          {status === "success" && (
            <p className="text-sm text-green-600">
              Your message has been sent successfully.
            </p>
          )}

          {status === "error" && (
            <p className="text-sm text-red-600">
              {errorMessage}
            </p>
          )}
        </form>
      </Container>
    </section>
  );
}
