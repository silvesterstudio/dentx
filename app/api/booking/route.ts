import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = { name?: string; phone?: string; date?: string; time?: string };

// Public endpoint: the consultation form POSTs here. We (1) store the booking in
// Supabase (the admin panel reads from there) and (2) ping the clinic's Telegram
// bot so they're notified instantly. Both use server-only env vars — the secret
// keys never reach the browser.
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 120);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const date = String(body.date ?? "").trim().slice(0, 20);
  const time = String(body.time ?? "").trim().slice(0, 20);

  if (name.length < 2 || phone.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

  // 1) persist to Supabase
  if (SUPABASE_URL && SUPABASE_KEY) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name,
        phone,
        preferred_date: date || null,
        preferred_time: time || null,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[booking] Supabase insert failed", res.status, detail);
      return NextResponse.json({ ok: false, error: "store_failed" }, { status: 502 });
    }
  } else {
    console.warn(
      "[booking] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — booking NOT stored (dev mode).",
    );
  }

  // 2) Telegram notification (best-effort — a failure here doesn't fail the booking)
  if (TG_TOKEN && TG_CHAT) {
    const when = [date, time].filter(Boolean).join(" ") || "—";
    const text =
      `🦷 Programare nouă — Dent-X\n\n` +
      `👤 ${name}\n` +
      `📞 ${phone}\n` +
      `🗓 ${when}`;
    // TELEGRAM_CHAT_ID may hold several recipients (comma-separated) — notify each.
    const chatIds = TG_CHAT.split(",").map((c) => c.trim()).filter(Boolean);
    await Promise.all(
      chatIds.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text }),
        }).catch((err) => console.error(`[booking] Telegram notify failed for ${chat_id}`, err)),
      ),
    );
  } else {
    console.warn(
      "[booking] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — no notification sent (dev mode).",
    );
  }

  return NextResponse.json({ ok: true });
}
