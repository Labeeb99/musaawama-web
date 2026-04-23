import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectSlug = searchParams.get("projectSlug");
    const userId = searchParams.get("userId");

    const supabase = await createServerClient();

    let query = supabase
      .from("project_members")
      .select("id, project_slug, user_id, role, created_at")
      .order("created_at", { ascending: false });

    if (projectSlug) {
      query = query.eq("project_slug", projectSlug);
    }

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      memberships: data ?? [],
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
