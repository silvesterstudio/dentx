import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Runs on a Vercel Cron schedule (see vercel.json). A single lightweight query
// keeps the Supabase project counted as "active" so the free tier never
// auto-pauses after 7 days of inactivity. If CRON_SECRET is set, we only accept
// requests carrying it (Vercel sends it automatically for scheduled runs).
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get("authorization") || "";
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  // Cheapest possible touch: ask for a single id, no body needed.
  const res = await fetch(`${url}/rest/v1/bookings?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: "no-store",
  });

  return NextResponse.json({ ok: res.ok, pinged: true, status: res.status });
}
