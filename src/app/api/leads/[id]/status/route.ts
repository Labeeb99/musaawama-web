import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateStatusRequest = {
  status?: string;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateStatusRequest;
    const status = body.status?.trim();

    if (!status) {
      return NextResponse.json(
        { error: "Status is required." },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const allowedRoles = ["admin", "project_manager"];

    if (!allowedRoles.includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { error } = await supabase
      .from("leads")
      .update({ stage: status })
      .eq("id", Number(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Lead status updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid request.",
      },
      { status: 400 }
    );
  }
}
