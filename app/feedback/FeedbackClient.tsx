"use client";

import { useState, type CSSProperties } from "react";
import { GOOGLE_REVIEW_URL, CLINIC_TEL } from "@/lib/constants";

// Review funnel. A customer scans the reception QR → lands here → picks 1–5★.
//   ≥4★  → sent straight to Google to post the review publicly (lifts the rating)
//   ≤3★  → shown a PRIVATE form that pings the clinic on Telegram, and does NOT
//          touch Google. Their complaint reaches the team, not the public page.
// Self-contained + bilingual (RO default, RU toggle) so it works as a fast,
// nav-less QR landing on any phone.
const RATING_THRESHOLD = 4; // this score or higher → public Google review

type Lang = "ro" | "ru";
type View = "rate" | "redirect" | "low" | "done";

const T = {
  ro: {
    heading: "Cum a fost experiența ta?",
    sub: "Părerea ta ne ajută să fim mai buni.",
    tapStar: "Atinge o stea",
    redirect: "Te redirecționăm către Google…",
    lowTitle: "Ne pare rău că nu a fost perfect.",
    lowSub: "Spune-ne ce putem îmbunătăți — mesajul ajunge direct la echipă, nu public.",
    name: "Numele tău (opțional)",
    phone: "Telefon (opțional)",
    message: "Ce putem face mai bine?",
    send: "Trimite",
    sending: "Se trimite…",
    doneTitle: "Îți mulțumim!",
    doneText: "Am primit mesajul tău și vom lua măsuri.",
    err: "Ceva n-a mers.",
    callInstead: "Sună-ne",
  },
  ru: {
    heading: "Как вам понравилось?",
    sub: "Ваше мнение помогает нам стать лучше.",
    tapStar: "Нажмите на звезду",
    redirect: "Перенаправляем вас в Google…",
    lowTitle: "Жаль, что не всё прошло идеально.",
    lowSub: "Расскажите, что можно улучшить — сообщение придёт напрямую команде, не публично.",
    name: "Ваше имя (необязательно)",
    phone: "Телефон (необязательно)",
    message: "Что мы можем сделать лучше?",
    send: "Отправить",
    sending: "Отправка…",
    doneTitle: "Спасибо!",
    doneText: "Мы получили ваше сообщение и примем меры.",
    err: "Что-то пошло не так.",
    callInstead: "Позвоните нам",
  },
} as const;

export default function FeedbackClient() {
  const [lang, setLang] = useState<Lang>("ro");
  const [view, setView] = useState<View>("rate");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState(false);
  const t = T[lang];

  const pick = (r: number) => {
    setRating(r);
    if (r >= RATING_THRESHOLD) {
      setView("redirect");
      // brief beat so the tap registers visually, then hand off to Google
      window.setTimeout(() => {
        window.location.href = GOOGLE_REVIEW_URL;
      }, 650);
    } else {
      setView("low");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setErr(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, name, phone, message, lang }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) setView("done");
      else setErr(true);
    } catch {
      setErr(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <main style={shell}>
      {/* language toggle */}
      <div style={langWrap}>
        {(["ro", "ru"] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            style={{
              ...langBtn,
              background: lang === l ? "#fbfbfb" : "transparent",
              color: lang === l ? "#14191f" : "rgba(251,251,251,0.7)",
            }}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={card}>
        <div style={wordmark}>
          Dent<span style={{ color: "#7ea8c4" }}>X</span>
        </div>

        {view === "rate" && (
          <>
            <h1 style={heading}>{t.heading}</h1>
            <p style={subtitle}>{t.sub}</p>
            <div
              style={stars}
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n}`}
                  onClick={() => pick(n)}
                  onMouseEnter={() => setHover(n)}
                  style={starBtn}
                >
                  <Star filled={n <= (hover || rating)} />
                </button>
              ))}
            </div>
            <div style={hint}>{t.tapStar}</div>
          </>
        )}

        {view === "redirect" && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} style={starBtn}>
                  <Star filled={n <= rating} />
                </span>
              ))}
            </div>
            <p style={{ ...subtitle, marginTop: 20 }}>{t.redirect}</p>
          </div>
        )}

        {view === "low" && (
          <form onSubmit={submit}>
            <h1 style={heading}>{t.lowTitle}</h1>
            <p style={subtitle}>{t.lowSub}</p>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.name}
              style={field}
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phone}
              type="tel"
              style={field}
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.message}
              required
              rows={4}
              style={{ ...field, resize: "vertical", minHeight: 96 }}
            />
            {err && (
              <div style={{ color: "#fca5a5", fontSize: 14, marginTop: 4 }}>
                {t.err}{" "}
                <a href={`tel:${CLINIC_TEL}`} style={{ color: "#fbfbfb" }}>
                  {t.callInstead}
                </a>
              </div>
            )}
            <button type="submit" disabled={sending} style={{ ...primaryBtn, opacity: sending ? 0.7 : 1 }}>
              {sending ? t.sending : t.send}
            </button>
          </form>
        )}

        {view === "done" && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={checkCircle}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h1 style={{ ...heading, marginTop: 18 }}>{t.doneTitle}</h1>
            <p style={subtitle}>{t.doneText}</p>
          </div>
        )}
      </div>
    </main>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill={filled ? "#f5b301" : "none"}
      stroke={filled ? "#f5b301" : "rgba(251,251,251,0.4)"}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.3l6.5-.9z" />
    </svg>
  );
}

const shell: CSSProperties = {
  minHeight: "100svh",
  background: "#14191f",
  color: "#fbfbfb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
  boxSizing: "border-box",
  fontFamily: "var(--font-manrope), system-ui, sans-serif",
  position: "relative",
};

const langWrap: CSSProperties = {
  position: "absolute",
  top: 18,
  right: 18,
  display: "flex",
  gap: 2,
  background: "rgba(251,251,251,0.08)",
  borderRadius: 999,
  padding: 3,
};

const langBtn: CSSProperties = {
  border: "none",
  borderRadius: 999,
  padding: "6px 12px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "inherit",
};

const card: CSSProperties = {
  width: "100%",
  maxWidth: 440,
  background: "#1d242d",
  border: "1px solid #2b343f",
  borderRadius: 24,
  padding: "clamp(28px, 6vw, 40px)",
  boxSizing: "border-box",
  boxShadow: "0 30px 80px rgba(8,11,16,0.5)",
};

const wordmark: CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  marginBottom: 22,
};

const heading: CSSProperties = {
  margin: "0 0 8px",
  fontSize: "clamp(24px, 6vw, 30px)",
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
};

const subtitle: CSSProperties = {
  margin: "0 0 4px",
  color: "rgba(251,251,251,0.62)",
  fontSize: 15,
  lineHeight: 1.5,
};

const stars: CSSProperties = {
  display: "flex",
  gap: "clamp(6px, 2.5vw, 12px)",
  margin: "26px 0 10px",
};

const starBtn: CSSProperties = {
  flex: 1,
  aspectRatio: "1 / 1",
  maxWidth: 62,
  background: "transparent",
  border: "none",
  padding: 4,
  cursor: "pointer",
  display: "block",
};

const hint: CSSProperties = {
  color: "rgba(251,251,251,0.4)",
  fontSize: 13,
  textAlign: "center",
};

const field: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "#14191f",
  border: "1px solid #2b343f",
  borderRadius: 12,
  padding: "13px 14px",
  fontSize: 15,
  color: "#fbfbfb",
  outline: "none",
  fontFamily: "inherit",
  marginTop: 12,
};

const primaryBtn: CSSProperties = {
  width: "100%",
  marginTop: 18,
  background: "#fbfbfb",
  color: "#14191f",
  border: "none",
  borderRadius: 999,
  padding: "15px 28px",
  fontSize: 15,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "inherit",
};

const checkCircle: CSSProperties = {
  width: 60,
  height: 60,
  borderRadius: "50%",
  background: "#16a34a",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "8px auto 0",
};
