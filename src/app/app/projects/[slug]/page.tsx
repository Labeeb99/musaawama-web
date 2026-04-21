import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { createServerClient } from "@/lib/supabase-server";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type Project = {
  slug: string;
  title: string;
  status: string;
  phase: string;
  overview: string | null;
  source: string | null;
  source_lead_id: number | null;
};

type ProjectUpdate = {
  id: number;
  title: string;
  description: string;
};

type ProjectDocument = {
  id: number;
  file_name: string;
  file_type: string | null;
  created_at: string;
};

export default async function AppProjectDetailPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const [
    { data: project, error: projectError },
    { data: updates, error: updatesError },
    { data: documents, error: documentsError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("slug, title, status, phase, overview, source, source_lead_id")
      .eq("slug", slug)
      .single(),
    supabase
      .from("project_updates")
      .select("id, title, description")
      .eq("project_slug", slug)
      .order("created_at", { ascending: false }),
    supabase
      .from("documents")
      .select("id, file_name, file_type, created_at")
      .eq("project_slug", slug)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  if (projectError || !project) {
    notFound();
  }

  if (updatesError) {
    throw new Error(updatesError.message);
  }

  if (documentsError) {
    throw new Error(documentsError.message);
  }

  const typedProject = project as Project;
  const typedUpdates = (updates ?? []) as ProjectUpdate[];
  const typedDocuments = (documents ?? []) as ProjectDocument[];

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Projects", href: "/app/projects" },
              { label: typedProject.title },
            ]}
          />

          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Workspace
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {typedProject.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                {typedProject.status}
              </span>

              <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                {typedProject.phase}
              </span>
            </div>

            {(typedProject.source || typedProject.source_lead_id) && (
              <div className="mt-4 flex flex-wrap gap-3">
                {typedProject.source && (
                  <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                    Source: {typedProject.source}
                  </span>
                )}

                {typedProject.source_lead_id && (
                  <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                    Lead ID: {typedProject.source_lead_id}
                  </span>
                )}
              </div>
            )}

            <p className="mt-6 text-lg leading-8 text-neutral-600">
              {typedProject.overview || "No overview available yet."}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/app/projects/${typedProject.slug}/health`}
                className="inline-block rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                View project health
              </Link>

              <Link
                href={`/app/projects/${typedProject.slug}/documents`}
                className="inline-block rounded-full border border-neutral-900 px-4 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-900 hover:text-white"
              >
                View project documents
              </Link>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 p-6 lg:col-span-2">
              <h2 className="text-xl font-semibold">Recent updates</h2>

              <div className="mt-6 space-y-4">
                {typedUpdates.length ? (
                  typedUpdates.map((update) => (
                    <div key={update.id} className="rounded-xl bg-neutral-50 p-4">
                      <h3 className="font-medium">{update.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-neutral-700">
                        {update.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No project updates available yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold">Recent documents</h2>

              <div className="mt-6 space-y-4">
                {typedDocuments.length ? (
                  typedDocuments.map((document) => (
                    <div key={document.id} className="rounded-xl bg-neutral-50 p-4">
                      <h3 className="font-medium">{document.file_name}</h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        Type: {document.file_type || "Unknown"}
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Uploaded: {new Date(document.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
                    No project documents available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
