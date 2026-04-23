import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/app/auth-guard";
import { Breadcrumbs } from "@/components/app/breadcrumbs";
import { Container } from "@/components/layout/container";
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
  created_at: string;
};

type ProjectDocument = {
  id: number;
  file_name: string;
  file_type: string | null;
  created_at: string;
};

type ProjectMember = {
  id: number;
  user_id: string;
  role: string;
  created_at: string;
};

export default async function AppProjectDetailPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createServerClient();  
      
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    notFound();
  }

  const { data: membership, error: membershipError } = await supabase
    .from("project_members")
    .select("id, role")
    .eq("project_slug", slug)
    .eq("user_id", user.id)
    .maybeSingle();
  
  if (membershipError || !membership) {
    notFound();
  }


      const [
    { data: project, error: projectError },
    { data: updates, error: updatesError },
    { data: documents, error: documentsError },
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("slug, title, status, phase, overview, source, source_lead_id")
      .eq("slug", slug)
      .single(),
    supabase
      .from("project_updates")
      .select("id, title, description, created_at")
      .eq("project_slug", slug)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("documents")
      .select("id, file_name, file_type, created_at")
      .eq("project_slug", slug)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("project_members")
      .select("id, user_id, role, created_at")
      .eq("project_slug", slug)
      .order("created_at", { ascending: true }),
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
	
  if (membersError) {
    throw new Error(membersError.message);
  }

  const typedProject = project as Project;
  const typedUpdates = (updates ?? []) as ProjectUpdate[];
  const typedDocuments = (documents ?? []) as ProjectDocument[];
  const typedMembers = (members ?? []) as ProjectMember[];

  return (
    <AuthGuard>
      <div className="space-y-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Platform", href: "/app" },
              { label: "Projects", href: "/app/projects" },
              { label: typedProject.title },
            ]}
          />

          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Project Workspace
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-neutral-900">
              {typedProject.title}
            </h1>
              
                  
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
                {typedProject.status}
              </span>

              <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                {typedProject.phase}
              </span>

              {typedProject.source && (
                <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                  Source: {typedProject.source}
                </span>
              )}

              {typedProject.source_lead_id && (
                <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
                  Lead ID: {typedProject.source_lead_id}
                </span>
              )}
            </div>

            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
              {typedProject.overview || "No overview available yet."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/app/projects/${typedProject.slug}/health`}
                className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                View health
              </Link>

              <Link
                href={`/app/projects/${typedProject.slug}/documents`}
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
              >
                Documents
              </Link>

              <Link
                href={`/app/projects/${typedProject.slug}/assistant`}
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:border-neutral-900"
              >
                Project assistant
              </Link>
            </div>
          </div>
        </Container>

        <Container>
          
<div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
  <div>
    <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
      Timeline
    </p>
    <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
      Project activity and delivery narrative
    </h2>
  </div>

  <div className="mt-6 space-y-6">
    {typedUpdates.length ? (
      typedUpdates.map((update, index) => (
        <div key={update.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="h-3 w-3 rounded-full bg-neutral-900" />
            {index !== typedUpdates.length - 1 && (
              <div className="mt-2 h-full w-px bg-neutral-200" />
            )}
          </div>

          <div className="flex-1 rounded-2xl bg-neutral-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-medium text-neutral-900">
                {update.title}
              </h3>
              <span className="text-sm text-neutral-500">
                {new Date(update.created_at).toLocaleString()}
              </span>
            </div>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              {update.description}
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
        No project updates available yet.
      </div>
    )}
  </div>
</div>

<div className="grid gap-6 xl:grid-cols-3">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Updates
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                    Recent project activity
                  </h2>
                </div>

                <Link
                  href={`/app/projects/${typedProject.slug}/health`}
                  className="text-sm font-medium text-neutral-900 transition hover:text-neutral-600"
                >
                  View health
                </Link>
              </div>
            <div className="space-y-6">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Documents
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                    Recent uploads
                  </h2>
                </div>

                <div className="mt-6 space-y-4">
                  {typedDocuments.length ? (
                    typedDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="rounded-2xl bg-neutral-50 p-5"
                      >
                        <h3 className="text-base font-medium text-neutral-900">
                          {document.file_name}
                        </h3>
                        <p className="mt-2 text-sm text-neutral-600">
                          Type: {document.file_type || "Unknown"}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          Uploaded: {new Date(document.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                      No project documents available yet.
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Link
                    href={`/app/projects/${typedProject.slug}/documents`}
                    className="text-sm font-medium text-neutral-900 transition hover:text-neutral-600"
                  >
                    Open document workspace
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Members
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-neutral-900">
                    Project access roles
                  </h2>
                </div>
<div className="mt-4 flex flex-wrap gap-3">
  <span className="inline-flex rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
    {typedProject.status}
  </span>

  <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
    {typedProject.phase}
  </span>

  {typedProject.source === "lead" && (
    <span className="inline-flex rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700">
      Converted from lead
    </span>
  )}
</div>

                <div className="mt-6 space-y-4">
                  {typedMembers.length ? (
                    typedMembers.map((member) => (
                      <div
                        key={member.id}
                        className="rounded-2xl bg-neutral-50 p-5"
                      >
                        <p className="text-sm font-medium text-neutral-900">
                          {member.user_id}
                        </p>
                        <p className="mt-2 text-sm text-neutral-600">
                          Role: {member.role}
                        </p>
                        <p className="mt-1 text-sm text-neutral-500">
                          Added: {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-neutral-50 p-5 text-sm text-neutral-600">
                      No project members assigned yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

              <div className="mt-6">
                <Link
                  href={`/app/projects/${typedProject.slug}/documents`}
                  className="text-sm font-medium text-neutral-900 transition hover:text-neutral-600"
                >
                  Open document workspace
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </AuthGuard>
  );
}
