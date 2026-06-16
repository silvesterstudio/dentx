"use client";

import { useCallback, useEffect, useState } from "react";

type Booking = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  preferred_date: string | null;
  preferred_time: string | null;
  status: string;
};

const STATUS_NEXT: Record<string, string> = {
  new: "contacted",
  contacted: "done",
  done: "new",
  cancelled: "new",
};

const STATUS_COLOR: Record<string, string> = {
  new: "#2563eb",
  contacted: "#d97706",
  done: "#16a34a",
  cancelled: "#6b7280",
};

const STATUS_LABEL: Record<string, string> = {
  new: "Nou",
  contacted: "Contactat",
  done: "Finalizat",
  cancelled: "Anulat",
};

export default function AdminPage() {
  const [pass, setPass] = useState("");
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${password}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        setError("Parolă greșită.");
        setAuthed(false);
        sessionStorage.removeItem("dentx_admin");
        return;
      }
      const data = await res.json();
      if (!data.ok) {
        setError(
          data.error === "not_configured"
            ? "Supabase nu este configurat (lipsesc cheile în .env.local)."
            : "Eroare la încărcare.",
        );
        return;
      }
      setBookings(data.bookings ?? []);
      setPass(password);
      setAuthed(true);
      sessionStorage.setItem("dentx_admin", password);
    } catch {
      setError("Eroare de rețea.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("dentx_admin");
    if (!saved) return;
    // defer out of the effect's synchronous pass so load()'s setState calls
    // don't run during the effect body
    const id = setTimeout(() => void load(saved), 0);
    return () => clearTimeout(id);
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${pass}` },
      body: JSON.stringify({ id, status }),
    });
  };

  const fmt = (b: Booking) => {
    const parts = [b.preferred_date, b.preferred_time].filter(Boolean);
    return parts.length ? parts.join(" · ") : "—";
  };

  if (!authed) {
    return (
      <main style={shell}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(pass);
          }}
          style={{ width: "100%", maxWidth: 360, display: "flex", flexDirection: "column", gap: 14 }}
        >
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Dent-X · Admin</h1>
          <p style={{ margin: 0, color: "#9aa3ad", fontSize: 14 }}>
            Introdu parola pentru a vedea programările.
          </p>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Parolă"
            autoFocus
            style={input}
          />
          {error && <div style={{ color: "#f87171", fontSize: 14 }}>{error}</div>}
          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading ? "Se verifică…" : "Intră"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main style={{ ...shell, alignItems: "stretch", justifyContent: "flex-start", padding: "32px clamp(16px,4vw,48px)" }}>
      <div style={{ width: "100%", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>
            Programări <span style={{ color: "#6b7280", fontWeight: 500 }}>({bookings.length})</span>
          </h1>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => load(pass)} disabled={loading} style={ghostBtn}>
              {loading ? "…" : "Reîmprospătează"}
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("dentx_admin");
                setAuthed(false);
                setPass("");
              }}
              style={ghostBtn}
            >
              Ieși
            </button>
          </div>
        </div>

        {error && <div style={{ color: "#f87171", marginBottom: 16 }}>{error}</div>}

        {bookings.length === 0 ? (
          <p style={{ color: "#9aa3ad" }}>Nicio programare încă.</p>
        ) : (
          <div style={{ overflowX: "auto", border: "1px solid #232a33", borderRadius: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#9aa3ad" }}>
                  <th style={th}>Primit</th>
                  <th style={th}>Nume</th>
                  <th style={th}>Telefon</th>
                  <th style={th}>Preferat</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderTop: "1px solid #232a33" }}>
                    <td style={td}>{new Date(b.created_at).toLocaleString("ro-RO")}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{b.name}</td>
                    <td style={td}>
                      <a href={`tel:${b.phone}`} style={{ color: "#60a5fa", textDecoration: "none" }}>
                        {b.phone}
                      </a>
                    </td>
                    <td style={td}>{fmt(b)}</td>
                    <td style={td}>
                      <button
                        onClick={() => setStatus(b.id, STATUS_NEXT[b.status] ?? "new")}
                        title="Click pentru a schimba statusul"
                        style={{
                          cursor: "pointer",
                          border: "none",
                          borderRadius: 999,
                          padding: "5px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#fff",
                          background: STATUS_COLOR[b.status] ?? "#6b7280",
                        }}
                      >
                        {STATUS_LABEL[b.status] ?? b.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

const shell: React.CSSProperties = {
  minHeight: "100svh",
  background: "#14191f",
  color: "#fbfbfb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
};

const input: React.CSSProperties = {
  background: "#1d242d",
  border: "1px solid #2b343f",
  borderRadius: 10,
  padding: "12px 14px",
  color: "#fbfbfb",
  fontSize: 15,
  outline: "none",
};

const primaryBtn: React.CSSProperties = {
  background: "#fbfbfb",
  color: "#14191f",
  border: "none",
  borderRadius: 10,
  padding: "12px 16px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  background: "transparent",
  color: "#cbd2da",
  border: "1px solid #2b343f",
  borderRadius: 10,
  padding: "9px 14px",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
};

const th: React.CSSProperties = { padding: "12px 16px", fontWeight: 600, whiteSpace: "nowrap" };
const td: React.CSSProperties = { padding: "12px 16px", whiteSpace: "nowrap" };
