import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_MODEL = "gpt-4.1-mini";

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

type GenerateAssistantReplyInput = {
  systemPrompt: string;
  userMessage: string;
  history?: ChatHistoryMessage[];
};

export async function generateAssistantReply(
  input: GenerateAssistantReplyInput
) {
  const historyItems =
    input.history?.map((message) => ({
      role: message.role,
      content: message.content,
    })) ?? [];

  try {
    const response = await client.responses.create({
      model: DEFAULT_MODEL,
      input: [
        {
          role: "system",
          content: input.systemPrompt,
        },
        ...historyItems,
        {
          role: "user",
          content: input.userMessage,
        },
      ],
    });

    const text = response.output_text?.trim();

    if (!text) {
      return {
        ok: false,
        reply:
          "I could not generate a useful response just now. Please try again with a more specific question.",
      };
    }

    return {
      ok: true,
      reply: text,
    };
  } catch (error) {
    return {
      ok: false,
      reply:
        error instanceof Error
          ? `AI request failed: ${error.message}`
          : "AI request failed unexpectedly.",
    };
  }
}
