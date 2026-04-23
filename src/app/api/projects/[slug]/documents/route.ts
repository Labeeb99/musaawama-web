import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const supabase = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data: membership, error: membershipError } = await supabase
      .from("project_members")
      .select("id, role")
      .eq("project_slug", slug)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("slug, title")
      .eq("slug", slug)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const { data: documents, error: documentsError } = await supabase
      .from("documents")
      .select(
        "id, file_name, file_type, file_path, created_at, category, description, tags"
      )
      .eq("project_slug", slug)
      .order("created_at", { ascending: false });

    if (documentsError) {
      return NextResponse.json(
        { error: documentsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      project,
      documents: documents ?? [],
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
