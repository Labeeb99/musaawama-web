import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

type AssistantRequest = {
  message?: string;
};

function buildProjectAwareReply(
  message: string,
  projectTitle: string,
  phase: string,
  status: string,
  updates: { title: string; description: string }[],
  milestones: { title: string; status: string }[],
  actions: { title: string; status: string }[]
) {
  const lower = message.toLowerCase();

  if (lower.includes("status") || lower.includes("phase")) {
    return `The current project is "${projectTitle}". Its status is "${status}" and the current phase is "${phase}".`;
  }

  if (lower.includes("update") || lower.includes("latest")) {
    if (!updates.length) {
      return `There are no recent updates recorded for "${projectTitle}" yet.`;
    }

    const latest = updates[0];
    return `The latest recorded update for "${projectTitle}" is "${latest.title}". ${latest.description}`;
  }

  if (lower.includes("milestone")) {
    if (!milestones.length) {
      return `There are no milestones recorded for "${projectTitle}" yet.`;
    }

    const pending = milestones.filter((item) => item.status !== "Completed");

    if (!pending.length) {
      return `All recorded milestones for "${projectTitle}" are currently completed.`;
    }

    return `There are ${pending.length} milestone(s) still in progress or pending for "${projectTitle}". The next key items include: ${pending
      .slice(0, 3)
      .map((item) => `${item.title} (${item.status})`)
      .join(", ")}.`;
  }

  if (lower.includes("action") || lower.includes("approval")) {
    if (!actions.length) {
      return `There are no client actions recorded for "${projectTitle}" yet.`;
    }

    const pending = actions.filter((item) => item.status !== "Completed");

    if (!pending.length) {
      return `There are no pending client actions for "${projectTitle}" right now.`;
    }

    return `There are ${pending.length} pending client action(s) for "${projectTitle}". The most relevant include: ${pending
      .slice(0, 3)
      .map((item) => `${item.title} (${item.status})`)
      .join(", ")}.`;
  }

  if (lower.includes("risk") || lower.includes("delay")) {
    const pendingMilestones = milestones.filter((item) => item.status !== "Completed").length;
    const pendingActions = actions.filter((item) => item.status !== "Completed").length;

    return `For "${projectTitle}", the main delivery attention areas appear to be unresolved milestones and client actions. There are ${pendingMilestones} non-completed milestone(s) and ${pendingActions} non-completed client action(s), which may affect sequencing and progress if not addressed.`;
  }

  return `This is the project assistant for "${projectTitle}". I can help explain the project status, current phase, latest updates, milestones, client actions, and likely delivery attention points. Ask me something more specific and I will summarize it clearly.`;
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = (await request.json()) as AssistantRequest;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const [
      { data: project, error: projectError },
      { data: updates, error: updatesError },
      { data: milestones, error: milestonesError },
      { data: actions, error: actionsError },
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("title, phase, status")
        .eq("slug", slug)
        .single(),
      supabase
        .from("project_updates")
        .select("title, description")
        .eq("project_slug", slug)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("project_milestones")
        .select("title, status")
        .eq("project_slug", slug)
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("client_actions")
        .select("title, status")
        .eq("project_slug", slug)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    if (updatesError || milestonesError || actionsError) {
      return NextResponse.json(
        { error: "Failed to load project context." },
        { status: 500 }
      );
    }

    const reply = buildProjectAwareReply(
      message,
      project.title,
      project.phase,
      project.status,
      updates ?? [],
      milestones ?? [],
      actions ?? []
    );

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
