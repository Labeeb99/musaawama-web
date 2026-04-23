import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get("projectSlug");

    const supabase = await createServerClient();

    let query = supabase
      .from("documents")
      .select(
        "id, project_slug, file_name, file_type, file_path, created_at, category, description, tags"
      )
      .order("created_at", { ascending: false });

    if (projectSlug && projectSlug !== "all") {
      query = query.eq("project_slug", projectSlug);
    }

    const { data: documents, error: documentsError } = await query;

    if (documentsError) {
      return NextResponse.json(
        { error: documentsError.message },
        { status: 500 }
      );
    }

    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("slug, title")
      .order("title", { ascending: true });

    if (projectsError) {
      return NextResponse.json(
        { error: projectsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      documents: documents ?? [],
      projects: projects ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid request.",
      },
      { status: 400 }
    );
  }
}
