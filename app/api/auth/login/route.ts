import { NextResponse } from "next/server";

/** Legacy JWT login removed. Use /auth/login + server actions. */
export async function POST() {
  return NextResponse.json(
    {
      error: "This endpoint is deprecated. Use the /auth/login page.",
      code: "DEPRECATED",
    },
    { status: 410 },
  );
}
