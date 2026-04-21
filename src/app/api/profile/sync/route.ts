import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, full_name } = body;

    if (!id || !email) {
      return NextResponse.json(
        { error: "id and email are required." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error } = await supabase.from("user_profiles").upsert([
      {
        id,
        email,
        full_name: full_name || null,
        role: "client",
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Profile synced successfully." });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
