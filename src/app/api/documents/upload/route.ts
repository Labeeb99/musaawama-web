import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const projectSlug = formData.get("projectSlug") as string | null;
    const category = formData.get("category") as string | null;
    const description = formData.get("description") as string | null;
    const tags = formData.get("tags") as string | null;

    if (!file || !projectSlug) {
      return NextResponse.json(
        { error: "File and projectSlug are required." },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const arrayBuffer = await file.arrayBuffer();
    const filePath = `${projectSlug}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("project-documents")
      .upload(filePath, arrayBuffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("UPLOAD STORAGE ERROR:", {
        filePath,
        fileName: file.name,
        projectSlug,
        error: uploadError,
      });

      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("documents")
      .insert([
        {
          project_slug: projectSlug,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type || "unknown",
          category: category?.trim() || null,
          description: description?.trim() || null,
          tags: tags?.trim() || null,
        },
      ])
      .select("id, file_path")
      .single();

    if (insertError) {
      console.error("UPLOAD DB ERROR:", {
        filePath,
        fileName: file.name,
        projectSlug,
        error: insertError,
      });

      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Document uploaded successfully.",
      document: inserted,
    });
  } catch (error) {
    console.error("UPLOAD ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid upload request.",
      },
      { status: 500 }
    );
  }
}
