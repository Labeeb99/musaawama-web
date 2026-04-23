import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

function createSlugFromName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const leadId = Number(id);

    if (Number.isNaN(leadId)) {
      return NextResponse.json(
        { error: "Invalid lead id." },
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

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, stage, summary, budget, timeline")
      .eq("id", leadId)
      .single();

    if (leadError || !lead) {
      console.error("CONVERT LEAD ERROR: lead lookup failed", leadError);
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    if (lead.stage === "Converted") {
      const { data: existingProject, error: existingProjectError } = await supabase
        .from("projects")
        .select("slug")
        .eq("source_lead_id", lead.id)
        .maybeSingle();

      if (existingProjectError) {
        console.error(
          "CONVERT LEAD ERROR: existing project lookup failed",
          existingProjectError
        );
      }

      return NextResponse.json({
        message: "Lead has already been converted.",
        projectSlug: existingProject?.slug ?? null,
      });
    }

    const baseSlug = createSlugFromName(lead.name || `lead-${lead.id}`);
    const projectSlug = `${baseSlug}-${lead.id}`;

    const { data: createdProject, error: projectError } = await supabase
      .from("projects")
      .insert([
        {
          slug: projectSlug,
          title: lead.name,
          status: "Active",
          phase: "Pre-Construction",
          summary: lead.summary || "Converted from lead.",
          overview: lead.summary || "Converted from lead.",
          source: "lead",
          source_lead_id: lead.id,
        },
      ])
      .select("slug, id")
      .single();

    if (projectError || !createdProject) {
      console.error("CONVERT LEAD ERROR: project creation failed", {
        projectSlug,
        error: projectError,
      });

      return NextResponse.json(
        { error: projectError?.message || "Failed to create project." },
        { status: 500 }
      );
    }

    const { error: membershipError } = await supabase
      .from("project_members")
      .insert([
        {
          project_slug: createdProject.slug,
          user_id: user.id,
          role: "owner",
        },
      ]);

    if (membershipError) {
      console.error("CONVERT LEAD ERROR: membership insert failed", {
        projectSlug: createdProject.slug,
        userId: user.id,
        error: membershipError,
      });

      return NextResponse.json(
        {
          error:
            membershipError.message ||
            "Project created, but membership assignment failed.",
        },
        { status: 500 }
      );
    }

    const { error: leadUpdateError } = await supabase
      .from("leads")
      .update({ stage: "Converted" })
      .eq("id", lead.id);

    if (leadUpdateError) {
      console.error("CONVERT LEAD ERROR: lead update failed", {
        leadId: lead.id,
        error: leadUpdateError,
      });

      return NextResponse.json(
        { error: leadUpdateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Lead converted successfully.",
      projectSlug: createdProject.slug,
    });
  } catch (error) {
    console.error("CONVERT LEAD ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid request.",
      },
      { status: 500 }
    );
  }
}
