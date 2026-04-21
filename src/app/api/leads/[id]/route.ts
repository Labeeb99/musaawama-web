import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("leads")
      .select("id, name, stage, budget, timeline, summary, created_at")
      .eq("id", Number(id))
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Lead not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ lead: data });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
