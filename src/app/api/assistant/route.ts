import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";


type AssistantRequest = {
  message?: string;
  userId?: string | null;
};

function getMockResponse(message: string) {
  const lower = message.toLowerCase();

  if (
    lower.includes("estimate") ||
    lower.includes("cost") ||
    lower.includes("price") ||
    lower.includes("budget")
  ) {
    return {
      reply:
        "I can provide rough cost-direction guidance, but not final contract pricing. A realistic estimate depends on scope, location, programme, procurement route, materials, and project risk. Musaawama’s approach is to clarify assumptions first, then guide the client toward a more informed delivery strategy.",
    };
  }

  if (
    lower.includes("systems thinking") ||
    lower.includes("system thinking") ||
    lower.includes("interconnected") ||
    lower.includes("whole system")
  ) {
    return {
      reply:
        "Musaawama uses a systems thinking approach, which means treating construction delivery as an interconnected system rather than a series of isolated tasks. Design decisions, sequencing, procurement, communication, cost, and site execution all affect each other. This helps reduce fragmentation and improve clarity, coordination, and long-term project outcomes.",
    };
  }

  if (
    lower.includes("portal") ||
    lower.includes("dashboard") ||
    lower.includes("workspace") ||
    lower.includes("client platform")
  ) {
    return {
      reply:
        "The client platform is being designed to give users visibility into project updates, current risks, pending approvals, uploaded documents, and AI-assisted summaries of what matters most. Over time, it will become a project intelligence workspace for both Musaawama projects and future SaaS users.",
    };
  }

  if (
    lower.includes("saas") ||
    lower.includes("software") ||
    lower.includes("subscription") ||
    lower.includes("other companies")
  ) {
    return {
      reply:
        "The long-term goal is to evolve Musaawama from a project delivery business into a construction SaaS platform. The platform will first support Musaawama’s own live projects, then expand into a subscription model for other construction teams who want better visibility, coordination, and AI-assisted project intelligence.",
    };
  }

  if (
    lower.includes("risk") ||
    lower.includes("delay") ||
    lower.includes("coordination") ||
    lower.includes("delivery")
  ) {
    return {
      reply:
        "One of the key goals of the Musaawama platform is to help clients and teams understand delivery risk earlier. The assistant should be able to explain where coordination problems exist, what decisions are pending, which packages may be delayed, and what actions are needed next to keep progress moving.",
    };
  }

  if (
    lower.includes("service") ||
    lower.includes("help") ||
    lower.includes("what do you do") ||
    lower.includes("what does musaawama do")
  ) {
    return {
      reply:
        "Musaawama combines practical construction support with long-term digital product development. Today, it helps through project management, coordination, and consultancy. Over time, it is being shaped into a project intelligence platform with an AI assistant and client workspace built around systems thinking.",
    };
  }

  return {
    reply:
      "I can help explain Musaawama’s services, systems thinking approach, rough cost-direction guidance, project delivery support, client portal vision, and SaaS direction. Ask me something specific and I’ll guide you clearly.",
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AssistantRequest;
    const message = body.message?.trim();
    const userId = body.userId ?? null;

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    const response = getMockResponse(message);
    const supabase = createServerClient();

    
await supabase.from("assistant_messages").insert([
  {
    user_id: userId,
    role: "user",
    content: message,
  },
  {
    user_id: userId,
    role: "assistant",
    content: response.reply,
  },
]);

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
