"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useLang } from "./LanguageProvider";

type Status = "idle" | "sending" | "ok" | "err";

// Clinic program: Mon–Fri 08:00–20:00, Sat 09:00–16:00, Sun closed.
function hoursForDay(dow: number): { open: number; close: number } | null {
  if (dow === 0) return null;
  if (dow === 6) return { open: 9 * 60, close: 16 * 60 };
  return { open: 8 * 60, close: 20 * 60 };
}

const SLOT = 30; // minutes between bookable slots
const pad = (n: number) => String(n).padStart(2, "0");
const toHHMM = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;

// "Programează o consultație" CTA → modal (portaled to <body> so it's never
// trapped under the fixed video overlay). Date/time are custom selects bound to
// the clinic program with no past slots. Submits to /api/booking.
export default function BookingForm({
  buttonStyle,
  ctaLabel,
}: {
  buttonStyle?: CSSProperties;
  ctaLabel?: string;
}) {
  const { t, lang } = useLang();
  const locale = lang === "ru" ? "ru-RU" : "ro-RO";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(""); // yyyy-mm-dd
  const [time, setTime] = useState(""); // HH:MM
  const [status, setStatus] = useState<Status>("idle");

  // Next ~14 open days (skip Sundays + today if it's already too late).
  const dates = useMemo(() => {
    const out: { value: string; label: string }[] = [];
    const now = new Date();
    for (let i = 0; i < 30 && out.length < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const h = hoursForDay(d.getDay());
      if (!h) continue;
      if (i === 0) {
        const nowMins = now.getHours() * 60 + now.getMinutes();
        if (nowMins >= h.close - SLOT) continue; // no usable slot left today
      }
      const value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const lbl = d.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
      out.push({ value, label: lbl.charAt(0).toUpperCase() + lbl.slice(1) });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `open` recomputes against a fresh "now" each time the modal opens
  }, [locale, open]);

  // Bookable times for the chosen day (no past slots if it's today).
  const slots = useMemo(() => {
    if (!date) return [] as string[];
    const [y, m, dd] = date.split("-").map(Number);
    const d = new Date(y, m - 1, dd);
    const h = hoursForDay(d.getDay());
    if (!h) return [];
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    const out: string[] = [];
    for (let mins = h.open; mins <= h.close - SLOT; mins += SLOT) {
      if (isToday && mins <= nowMins) continue;
      out.push(toHHMM(mins));
    }
    return out;
  }, [date]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setTimeout(() => {
      setStatus("idle");
      setName("");
      setPhone("");
      setDate("");
      setTime("");
    }, 250);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, date, time }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      setStatus(res.ok && data.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} style={{ ...ctaBase, ...buttonStyle }}>
        {ctaLabel ?? t.booking.cta}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t.booking.title}
            onClick={(e) => e.target === e.currentTarget && close()}
            style={backdrop}
          >
            <div style={card}>
              <button type="button" aria-label={t.booking.close} onClick={close} style={closeBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              {status === "ok" ? (
                <div style={{ textAlign: "center", padding: "16px 4px" }}>
                  <div style={successIcon}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h3 style={{ margin: "18px 0 8px", fontSize: 22, fontWeight: 700, color: "#14191f" }}>
                    {t.booking.successTitle}
                  </h3>
                  <p style={{ margin: "0 0 22px", color: "#5b6470", fontSize: 15, lineHeight: 1.5 }}>
                    {t.booking.successText}
                  </p>
                  <button type="button" onClick={close} style={submitBtn}>
                    {t.booking.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 700, color: "#14191f", letterSpacing: "-0.01em" }}>
                    {t.booking.title}
                  </h3>
                  <p style={{ margin: "0 0 14px", color: "#5b6470", fontSize: 15, lineHeight: 1.5 }}>
                    {t.booking.subtitle}
                  </p>

                  <div style={freeNote}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {t.booking.freeNote}
                  </div>

                  <label style={label}>{t.booking.name}</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t.booking.namePh} required minLength={2} style={field} />

                  <label style={label}>{t.booking.phone}</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.booking.phonePh} type="tel" required style={field} />

                  <div style={{ display: "flex", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label style={label}>{t.booking.date}</label>
                      <select
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setTime("");
                        }}
                        required
                        style={selectStyle}
                      >
                        <option value="" disabled>
                          {t.booking.datePh}
                        </option>
                        {dates.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <label style={label}>{t.booking.time}</label>
                      <select
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                        disabled={!date}
                        style={{ ...selectStyle, opacity: date ? 1 : 0.55 }}
                      >
                        <option value="" disabled>
                          {t.booking.timePh}
                        </option>
                        {slots.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {status === "err" && (
                    <div style={{ color: "#dc2626", fontSize: 14, marginTop: 14 }}>{t.booking.error}</div>
                  )}

                  <button type="submit" disabled={status === "sending"} style={{ ...submitBtn, marginTop: 22, width: "100%", opacity: status === "sending" ? 0.7 : 1 }}>
                    {status === "sending" ? t.booking.sending : t.booking.submit}
                  </button>
                </form>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

const ctaBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  background: "#fbfbfb",
  color: "#14191f",
  border: "none",
  borderRadius: 999,
  padding: "16px 30px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const backdrop: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(8,11,16,0.66)",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  boxSizing: "border-box",
};

const card: CSSProperties = {
  position: "relative",
  width: "100%",
  maxWidth: 440,
  background: "#fff",
  borderRadius: 22,
  padding: "clamp(24px, 4vw, 36px)",
  boxShadow: "0 30px 80px rgba(8,11,16,0.45)",
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  maxHeight: "92svh",
  overflowY: "auto",
  boxSizing: "border-box",
};

const closeBtn: CSSProperties = {
  position: "absolute",
  top: 16,
  right: 16,
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: "none",
  background: "#f1f3f5",
  color: "#5b6470",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const freeNote: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  background: "#eef6f0",
  color: "#15803d",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 13.5,
  fontWeight: 600,
  marginBottom: 4,
};

const label: CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#14191f",
  margin: "14px 0 6px",
};

const field: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#f6f7f8",
  border: "1px solid #e3e6e9",
  borderRadius: 12,
  padding: "13px 14px",
  fontSize: 15,
  color: "#14191f",
  outline: "none",
  fontFamily: "inherit",
};

const selectStyle: CSSProperties = {
  ...field,
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none' stroke='%235b6470' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 1.5 6 6.5l5-5'/></svg>\")",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 13px center",
  paddingRight: 34,
};

const submitBtn: CSSProperties = {
  background: "#14191f",
  color: "#fff",
  border: "none",
  borderRadius: 999,
  padding: "15px 28px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const successIcon: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "#16a34a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "8px auto 0",
};
