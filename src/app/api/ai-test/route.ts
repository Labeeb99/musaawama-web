import { NextResponse } from "next/server";
import { generateAssistantReply } from "@/lib/ai";

export async function GET() {
  try {
    const reply = await generateAssistantReply({
      systemPrompt:
        "You are a concise assistant helping test the Musaawama AI integration.",
      userMessage: "Say hello and confirm the AI helper is working.",
    });

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown AI test error.",
      },
      { status: 500 }
    );
  }
}
