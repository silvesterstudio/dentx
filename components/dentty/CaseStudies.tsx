"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";

// The fullscreen video IS the "Lucrările noastre" section. After it expands and
// the title animates, the 3 before/after cases play as a conveyor: each card
// springs in from behind the right edge and parks centre-right while its patient
// testimonial reveals word-by-word (by scroll) on the left; scroll on and the
// card slides out to the left as the NEXT case springs in. #cases is an empty
// tall track that supplies the scroll room. Desktop only; mobile stacks them.
const TRACK_VH = 600;
const TITLE_HOLD = 0.5; // vh before case 1 starts rising in (after the title)
const MOVE = 0.5; // vh — card rises UP from the bottom into place
const HOLD = 0.95; // vh — card STOPPED at centre while its testimonial reveals
const MOVE_OUT = 0.28; // vh — card shoots UP off the top (shorter = faster exit)

export default function CaseStudies() {
  const t = useContent();
  const overlayRef = useRef<HTMLDivElement>(null);
  // Mobile-only dark backdrop behind the expanding video — fades in as the video
  // grows so the scrolled-away bento doesn't leave a white gap above it.
  const backdropRef = useRef<HTMLDivElement>(null);
  const cases = t.cases.items;
  // The overlay is portaled to <body> so it lives in the ROOT stacking context
  // (z6). Inside #work — z4, a stacking context — it would be trapped below the
  // Contact section (z5) and couldn't shrink down OVER it.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    // Mobile uses a scrollable Services bento + a stacked Cazuri (#cazuri-mobile),
    // so the desktop pinned video→fullscreen expand is disabled below 980px.
    const mq = window.matchMedia("(max-width: 980px)");
    const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

    let raf = 0;

    // The overlay content (cards, quote blocks, words, caption, gradient) is
    // STATIC — it's rendered once from `cases` and never changes. Resolve every
    // node ONCE here instead of re-running querySelectorAll dozens of times per
    // scroll frame (that per-frame DOM querying was the main source of the
    // Servicii scroll lag, since the smooth-scroll loop fires a scroll event —
    // and thus this whole update — every animation frame).
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ovCaption = overlay.querySelector<HTMLElement>(".ov-caption");
    const ovGrad = overlay.querySelector<HTMLElement>(".ov-grad");
    const ovCards = Array.from(overlay.querySelectorAll<HTMLElement>(".ov-ba-card"));
    const ovBlocks = Array.from(overlay.querySelectorAll<HTMLElement>(".ov-quote-block"));
    // words + author per block, resolved once (the per-frame `.oq-word`
    // querySelectorAll inside the conveyor loop was especially expensive).
    const ovBlockData = ovBlocks.map((block) => ({
      block,
      words: Array.from(block.querySelectorAll<HTMLElement>(".oq-word")),
      author: block.querySelector<HTMLElement>(".oq-author"),
    }));

    const reset = (tile: HTMLElement) => {
      overlay.style.display = "none";
      tile.style.visibility = "";
      if (backdropRef.current) backdropRef.current.style.opacity = "0";
      ovCaption?.classList.remove("play");
      ovCards.forEach((c) => {
        c.style.transform = "translateY(140%)";
        c.style.opacity = "0";
      });
    };

    const update = () => {
      raf = 0;
      const tile = document.getElementById("quote-tile");
      const services = document.getElementById("services");
      if (!tile || !services) return;

      const vh = window.innerHeight || 1;
      // clientWidth EXCLUDES the vertical scrollbar; innerWidth includes it, which
      // would push the card's right edge (and its rounded corner) under the
      // scrollbar so the right corner looks clipped vs the left.
      const vw = document.documentElement.clientWidth || window.innerWidth || 1;
      const qr = tile.getBoundingClientRect();

      // scroll0 = how far we've scrolled INTO the expand; expandDist = its length.
      // Desktop: the Servicii inner stage is PINNED, so we measure from the
      // section top over the pinned region. Mobile: the square-card bento SCROLLS
      // and the video tile is sticky — we measure from a sentinel right before it
      // (the expand begins once the video pins to the top), so the bento can be
      // longer than one screen.
      let scroll0: number;
      let expandDist: number;
      let wantActive: boolean;
      if (mq.matches) {
        const sentinel = document.getElementById("svc-video-sentinel");
        if (!sentinel) {
          reset(tile);
          return;
        }
        // The video tile sits at the BOTTOM of the bento. The expand begins once
        // it's FULLY in view at the bottom (its top reaches vh - height) and grows
        // upward to fullscreen FROM THAT POSITION; the dark backdrop ramps in fast
        // so the cards scrolling behind read as a frozen stage.
        const off = vh - qr.height - sentinel.getBoundingClientRect().top;
        scroll0 = Math.max(0, off);
        expandDist = Math.max(1, 0.9 * vh); // expand over ~one screen of scroll
        wantActive = off > 0;
      } else {
        const sr = services.getBoundingClientRect();
        scroll0 = Math.max(0, -sr.top);
        expandDist = Math.max(1, sr.height - vh);
        wantActive = sr.top <= 0.5 * vh;
      }
      if (!wantActive) {
        reset(tile);
        return;
      }
      const p = clamp01(scroll0 / expandDist);

      // Mobile: fade in the dark backdrop as the video grows so the white grid
      // padding BELOW the pinned, expanding video reads as a cinematic dark
      // stage. Ramps in fast (full by p≈0.25) so the moment the expand starts
      // the page looks frozen. Off once fullscreen.
      if (backdropRef.current) {
        const bo = mq.matches && p < 0.999 ? clamp01(p * 4) : 0;
        backdropRef.current.style.opacity = bo.toFixed(3);
      }

      // Lift: at the very end, the fullscreen card slides UP to reveal Contact.
      const contact = document.getElementById("contact");
      const contactTop = contact ? contact.getBoundingClientRect().top : vh;
      const lift = Math.min(0, contactTop - vh);
      const liftP = clamp01((vh - contactTop) / vh);

      // expand from the tile rect → fullscreen by p, then hold + lift. On mobile
      // the source is the video's FULLY-IN-VIEW-AT-BOTTOM position (top = vh -
      // height), so it grows upward from there (anchored at the bottom) while the
      // bento scrolls away behind the fast-fading backdrop. Desktop grows from the
      // tile's pinned position in the bento.
      const srcTop = mq.matches ? vh - qr.height : qr.top;
      tile.style.visibility = "hidden";
      overlay.style.display = "block";
      overlay.style.top = lerp(srcTop, 0, p) + lift + "px";
      overlay.style.left = lerp(qr.left, 0, p) + "px";
      overlay.style.width = lerp(qr.width, vw, p) + "px";
      overlay.style.height = lerp(qr.height, vh, p) + "px";
      // all corners share the expand radius (rounded tile → square fullscreen)…
      const er = lerp(18, 0, p);
      overlay.style.borderRadius = er + "px";
      // …and the BOTTOM corners round FURTHER during the final lift, so the card
      // peels up off the dark Contacte (er keeps them in sync during the expand,
      // otherwise they'd be forced square while the top corners stay rounded).
      // corners + shrink share the SAME normalised lift progress (reaches full
      // a little before liftP maxes out — same feel as the corner rounding).
      const lp = Math.min(1, liftP * 2.5);
      const r = Math.max(er, 44 * lp).toFixed(1) + "px";
      overlay.style.borderBottomLeftRadius = r;
      overlay.style.borderBottomRightRadius = r;
      overlay.style.boxShadow =
        liftP > 0.01 ? `inset 0 0 0 1.5px rgba(255,255,255,${(0.4 * lp).toFixed(2)})` : "";
      // shrink the card 100% → 95% as it lifts, so it pulls in to a floating
      // card while revealing the slate Contacte around/beneath it.
      overlay.style.transform = `scale(${(1 - 0.05 * lp).toFixed(4)})`;
      // fade the card to invisible once Contact is fully in view
      overlay.style.opacity = liftP > 0.5
        ? Math.max(0, 1 - (liftP - 0.5) * 2).toFixed(3)
        : "";

      // fade the case content out as the card lifts, so the rising video is clean.
      const sf = 1 - liftP;
      // also fade the video's heavy bottom gradient so the bright clinic footage
      // shows at the edge — that contrast makes the rounding corners read clearly.
      if (ovGrad) ovGrad.style.opacity = liftP > 0 ? Math.max(0.15, 1 - liftP * 2).toFixed(3) : "";

      // title reveal (CSS-timed); fade out during the lift.
      ovCaption?.classList.toggle("play", p >= 0.9);
      if (ovCaption) ovCaption.style.opacity = liftP > 0 ? sf.toFixed(3) : "";

      // conveyor of cases — strict SEQUENCE per case (scroll-scrubbed): card
      // rises UP from the bottom → STOPS at centre → testimonial reveals
      // word-by-word → it finishes → card shoots UP off the top (faster than the
      // scroll) while fading, as the next case rises in from the bottom. Phases
      // In/Hold/Out are distinct; words reveal only during the Hold.
      // conveyor starts once the expand completes (scroll past the pin region).
      const past = Math.max(0, scroll0 - expandDist);
      const titleHold = TITLE_HOLD * vh;
      const move = MOVE * vh;
      const hold = HOLD * vh;
      const moveOut = MOVE_OUT * vh;
      const stride = move + hold; // next case starts as this one begins exiting
      const cards = ovCards;
      const n = cards.length;
      for (let k = 0; k < n; k++) {
        const isLast = k === n - 1;
        const localK = past - (titleHold + k * stride);

        // card: +140%(below) → 0(centre, STOP) → -200%(above, fast). last stays.
        let ty: number;
        if (localK <= 0) ty = 140;
        else if (localK < move) ty = (1 - localK / move) * 140;
        else if (localK < move + hold) ty = 0;
        else if (!isLast) ty = -clamp01((localK - (move + hold)) / moveOut) * 200;
        else ty = 0;
        const card = cards[k];
        card.style.transform = `translateY(${ty.toFixed(2)}%)`;
        const fadeIn = clamp01(localK / (move * 0.5));
        const fadeOut = isLast ? 1 : clamp01((move + hold + moveOut - localK) / moveOut);
        card.style.opacity = String((localK <= 0 ? 0 : Math.min(fadeIn, fadeOut)) * sf);

        const data = ovBlockData[k];
        if (!data) continue;
        const { block, words: ws, author } = data;
        const bIn = clamp01((localK - move * 0.6) / (move * 0.5));
        const bOut = isLast ? 1 : clamp01((move + hold + moveOut * 0.6 - localK) / (moveOut * 0.6));
        block.style.opacity = String((localK <= 0 ? 0 : Math.min(bIn, bOut)) * sf);
        // words reveal ONLY during the Hold (i.e. after the card has stopped)
        const tp = clamp01((localK - move) / hold);
        const head = tp * (ws.length + 4);
        ws.forEach((w, i) => {
          w.style.opacity = String(clamp01(head - i));
        });
        if (author) author.style.opacity = String(clamp01((tp - 0.9) / 0.1));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted]);

  return (
    <>
      {/* empty tall track — scroll room. Mobile shows a stacked section instead. */}
      <section
        id="cases"
        data-screen-label="Cazuri"
        style={{ position: "relative", background: "#fbfbfb", height: `${TRACK_VH}svh` }}
      >
        <div id="cazuri-mobile" style={{ display: "none" }}>
          {/* Cinematic video moment — the mobile stand-in for the desktop
              expand-to-fullscreen video, with the title set over it. */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "76svh",
              overflow: "hidden",
              background: "#28323f",
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/clinic-office.webp"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            >
              <source src="/video-card.mp4" type="video/mp4" />
            </video>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(16,20,26,0.55) 0%, rgba(16,20,26,0.12) 34%, rgba(16,20,26,0.45) 68%, rgba(16,20,26,0.9) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: "clamp(20px, 5vw, 40px)",
                right: "clamp(20px, 5vw, 40px)",
                bottom: "clamp(26px, 7vw, 48px)",
              }}
            >
              <div style={{ height: 1, background: "rgba(251,251,251,0.5)", marginBottom: 16 }} />
              <h2
                style={{
                  margin: 0,
                  color: "#fbfbfb",
                  fontSize: "clamp(40px, 12vw, 72px)",
                  fontWeight: 500,
                  lineHeight: 0.98,
                  letterSpacing: "-0.03em",
                }}
              >
                {t.cases.title}
              </h2>
            </div>
          </div>
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              width: "100%",
              boxSizing: "border-box",
              padding:
                "clamp(40px, 9vw, 64px) clamp(20px, 5vw, 40px) clamp(48px, 9vw, 80px)",
            }}
          >
            {cases.map((c) => (
              <figure key={c.title} style={{ margin: "0 0 clamp(40px, 10vw, 64px)" }}>
                <BeforeAfterStack c={c} t={t} variant="solid" />
                <span style={{ display: "inline-block", marginTop: 18, background: "rgba(40,50,63,0.08)", color: "#28323f", fontSize: 12, fontWeight: 600, padding: "5px 11px", borderRadius: 999 }}>
                  {c.title}
                </span>
                <blockquote style={{ margin: "14px 0 0", color: "#28323f", fontSize: "clamp(19px, 5vw, 25px)", fontWeight: 500, lineHeight: 1.4, letterSpacing: "-0.01em" }}>
                  “{c.testimonial.quote}”
                </blockquote>
                <figcaption style={{ marginTop: 12, color: "rgba(40,50,63,0.7)", fontSize: 14, fontWeight: 600 }}>
                  — {c.testimonial.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* fixed clone: video → fullscreen → conveyor of cases → shrink into the
          Contact dock. Portaled to <body> so it isn't trapped in #work's z4. */}
      {mounted &&
        createPortal(
          <>
          <div
            ref={backdropRef}
            aria-hidden
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 5,
              background: "#14191f",
              opacity: 0,
              pointerEvents: "none",
            }}
          />
          <div
            ref={overlayRef}
            id="cazuri-overlay"
            aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "20%",
          height: 200,
          zIndex: 6,
          overflow: "hidden",
          display: "none",
          background: "#28323f",
          pointerEvents: "none",
        }}
      >
        <video autoPlay muted loop playsInline poster="/clinic-office.webp" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}>
          <source src="/video-card.mp4" type="video/mp4" />
        </video>
        <div className="ov-grad" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(16,20,26,0.6) 0%, rgba(16,20,26,0.25) 30%, rgba(16,20,26,0.4) 62%, rgba(16,20,26,0.82) 100%)" }} />

        {/* one testimonial (left) + one card (right) per case, stacked */}
        {cases.map((c) => {
          const words = c.testimonial.quote.split(" ");
          return (
            <div key={c.title}>
              <div
                className="ov-quote-block"
                style={{
                  position: "absolute",
                  left: "clamp(22px, 5vw, 90px)",
                  top: "clamp(230px, 32vh, 380px)",
                  width: "min(40vw, 520px)",
                  opacity: 0,
                }}
              >
                <div className="oq-label" style={{ display: "inline-block", background: "rgba(251,251,251,0.16)", color: "#fbfbfb", fontSize: 13, fontWeight: 600, padding: "6px 13px", borderRadius: 999, marginBottom: 18 }}>
                  {c.title}
                </div>
                <blockquote style={{ margin: 0, color: "#fbfbfb", fontSize: "clamp(19px, 1.9vw, 31px)", fontWeight: 500, lineHeight: 1.32, letterSpacing: "-0.01em" }}>
                  {words.map((w, i) => (
                    <span key={i} className="oq-word" style={{ opacity: 0 }}>
                      {w}{i < words.length - 1 ? " " : ""}
                    </span>
                  ))}
                </blockquote>
                <div className="oq-author" style={{ opacity: 0, marginTop: 20, color: "rgba(251,251,251,0.85)", fontSize: "clamp(15px, 1.2vw, 18px)", fontWeight: 600 }}>
                  — {c.testimonial.author}
                </div>
              </div>

              <div
                className="ov-ba-card"
                style={{
                  position: "absolute",
                  right: "clamp(24px, 5vw, 96px)",
                  top: "clamp(220px, 30vh, 360px)",
                  width: "clamp(280px, 26vw, 400px)",
                  transform: "translateY(140%)",
                  opacity: 0,
                  willChange: "transform",
                }}
              >
                <BeforeAfterStack c={c} t={t} variant="glass" />
              </div>
            </div>
          );
        })}

        {/* title — painted last so it stays above the cards */}
        <div className="ov-caption" style={{ position: "absolute", left: "clamp(20px, 4vw, 72px)", right: "clamp(20px, 4vw, 72px)", top: "clamp(96px, 13vh, 150px)" }}>
          <div className="ov-rule" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap", marginTop: "clamp(14px, 1.6vw, 22px)" }}>
            <h2 className="ov-reveal ov-title-r" style={{ margin: 0, color: "#fbfbfb", fontSize: "clamp(40px, 5vw, 80px)", fontWeight: 500, lineHeight: 0.96, letterSpacing: "-0.03em" }}>
              <span>{t.cases.title}</span>
            </h2>
          </div>
        </div>
          </div>
          </>,
          document.body,
        )}
    </>
  );
}

type Case = ReturnType<typeof useContent>["cases"]["items"][number];

// One before/after case — before stacked OVER after (two rows), images only,
// with a transition node on the seam. glass = on-video; solid = mobile.
function BeforeAfterStack({
  c,
  t,
  variant,
}: {
  c: Case;
  t: ReturnType<typeof useContent>;
  variant: "glass" | "solid";
}) {
  const glass = variant === "glass";
  const imgWrap = {
    position: "relative",
    aspectRatio: "16 / 10",
    borderRadius: 10,
    overflow: "hidden",
    background: glass ? "rgba(8,11,16,0.5)" : "#eceef0",
  } as const;
  return (
    <article
      className="ba-stack"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: glass ? "rgba(12,16,21,0.62)" : "#ffffff",
        border: glass ? "1px solid rgba(251,251,251,0.24)" : "none",
        backdropFilter: glass ? "blur(10px)" : undefined,
        WebkitBackdropFilter: glass ? "blur(10px)" : undefined,
        borderRadius: 18,
        padding: glass ? 10 : 12,
        boxSizing: "border-box",
        boxShadow: glass ? "0 24px 60px rgba(8,11,16,0.6)" : "0 1px 2px rgba(20,25,31,0.04), 0 14px 36px rgba(20,25,31,0.06)",
      }}
    >
      <div className="ba-imgwrap" style={imgWrap}>
        <ImageSlot caption={`${c.title} — ${t.cases.before}`} shape="rect" dark={glass} showLabel={false} />
      </div>
      <div className="ba-imgwrap" style={imgWrap}>
        <ImageSlot caption={`${c.title} — ${t.cases.after}`} shape="rect" dark={glass} showLabel={false} />
      </div>
      <span
        aria-hidden
        className="ba-node"
        style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 34, height: 34, borderRadius: "50%", background: "#28323f", color: "#fbfbfb",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "2px solid #ffffff", boxShadow: "0 6px 16px rgba(8,11,16,0.4)",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" />
          <path d="m19 12-7 7-7-7" />
        </svg>
      </span>
    </article>
  );
}
