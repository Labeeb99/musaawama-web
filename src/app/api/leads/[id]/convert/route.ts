import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .select("id, name, stage, budget, timeline, summary")
      .eq("id", Number(id))
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const projectSlug = `${slugify(lead.name)}-${lead.id}`;
    
    const { error: projectError } = await supabase.from("projects").insert([
    {
        slug: projectSlug,
        title: lead.name,
        status: "Active",
        phase: "Initiation",
        summary: lead.summary,
        overview: `Project created from lead conversion. Budget: ${lead.budget || "Not set"}. Timeline: ${lead.timeline || "Not set"}.`,
        source: "lead_conversion",
        source_lead_id: lead.id,
    },
   ]); 
    
    if (projectError) {
      return NextResponse.json({ error: projectError.message }, { status: 500 });
    }

    const { error: updateLeadError } = await supabase
      .from("leads")
      .update({ stage: "Converted" })
      .eq("id", Number(id));

    if (updateLeadError) {
      return NextResponse.json(
        { error: updateLeadError.message },
        { status: 500 }
      );
    }


const { error: updateInsertError } = await supabase
  .from("project_updates")
  .insert([
    {
      project_slug: projectSlug,
      title: "Project created from lead",
      description: `This project was created by converting the lead "${lead.name}" into an active workspace.`,
    },
  ]);

if (updateInsertError) {
  return NextResponse.json(
    { error: updateInsertError.message },
    { status: 500 }
  );
}

const { error: milestoneError } = await supabase
  .from("project_milestones")
  .insert([
    {
      project_slug: projectSlug,
      title: "Initial project review",
      status: "Pending",
      due_date: null,
    },
  ]);

if (milestoneError) {
  return NextResponse.json(
    { error: milestoneError.message },
    { status: 500 }
  );
}

const { error: actionError } = await supabase
  .from("client_actions")
  .insert([
    {
      project_slug: projectSlug,
      title: "Confirm project brief",
      description: `Client should confirm the initial project brief for "${lead.name}" so the workspace can move into the next stage.`,
      status: "Pending",
      due_date: null,
    },
  ]);

if (actionError) {
  return NextResponse.json(
    { error: actionError.message },
    { status: 500 }
  );
}

    return NextResponse.json({
      message: "Lead converted to project successfully.",
      projectSlug,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
