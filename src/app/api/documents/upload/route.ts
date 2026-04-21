import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const projectSlug = formData.get("projectSlug") as string | null;

    if (!file || !projectSlug) {
      return NextResponse.json(
        { error: "File and projectSlug are required." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = `${Date.now()}-${file.name}`;
    const filePath = `${projectSlug}/${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("project-documents")
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabase.from("documents").insert([
      {
        project_slug: projectSlug,
        file_name: file.name,
        file_path: filePath,
        file_type: file.type || "unknown",
      },
    ]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Document uploaded successfully.",
      filePath,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 }
    );
  }
}
