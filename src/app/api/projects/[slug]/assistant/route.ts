import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generateAssistantReply } from "@/lib/ai";

type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

type AssistantRequest = {
  message?: string;
};

function buildProjectContext(input: {
  project: { title: string; phase: string; status: string };
  updates: { title: string; description: string }[];
  milestones: { title: string; status: string }[];
  actions: { title: string; status: string }[];
  documents: {
    file_name: string;
    file_type: string | null;
    category: string | null;
    tags: string | null;
    description: string | null;
    created_at: string;
  }[];
}) {
  const updatesText =
    input.updates.length > 0
      ? input.updates
          .map(
            (item, index) =>
              `${index + 1}. ${item.title}: ${item.description}`
          )
          .join("\n")
      : "No recent updates recorded.";

  const milestonesText =
    input.milestones.length > 0
      ? input.milestones
          .map(
            (item, index) => `${index + 1}. ${item.title} (${item.status})`
          )
          .join("\n")
      : "No milestones recorded.";

  const actionsText =
    input.actions.length > 0
      ? input.actions
          .map(
            (item, index) => `${index + 1}. ${item.title} (${item.status})`
          )
          .join("\n")
      : "No client actions recorded.";

  const documentsText =
    input.documents.length > 0
      ? input.documents
          .map(
            (item, index) =>
              `${index + 1}. ${item.file_name} — type: ${
                item.file_type || "Unknown"
              }, category: ${item.category || "Unspecified"}, tags: ${
                item.tags || "None"
              }, description: ${item.description || "No description"}, uploaded: ${new Date(
                item.created_at
              ).toLocaleString()}`
          )
          .join("\n")
      : "No project documents recorded.";

  return `
Project title: ${input.project.title}
Project status: ${input.project.status}
Project phase: ${input.project.phase}

Recent updates:
${updatesText}

Milestones:
${milestonesText}

Client actions:
${actionsText}

Project documents:
${documentsText}
`.trim();
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

    const [
      { data: project, error: projectError },
      { data: updates, error: updatesError },
      { data: milestones, error: milestonesError },
      { data: actions, error: actionsError },
      { data: documents, error: documentsError },
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
      supabase
        .from("documents")
        .select("file_name, file_type, category, tags, description, created_at")
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

    const projectContext =
      updatesError || milestonesError || actionsError || documentsError
        ? `
Project title: ${project.title}
Project status: ${project.status}
Project phase: ${project.phase}

Recent updates:
Project update context is currently unavailable.

Milestones:
Milestone context is currently unavailable.

Client actions:
Client action context is currently unavailable.

Project documents:
Document context is currently unavailable.
`.trim()
        : buildProjectContext({
            project,
            updates: updates ?? [],
            milestones: milestones ?? [],
            actions: actions ?? [],
            documents: documents ?? [],
          });

    const systemPrompt = `
You are the Musaawama Project Assistant.

You help users understand a specific construction project using only the provided project context.

Rules:
- Stay grounded in the provided project context.
- Do not invent updates, milestones, actions, dates, risks, or documents.
- If something is not in the context, say that it is not currently recorded.
- If project context is incomplete or unavailable, clearly say which parts are not currently recorded.
- If project document metadata is provided, use it to answer questions about what files exist, what type they are, and how they are described.
- Be practical, concise, and structured.
- When useful, summarize current status, likely attention points, pending actions, next steps, and document coverage.
- If the user asks about risk or delay, infer cautiously from pending milestones and client actions, and clearly signal that it is an interpretation based on the current data.
- Do not provide legal, contractual, or exact cost advice unless clearly supported by the project context.
- Focus on delivery understanding, project visibility, sequencing, and client decision points.

Project context:
${projectContext}
`.trim();

    const aiResult = await generateAssistantReply({
      systemPrompt,
      userMessage: message,
    });

    const reply = aiResult.ok
      ? aiResult.reply
      : "I could not interpret this project reliably just now. Please try again, or ask a narrower question about project status, updates, milestones, actions, documents, or next steps.";

    return NextResponse.json({ reply });
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
