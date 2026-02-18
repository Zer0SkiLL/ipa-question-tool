import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isDemoUser } from "./demo";

/**
 * Check if the current user is a demo user. If so, return a 403 response.
 * Use this in mutating API endpoints (POST, PATCH, DELETE) that should be
 * blocked for demo users.
 *
 * Returns null if the user is not a demo user (allow the request).
 * Returns a NextResponse with 403 if the user is a demo user (block the request).
 */
export async function checkDemoRestriction(): Promise<NextResponse | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isDemoUser(user?.email)) {
    return NextResponse.json(
      { error: "Diese Aktion ist im Demo-Modus nicht verfügbar." },
      { status: 403 }
    );
  }
  return null;
}
