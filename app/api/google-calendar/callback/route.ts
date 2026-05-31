import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTokensFromCode } from "@/lib/google-calendar";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // empresaId

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard?error=oauth_failed", request.url));
  }

  try {
    const tokens = await getTokensFromCode(code);

    await prisma.empresa.update({
      where: { id: state },
      data: {
        googleAccessToken: tokens.access_token!,
        googleRefreshToken: tokens.refresh_token || undefined,
        googleTokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        googleCalendarId: "primary", // Default calendar
      },
    });

    return NextResponse.redirect(
      new URL(`/empresa/${state}/agenda?google_connected=1`, request.url)
    );
  } catch (error) {
    console.error("Error OAuth Google Calendar:", error);
    return NextResponse.redirect(
      new URL(`/empresa/${state}/agenda?error=oauth_failed`, request.url)
    );
  }
}
