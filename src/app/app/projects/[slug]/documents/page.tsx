"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/app/auth-guard";
import { Breadcrumbs } from "@/components/app/breadcrumbs";

type Project = {
  slug: string;
  title: string;
};

type ProjectDocument = {
  id: number;
  file_name: string;
  file_type: string | null;
  file_path: string;
  created_at: string;
  category: string | null;
  description: string | null;
  tags: string | null;
};

export default function ProjectDocumentsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [project, setProject] = useState<Project | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch(`/api/projects/${slug}/documents`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load project documents.");
        }

        setProject(data.project);
        setDocuments(data.documents ?? []);
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPage();
  }, [slug]);

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

  if (loading) {
    return (
      <AuthGuard>
        <div className="space-y-6">
          <p className="text-sm text-neutral-500">Loading project documents...</p>
        </div>
      </AuthGuard>
    );
  }

  if (!project) {
    return (
      <AuthGuard>
        <div className="space-y-6">
          <p className="text-sm text-red-600">Project not found.</p>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-10">
        <Breadcrumbs
          items={[
            { label: "Platform", href: "/app" },
            { label: "Projects", href: "/app/projects" },
            { label: project.title, href: `/app/projects/${project.slug}` },
            { label: "Documents" },
          ]}
        />

        <div className="max-w-4xl">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
            Project Documents
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
            {project.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-8 text-neutral-600">
            Review uploaded files associated with this project workspace and open them
            securely using signed access links.
          </p>
        </div>

        {message && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {message}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-2">
          {documents.length ? (
            documents.map((document) => (
              <div
                key={document.id}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  {document.category && (
                    <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                      {document.category}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 text-2xl font-semibold text-neutral-900">
                  {document.file_name}
                </h2>

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

                <div className="mt-6 flex flex-wrap gap-3">
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
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              No documents available for this project yet.
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
