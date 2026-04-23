import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type CreateProjectMemberRequest = {
  projectSlug?: string;
  userId?: string;
  role?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateProjectMemberRequest;

    const projectSlug = body.projectSlug?.trim();
    const userId = body.userId?.trim();
    const role = body.role?.trim() || "client";

    if (!projectSlug || !userId) {
      return NextResponse.json(
        { error: "projectSlug and userId are required." },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from("project_members")
      .insert([
        {
          project_slug: projectSlug,
          user_id: userId,
          role,
        },
      ])
      .select("id, project_slug, user_id, role, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Project membership created successfully.",
      membership: data,
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
