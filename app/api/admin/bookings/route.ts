import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin-only. Protected by a shared password (ADMIN_PASSWORD) sent as a Bearer
// token. Reads/updates bookings with the Supabase service_role key, which lives
// only on the server.
function authed(req: Request) {
  const ADMIN = process.env.ADMIN_PASSWORD;
  if (!ADMIN) return false;
  const pass = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return pass === ADMIN;
}

function supa() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

export async function GET(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const s = supa();
  if (!s) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });

  const res = await fetch(
    `${s.url}/rest/v1/bookings?select=*&order=created_at.desc`,
    {
      headers: { apikey: s.key, Authorization: `Bearer ${s.key}` },
      cache: "no-store",
    },
  );
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "fetch_failed" }, { status: 502 });
  }
  const bookings = await res.json();
  return NextResponse.json({ ok: true, bookings });
}

// Update a booking's status (new → contacted → done / cancelled).
export async function PATCH(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const s = supa();
  if (!s) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });

  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  const id = String(body.id ?? "");
  const status = String(body.status ?? "");
  if (!id || !["new", "contacted", "done", "cancelled"].includes(status)) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const res = await fetch(
    `${s.url}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: s.key,
        Authorization: `Bearer ${s.key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "update_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

// Permanently delete a booking. id can be passed as a query param (?id=…) or in
// the JSON body.
export async function DELETE(req: Request) {
  if (!authed(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const s = supa();
  if (!s) return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });

  let id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) {
    try {
      const body = (await req.json()) as { id?: string };
      id = String(body.id ?? "");
    } catch {
      /* no body — fall through to validation */
    }
  }
  if (!id) {
    return NextResponse.json({ ok: false, error: "validation" }, { status: 400 });
  }

  const res = await fetch(
    `${s.url}/rest/v1/bookings?id=eq.${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        apikey: s.key,
        Authorization: `Bearer ${s.key}`,
        Prefer: "return=minimal",
      },
    },
  );
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "delete_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
