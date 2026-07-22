import { NextResponse } from "next/server";

/** Legacy Mongo register removed. Use /auth/register + server actions. */
export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Use the /auth/register page.",
      code: "DEPRECATED",
    },
    { status: 410 },
  );
}
