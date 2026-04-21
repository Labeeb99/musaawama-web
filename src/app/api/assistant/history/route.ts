import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const supabase = createServerClient();

    let query = supabase
      .from("assistant_messages")
      .select("id, role, content, created_at, user_id")
      .order("created_at", { ascending: true })
      .limit(50);

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ messages: data });
  } catch {
    return NextResponse.json(
      { error: "Failed to load assistant history." },
      { status: 500 }
    );
  }
}
