"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";

export default function DocumentsPage() {
  const [projectSlug, setProjectSlug] = useState("aldershot-residential");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setMessage("Please choose a file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectSlug", projectSlug);

    try {
      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed.");
      }

      setMessage(data.message);
      setFile(null);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Documents
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Document workspace
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              Upload and organize project files. This will evolve into the document layer
              of the platform with AI-assisted navigation.
            </p>
          </div>

          <form
            onSubmit={handleUpload}
            className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">Project</label>
              <select
                value={projectSlug}
                onChange={(e) => setProjectSlug(e.target.value)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              >
                <option value="aldershot-residential">Aldershot Residential Development</option>
                <option value="romford-cut-and-carve">Romford Cut and Carve Project</option>
                <option value="barking-mixed-use">Barking Mixed-Use Scheme</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Choose file</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-neutral-300 px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {loading ? "Uploading..." : "Upload document"}
            </button>

            {message && (
              <p className="text-sm text-neutral-600">{message}</p>
            )}
          </form>
        </Container>
      </section>
    </AuthGuard>
  );
}
