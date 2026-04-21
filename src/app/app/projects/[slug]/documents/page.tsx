import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { AuthGuard } from "@/components/app/auth-guard";
import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { createServerClient } from "@/lib/supabase-server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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
};

export default async function ProjectDocumentsPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("slug, title")
    .eq("slug", slug)
    .single();

  if (projectError || !project) {
    notFound();
  }

  const { data: documents, error: documentsError } = await supabase
    .from("documents")
    .select("id, file_name, file_type, file_path, created_at")
    .eq("project_slug", slug)
    .order("created_at", { ascending: false });

  if (documentsError) {
    throw new Error(documentsError.message);
  }

  const typedProject = project as Project;
  const typedDocuments = (documents ?? []) as ProjectDocument[];

  return (
    <AuthGuard>
      <section className="py-20">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Projects", href: "/app/projects" },
              { label: typedProject.title, href: `/app/projects/${typedProject.slug}` },
              { label: "Documents" },
            ]}
          />

          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Documents
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              {typedProject.title}
            </h1>
            <p className="mt-4 text-lg leading-8 text-neutral-600">
              This page shows the uploaded documents associated with this specific project
              workspace.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {typedDocuments.length ? (
              typedDocuments.map((document) => (
                <div
                  key={document.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-6"
                >
                  <h2 className="text-xl font-semibold">{document.file_name}</h2>
                  <p className="mt-3 text-sm text-neutral-600">
                    Type: {document.file_type || "Unknown"}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    Uploaded: {new Date(document.created_at).toLocaleString()}
                  </p>
                  <p className="mt-3 text-sm text-neutral-500 break-all">
                    Path: {document.file_path}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
                No documents available for this project yet.
              </div>
            )}
          </div>
        </Container>
      </section>
    </AuthGuard>
  );
}
