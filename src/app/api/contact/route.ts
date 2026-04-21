import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, phone, service, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error: submissionError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name,
          email,
          phone: phone || null,
          service: service || null,
          budget: budget || null,
          message,
        },
      ]);

    if (submissionError) {
      return NextResponse.json(
        { error: submissionError.message },
        { status: 500 }
      );
    }

    const leadSummary = [
      service ? `Service requested: ${service}` : null,
      budget ? `Budget indication: ${budget}` : null,
      phone ? `Phone: ${phone}` : null,
      `Message: ${message}`,
    ]
      .filter(Boolean)
      .join(" | ");

    const { error: leadError } = await supabase.from("leads").insert([
      {
        name: `${name} enquiry`,
        stage: "New",
        budget: budget || "Not provided",
        timeline: "TBC",
        summary: leadSummary,
      },
    ]);

    if (leadError) {
      return NextResponse.json(
        { error: leadError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Submission saved successfully.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
