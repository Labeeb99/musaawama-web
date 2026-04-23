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
    const supabase = await createServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { data: document, error: documentError } = await supabase
      .from("documents")
      .select("id, file_name, file_path, project_slug")
      .eq("id", Number(id))
      .single();

    if (documentError || !document) {
      return NextResponse.json(
        {
          error: documentError?.message || "Document not found.",
        },
        { status: 404 }
      );
    }

    const { data: membership, error: membershipError } = await supabase
      .from("project_members")
      .select("id, role")
      .eq("project_slug", document.project_slug)
      .eq("user_id", user.id)
      .maybeSingle();

    if (membershipError || !membership) {
      return NextResponse.json(
        {
          error: membershipError?.message || "Forbidden.",
        },
        { status: 403 }
      );
    }

    const { data: signedData, error: signedUrlError } = await supabase.storage
      .from("project-documents")
      .createSignedUrl(document.file_path, 60 * 10);

    if (signedUrlError || !signedData?.signedUrl) {
      console.error("SIGNED URL ERROR:", {
        documentId: document.id,
        filePath: document.file_path,
        bucket: "project-documents",
        error: signedUrlError,
      });

      return NextResponse.json(
        {
          error:
            signedUrlError?.message ||
            "Failed to generate signed URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      signedUrl: signedData.signedUrl,
      fileName: document.file_name,
    });
  } catch (error) {
    console.error("SIGNED URL ROUTE ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid request.",
      },
      { status: 500 }
    );
  }
}
