import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
  rating?: number;
  name?: string;
  phone?: string;
  message?: string;
  lang?: string;
};

// Private (low-rating) feedback from the /feedback review funnel. Happy
// reviewers never hit this route — they're redirected straight to Google on the
// client. This only receives the ≤3★ complaints and pings the clinic's Telegram
// bot so they hear about it privately and instantly. No database: the message is
// the deliverable, and Telegram is the inbox.
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const rating = Math.min(5, Math.max(0, Math.round(Number(body.rating) || 0)));
  const name = String(body.name ?? "").trim().slice(0, 120);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const message = String(body.message ?? "").trim().slice(0, 2000);
  const lang = String(body.lang ?? "").toLowerCase() === "ru" ? "RU" : "RO";

  // Need at least a message or a phone to be worth delivering.
  if (!message && phone.replace(/\D/g, "").length < 6) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TG_CHAT = process.env.TELEGRAM_CHAT_ID;

  if (TG_TOKEN && TG_CHAT) {
    const text =
      `⚠️ Recenzie privată — Dent-X (${lang})\n\n` +
      `⭐ ${rating}/5\n` +
      `👤 ${name || "—"}\n` +
      `📞 ${phone || "—"}\n` +
      `💬 ${message || "—"}`;
    // TELEGRAM_CHAT_ID may hold several comma-separated recipients — notify each.
    const chatIds = TG_CHAT.split(",").map((c) => c.trim()).filter(Boolean);
    await Promise.all(
      chatIds.map((chat_id) =>
        fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id, text }),
        }).catch((err) => console.error(`[feedback] Telegram notify failed for ${chat_id}`, err)),
      ),
    );
  } else {
    console.warn(
      "[feedback] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — feedback NOT delivered (dev mode).",
    );
  }

  return NextResponse.json({ ok: true });
}
