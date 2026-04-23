import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { generateAssistantReply } from "@/lib/ai";

type AssistantRequest = {
  message?: string;
  userId?: string | null;
};

const GLOBAL_ASSISTANT_SYSTEM_PROMPT = `
You are the Musaawama Construction Intelligence Assistant.

You help users understand:
- Musaawama’s services
- Musaawama’s systems thinking approach
- the project platform and client portal
- rough construction cost-direction guidance
- current workspace activity when context is provided

Behavior rules:
- Be practical, clear, and structured.
- Do not invent company history, project records, or exact costs.
- If discussing costs, explain that guidance is directional only and depends on scope, location, finishes, risk, and delivery conditions.
- Do not present rough cost guidance as a formal quote, tender, or cost plan.
- Encourage proper engagement when detailed pricing or project support is needed.
- If live workspace context is provided, use it carefully and stay grounded in that data.
- If something is not in the provided context, say it is not currently recorded.
- If document metadata is provided, use it to answer questions about what files exist, which project they belong to, and what category or tags they carry.
- Prefer clarity over hype.
`;

function buildWorkspaceContext(input: {
  projects: { title: string; status: string; phase: string }[];
  updates: { title: string; project_slug: string }[];
  milestones: { title: string; project_slug: string; status: string }[];
  actions: { title: string; project_slug: string; status: string }[];
  leads: { name: string; stage: string }[];
  documents: {
    file_name: string;
    project_slug: string;
    category: string | null;
    tags: string | null;
    description: string | null;
  }[];
}) {
  const projectsText =
    input.projects.length > 0
      ? input.projects
          .map(
            (item, index) =>
              `${index + 1}. ${item.title} — status: ${item.status}, phase: ${item.phase}`
          )
          .join("\n")
      : "No projects recorded.";

  const updatesText =
    input.updates.length > 0
      ? input.updates
          .map(
            (item, index) => `${index + 1}. ${item.title} — ${item.project_slug}`
          )
          .join("\n")
      : "No recent updates recorded.";

  const milestonesText =
    input.milestones.length > 0
      ? input.milestones
          .map(
            (item, index) =>
              `${index + 1}. ${item.title} — ${item.project_slug} (${item.status})`
          )
          .join("\n")
      : "No milestones recorded.";

  const actionsText =
    input.actions.length > 0
      ? input.actions
          .map(
            (item, index) =>
              `${index + 1}. ${item.title} — ${item.project_slug} (${item.status})`
          )
          .join("\n")
      : "No client actions recorded.";

  const leadsText =
    input.leads.length > 0
      ? input.leads
          .map((item, index) => `${index + 1}. ${item.name} (${item.stage})`)
          .join("\n")
      : "No leads recorded.";

  const documentsText =
    input.documents.length > 0
      ? input.documents
          .map(
            (item, index) =>
              `${index + 1}. ${item.file_name} — project: ${item.project_slug}, category: ${
                item.category || "Unspecified"
              }, tags: ${item.tags || "None"}, description: ${
                item.description || "No description"
              }`
          )
          .join("\n")
      : "No documents recorded.";

  return `
Live workspace context

Projects:
${projectsText}

Recent updates:
${updatesText}

Milestones:
${milestonesText}

Client actions:
${actionsText}

Leads:
${leadsText}

Documents:
${documentsText}
`.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequest;
    const message = body.message?.trim();
    const userId = body.userId ?? null;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    let history: { role: "user" | "assistant"; content: string }[] = [];

    if (userId) {
      const { data: historyRows, error: historyError } = await supabase
        .from("assistant_messages")
        .select("role, content, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (historyError) {
        return NextResponse.json(
          { error: historyError.message },
          { status: 500 }
        );
      }

      history = (historyRows ?? [])
        .reverse()
        .map((row) => ({
          role: row.role as "user" | "assistant",
          content: row.content,
        }));
    }

    const [
      { data: projects, error: projectsError },
      { data: updates, error: updatesError },
      { data: milestones, error: milestonesError },
      { data: actions, error: actionsError },
      { data: leads, error: leadsError },
      { data: documents, error: documentsError },
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("title, status, phase")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("project_updates")
        .select("title, project_slug")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("project_milestones")
        .select("title, project_slug, status")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("client_actions")
        .select("title, project_slug, status")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("leads")
        .select("name, stage")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("documents")
        .select("file_name, project_slug, category, tags, description")
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    const workspaceContext =
      projectsError ||
      updatesError ||
      milestonesError ||
      actionsError ||
      leadsError ||
      documentsError
        ? "Live workspace context is currently unavailable."
        : buildWorkspaceContext({
            projects: projects ?? [],
            updates: updates ?? [],
            milestones: milestones ?? [],
            actions: actions ?? [],
            leads: leads ?? [],
            documents: documents ?? [],
          });

    const aiResult = await generateAssistantReply({
      systemPrompt: `${GLOBAL_ASSISTANT_SYSTEM_PROMPT}\n\n${workspaceContext}`,
      userMessage: message,
      history,
    });

    const reply = aiResult.ok
      ? aiResult.reply
      : "I could not complete that request reliably just now. Please try again, or ask a narrower question about projects, updates, leads, actions, milestones, documents, or Musaawama services.";

    const { error: insertError } = await supabase
      .from("assistant_messages")
      .insert([
        {
          user_id: userId,
          role: "user",
          content: message,
        },
        {
          user_id: userId,
          role: "assistant",
          content: reply,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

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
