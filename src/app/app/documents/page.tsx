"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/app/auth-guard";

type Project = {
  slug: string;
  title: string;
};

type DocumentItem = {
  id: number;
  project_slug: string;
  file_name: string;
  file_type: string | null;
  file_path: string;
  created_at: string;
  category: string | null;
  description: string | null;
  tags: string | null;
};

export default function DocumentsPage() {
  const [projectSlug, setProjectSlug] = useState("aldershot-residential");
  const [filterProject, setFilterProject] = useState("all");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentsLoading, setDocumentsLoading] = useState(true);

  async function loadDocuments(selectedFilter = filterProject) {
    setDocumentsLoading(true);
    setMessage("");

    try {
      const query =
        selectedFilter && selectedFilter !== "all"
          ? `?projectSlug=${encodeURIComponent(selectedFilter)}`
          : "";

      const res = await fetch(`/api/documents${query}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load documents.");
      }

      setDocuments(data.documents ?? []);
      setProjects(data.projects ?? []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setDocumentsLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, [filterProject]);

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
    formData.append("category", category);
    formData.append("description", description);
    formData.append("tags", tags);

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
      setCategory("");
      setDescription("");
      setTags("");

      await loadDocuments();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function openDocument(id: number) {
    try {
      const res = await fetch(`/api/documents/${id}/signed-url`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to open document.");
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  return (
    <AuthGuard>
      <div className="space-y-10">
        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Documents
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            Upload and manage project documents
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Add files into the workspace, enrich them with metadata, review uploaded
            documents across projects, and open them securely using signed access links.
          </p>
        </div>

         {message && (
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-700">
            {message}
          </div>
        )}  
        
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Upload
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                Add a document to a project
              </h2>
            </div>

            <form onSubmit={handleUpload} className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Project
                </label>
                <select
                  value={projectSlug}
                  onChange={(e) => setProjectSlug(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                >
                  {projects.length ? (
                    projects.map((project) => (
                      <option key={project.slug} value={project.slug}>
                        {project.title}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="aldershot-residential">
                        Aldershot Residential Development
                      </option>
                      <option value="romford-cut-and-carve">
                        Romford Cut and Carve Project
                      </option>
                      <option value="barking-mixed-use">
                        Barking Mixed-Use Scheme
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Category
                </label>
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Drawing, Programme, Contract, Site Photo"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Add a short description of what this document is for..."
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Tags
                </label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. fit-out, drawing, tender"
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Choose file
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              >
                 {loading ? "Uploading document..." : "Upload document"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Filter
              </p>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-neutral-700">
                  Project view
                </label>
                <select
                  value={filterProject}
                  onChange={(e) => setFilterProject(e.target.value)}
                  className="w-full rounded-2xl border border-neutral-300 px-4 py-3 text-sm focus:outline-none"
                >
                  <option value="all">All projects</option>
                  {projects.map((project) => (
                    <option key={project.slug} value={project.slug}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                Metadata
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                  Category improves document grouping
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                  Description adds delivery context
                </div>
                <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                  Tags prepare the AI retrieval layer
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Library
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
              Uploaded documents
            </h2>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {documentsLoading ? (
              <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                Loading document library...
              </div>
            ) : documents.length ? (
              documents.map((document) => (
                <div
                  key={document.id}
                  className="rounded-2xl bg-neutral-50 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                      {document.project_slug}
                    </span>

                    {document.category && (
                      <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-700">
                        {document.category}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-neutral-900">
                    {document.file_name}
                  </h3>

                  <p className="mt-3 text-sm text-neutral-600">
                    Type: {document.file_type || "Unknown"}
                  </p>

                  {document.description && (
                    <p className="mt-3 text-sm leading-7 text-neutral-700">
                      {document.description}
                    </p>
                  )}

                  {document.tags && (
                    <p className="mt-3 text-sm text-neutral-500">
                      Tags: {document.tags}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-neutral-500">
                    Uploaded: {new Date(document.created_at).toLocaleString()}
                  </p>

                  <p className="mt-4 break-all text-xs text-neutral-400">
                    {document.file_path}
                  </p>

                  <div className="mt-6">
                    <button
                      onClick={() => openDocument(document.id)}
                      className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      View document
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                   No documents match this view yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
