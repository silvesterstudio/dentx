"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useContent } from "./LanguageProvider";
import ImageSlot from "./ImageSlot";
import AutoplayVideo from "./AutoplayVideo";

// The fullscreen video IS the "Lucrările noastre" section. After it expands and
// the title animates, the 3 before/after cases play as a conveyor: each card
// springs in from behind the right edge and parks centre-right while its patient
// testimonial reveals word-by-word (by scroll) on the left; scroll on and the
// card slides out to the left as the NEXT case springs in. #cases is an empty
// tall track that supplies the scroll room. Desktop only; mobile stacks them.
// Sized so ALL cases get their dwell: each case needs ~(MOVE+HOLD) vh of scroll
// and `past` ≈ (1 + TRACK_VH/100) vh, so 7 cases (~10.7vh) need ~1150svh + lift room.
const TRACK_VH = 1200;
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
    // The expand→conveyor overlay runs on BOTH desktop and mobile (mobile measures
    // the video tile's own rect; desktop measures the pinned #services region).
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
    const ovVideo = overlay.querySelector<HTMLVideoElement>("video");
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

    // Once the overlay is reset (Servicii not active) there's nothing to update
    // until it activates again — but `update` still fires every scroll frame
    // while scrolling Echipa/Clinica/etc. This flag makes reset() write the DOM
    // only ONCE on the active→inactive transition instead of on every one of
    // those frames (a meaningful saving on mobile, where Echipa scrolled janky).
    let settledInactive = false;
    // Same idea for the CONVEYOR: while the video is still expanding (or has just
    // landed) NO case card is on screen yet, but the per-card loop below still
    // re-wrote every card's transform AND every testimonial word's opacity on
    // every scroll frame. That ~50-writes-per-frame churn during the expand was a
    // big part of the MOBILE lag in exactly the phase the user feels it. This flag
    // parks the cards hidden ONCE and skips the loop until the conveyor begins.
    let conveyorIdle = false;
    const reset = (tile: HTMLElement) => {
      if (settledInactive) return;
      settledInactive = true;
      conveyorIdle = false;
      ovVideo?.pause(); // back to a still frame when the overlay isn't in play
      overlay.style.display = "none";
      overlay.style.clipPath = "";
      tile.style.visibility = "";
      // release the mobile fixed-position pin (the stage returns to normal flow).
      // removeProperty so the !important-priority inline values set on pin-enter are
      // fully cleared (falling back to the static-flow CSS).
      const stage = document.getElementById("services-stage");
      if (stage) {
        stage.style.removeProperty("position");
        stage.style.removeProperty("left");
        stage.style.removeProperty("right");
        stage.style.removeProperty("bottom");
        stage.style.removeProperty("top");
        stage.style.removeProperty("width");
      }
      const svc = document.getElementById("services");
      if (svc) svc.style.removeProperty("height"); // drop the height lock taken on pin-enter
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
      // scroll0 = how far we've scrolled INTO the expand; expandDist = its length.
      // DESKTOP: the whole bento fits one screen and the inner stage is PINNED at
      // the TOP (CSS sticky top:0, section = 100svh + PIN_VH) — measure from the
      // section top over the pinned region.
      // MOBILE: the bento is a TALLER-than-screen scrollable grid of square cards.
      // It scrolls normally until its BOTTOM reaches the bottom of the screen (you
      // hit the END of the cards); then the stage PINS so the video can expand over
      // a frozen bento. CSS `position:sticky` CANNOT do this — a sticky element
      // taller than the viewport never sticks (verified). So we pin manually with
      // `position:fixed` (compositor-driven, no per-frame JS, so NO rubber-band lag
      // like the earlier translateY had), locking #services' height first so taking
      // the stage out of flow doesn't collapse the page. We track the pin window
      // from the section's BOTTOM edge — #services has padding-bottom = ROOM.
      const mobileStage = document.getElementById("services-stage");
      const sr = services.getBoundingClientRect();
      let scroll0: number;
      let expandDist: number;
      let wantActive: boolean;
      if (mq.matches) {
        const ROOM = 0.8 * vh; // must match #services padding-bottom (80svh)
        scroll0 = Math.max(0, vh + ROOM - sr.bottom);
        expandDist = Math.max(1, ROOM);
        wantActive = scroll0 > 0;
      } else {
        scroll0 = Math.max(0, -sr.top);
        expandDist = Math.max(1, sr.height - vh);
        wantActive = sr.top <= 0.5 * vh;
      }
      if (!wantActive) {
        reset(tile);
        return;
      }
      // active again — re-arm reset() so it fires once when we next go inactive
      settledInactive = false;

      // MOBILE PIN: the instant we enter the window (bento bottom at screen bottom),
      // FREEZE the stage at the viewport bottom with position:fixed. Lock the
      // section height first so removing the stage from flow doesn't shift the page.
      // Once fixed the browser keeps it frozen on the compositor — the bento stays
      // rock-still while the rest of the page scrolls and the video expands.
      // NOTE: the mobile CSS sets `#services-stage{position:static!important}` and
      // `#services{height:auto!important}` (to beat the desktop inline styles), so
      // these MUST be written with `important` priority or the !important CSS wins
      // and the stage never actually pins.
      if (mq.matches && mobileStage && mobileStage.style.position !== "fixed") {
        services.style.setProperty("height", services.offsetHeight + "px", "important");
        mobileStage.style.setProperty("position", "fixed", "important");
        mobileStage.style.setProperty("left", "0", "important");
        mobileStage.style.setProperty("right", "0", "important");
        mobileStage.style.setProperty("bottom", "0", "important");
        mobileStage.style.setProperty("top", "auto", "important");
        mobileStage.style.setProperty("width", "100%", "important");
      }

      const p = clamp01(scroll0 / expandDist);

      // The tile is held in place by the pin, so its rect already gives the FROZEN
      // on-screen position the overlay expands from.
      const qr = tile.getBoundingClientRect();

      // No dark backdrop needed: the bento PINS on both widths now, so the video
      // expands OVER the frozen bento (just like desktop) — no white gaps to hide.
      if (backdropRef.current) backdropRef.current.style.opacity = "0";

      // The clip stays a still frame in the bento tile (p≈0), then PLAYS as soon as
      // it begins expanding — the user wants the footage already running while the
      // card is mid-expand (it continues from the still it was paused on), not only
      // once it's fullscreen. It keeps playing through the conveyor + lift.
      if (ovVideo) {
        if (p >= 0.06) {
          if (ovVideo.paused) {
            const pr = ovVideo.play();
            if (pr && typeof pr.catch === "function") pr.catch(() => {});
          }
        } else if (!ovVideo.paused) {
          ovVideo.pause();
        }
      }

      // End-of-Cazuri → Contact hand-off (BOTH widths reveal Contact, which sits
      // BENEATH the overlay at z5 < z6): desktop lifts via `top` + a peel-up
      // flourish; mobile lifts via a cheap GPU `translateY`. See the branch below.
      const contact = document.getElementById("contact");
      const contactTop = contact ? contact.getBoundingClientRect().top : vh;
      const lift = Math.min(0, contactTop - vh); // 0 → -vh as Contact rises in
      const liftP = clamp01((vh - contactTop) / vh);

      // expand from the tile's own (pinned) rect → fullscreen by p, on both widths.
      const srcTop = qr.top;
      tile.style.visibility = "hidden";
      overlay.style.display = "block";
      overlay.style.left = lerp(qr.left, 0, p) + "px";
      overlay.style.width = lerp(qr.width, vw, p) + "px";
      overlay.style.height = lerp(qr.height, vh, p) + "px";
      // all corners share the expand radius (rounded tile → square fullscreen)…
      const er = lerp(18, 0, p);
      overlay.style.borderRadius = er + "px";

      if (mq.matches) {
        // MOBILE: reveal Contact by sliding the fullscreen video UP with a cheap
        // GPU transform (translateY — no repaint, no lag). Contact sits BENEATH it
        // (its own z-index) and is uncovered as the video clears the screen, its
        // bottom edge tracking Contact's top edge for a seamless hand-off. We do
        // this instead of the old "Contact slides OVER via z-index" trick, which
        // relied on a portaled fixed overlay's stacking order and silently failed
        // on real mobile browsers — leaving Contact hidden ("page ends at Cazuri").
        overlay.style.top = lerp(srcTop, 0, p) + "px";
        // EXACT tracking: the video's bottom edge sits right on Contact's top edge
        // (no multiplier) so there's no empty slate band between them. Contact is
        // ≥100vh tall (globals.css) so contactTop reaches 0 and the video clears
        // the screen fully at the bottom.
        overlay.style.transform = `translateY(${Math.max(-vh, lift).toFixed(1)}px)`;
        overlay.style.boxShadow = "";
        overlay.style.borderBottomLeftRadius = "";
        overlay.style.borderBottomRightRadius = "";
        overlay.style.opacity = "";
        // A PLAYING <video> renders on a hardware layer that ignores border-radius +
        // overflow:hidden on mobile, so its corners stayed SHARP during the expand.
        // clip-path clips composited layers too — round all four corners by `er`.
        overlay.style.clipPath = `inset(0 round ${er.toFixed(1)}px)`;
      } else {
        // DESKTOP: lift via top + the "peel up" shrink/round/shadow/fade flourish
        // (corners + shrink share the same normalised lift progress).
        overlay.style.top = lerp(srcTop, 0, p) + lift + "px";
        const lp = Math.min(1, liftP * 2.5);
        const r = Math.max(er, 44 * lp).toFixed(1) + "px";
        overlay.style.borderBottomLeftRadius = r;
        overlay.style.borderBottomRightRadius = r;
        // clip-path so the playing video is actually clipped to the corners (top
        // corners = er, bottom corners = the bigger peel radius r).
        overlay.style.clipPath = `inset(0 round ${er.toFixed(1)}px ${er.toFixed(1)}px ${r} ${r})`;
        overlay.style.boxShadow =
          liftP > 0.01 ? `inset 0 0 0 1.5px rgba(255,255,255,${(0.4 * lp).toFixed(2)})` : "";
        overlay.style.transform = `scale(${(1 - 0.05 * lp).toFixed(4)})`;
        overlay.style.opacity = liftP > 0.5
          ? Math.max(0, 1 - (liftP - 0.5) * 2).toFixed(3)
          : "";
      }

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
      // Conveyor hasn't started yet (still expanding) — park everything hidden
      // ONCE and skip the per-frame card/word writes. This is the key mobile fix
      // for the "video card transition is laggy" phase.
      if (past <= 0) {
        if (!conveyorIdle) {
          conveyorIdle = true;
          for (let k = 0; k < n; k++) {
            cards[k].style.transform = "translateY(140%)";
            cards[k].style.opacity = "0";
            const data = ovBlockData[k];
            if (!data) continue;
            data.block.style.opacity = "0";
            data.words.forEach((w) => (w.style.opacity = "0"));
            if (data.author) data.author.style.opacity = "0";
          }
        }
        return;
      }
      conveyorIdle = false;
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
    // `t` is a dep so that on a language switch the effect re-resolves the
    // overlay's word/quote/card nodes (their text — and word count — changed) and
    // re-applies the scroll-driven opacities; otherwise the new text stays hidden.
  }, [mounted, t]);

  return (
    <>
      {/* Empty tall track — it supplies the scroll room for the fixed
          expand→conveyor overlay (desktop AND mobile both use the overlay). */}
      <section
        id="cases"
        data-screen-label="Cazuri"
        style={{ position: "relative", background: "#fbfbfb", height: `${TRACK_VH}svh` }}
      >
        {/* Legacy stacked fallback — NOT shown (the overlay drives Cazuri on every
            width). Kept for reference; preload="none" so its video never loads. */}
        <div id="cazuri-mobile" style={{ display: "none" }}>
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
              muted
              loop
              playsInline
              preload="none"
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
            {cases.map((c, i) => (
              <figure key={i} style={{ margin: "0 0 clamp(40px, 10vw, 64px)" }}>
                <BeforeAfterStack c={c} t={t} variant="solid" before={`/${i + 1}-before.webp`} after={`/${i + 1}-after.webp`} />
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
        <AutoplayVideo controlled loop poster="/clinic-office.webp" preload="auto" src="/video-card.mp4" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        {/* ONE black gradient over the whole clip — dark enough that ALL the white
            text (title + testimonials) reads white wherever it sits, instead of
            per-text dark blocks behind each one. Darkest at the top (title), still
            strong through the upper-middle (where the testimonials reveal), eased a
            little lower so the footage breathes, dark again at the bottom for the
            before/after card. */}
        <div className="ov-grad" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,11,16,0.72) 0%, rgba(8,11,16,0.64) 28%, rgba(8,11,16,0.56) 50%, rgba(8,11,16,0.4) 68%, rgba(8,11,16,0.32) 80%, rgba(8,11,16,0.58) 100%)" }} />

        {/* one testimonial (left) + one card (right) per case, stacked */}
        {cases.map((c, i) => {
          const words = c.testimonial.quote.split(" ");
          return (
            <div key={i}>
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
                <BeforeAfterStack c={c} t={t} variant="glass" before={`/${i + 1}-before.webp`} after={`/${i + 1}-after.webp`} />
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
  before,
  after,
}: {
  c: Case;
  t: ReturnType<typeof useContent>;
  variant: "glass" | "solid";
  before: string;
  after: string;
}) {
  const glass = variant === "glass";
  const imgWrap = {
    position: "relative",
    aspectRatio: "16 / 10",
    borderRadius: 10,
    overflow: "hidden",
    background: glass ? "rgba(8,11,16,0.5)" : "#eceef0",
  } as const;
  // small corner pill labelling each photo (Înainte / După)
  const tag = {
    position: "absolute",
    left: 8,
    top: 8,
    zIndex: 2,
    padding: "3px 9px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.02em",
    color: "#fbfbfb",
    background: "rgba(12,16,21,0.62)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
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
        <ImageSlot src={before} caption={`${c.title} — ${t.cases.before}`} shape="rect" dark={glass} showLabel={false} />
        <span style={tag}>{t.cases.before}</span>
      </div>
      <div className="ba-imgwrap" style={imgWrap}>
        <ImageSlot src={after} caption={`${c.title} — ${t.cases.after}`} shape="rect" dark={glass} showLabel={false} />
        <span style={tag}>{t.cases.after}</span>
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
