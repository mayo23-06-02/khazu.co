import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadMedia } from "@/lib/supabase/media";
import { assertSameOrigin } from "@/lib/security/origin";

export async function POST(req: Request) {
  try {
    const originCheck = assertSameOrigin(req);
    if (!originCheck.ok) {
      return NextResponse.json(
        { error: originCheck.error },
        { status: originCheck.status },
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, path } = await uploadMedia(
      buffer,
      "listing-images",
      user.id,
      file.name,
      file.type || "application/octet-stream",
    );

    return NextResponse.json({ url, path });
  } catch (error) {
    console.error("upload route error:", error);
    // Surface the real reason (bucket missing, file too large/wrong type,
    // service-role key not configured, etc.) instead of a generic message —
    // none of these expose anything sensitive, and a silent generic error
    // here is exactly what made an earlier upload bug (images failing and
    // falling back to a placeholder) so hard to diagnose from the outside.
    const message =
      error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
