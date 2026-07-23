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
    // Holds the pending warm-up "park it back" timeout so the real expand can
    // cancel it (see warmUp() below). Declared HERE — above update() — because
    // update() reads it, and update() is called synchronously at the end of this
    // effect BEFORE its old declaration site further down. On a fresh load at the
    // top of the page update() early-returns (inactive) before touching it, so the
    // temporal-dead-zone was hidden; but a language switch WHILE on the last two
    // sections re-runs this effect with the overlay already active, so update()
    // reached the access before init and threw "Cannot access 'warmSettle' before
    // initialization", crashing the page. Hoisting the `let` fixes it.
    let warmSettle = 0;

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
    // The driven sections are stable DOM for this effect's lifetime (a language
    // switch re-runs the effect) — resolve them once, not 4× per scroll frame.
    const tile = document.getElementById("quote-tile");
    const services = document.getElementById("services");
    const contact = document.getElementById("contact");
    const mobileStage = document.getElementById("services-stage");
    if (!tile || !services) return;

    // --- per-frame write guards -------------------------------------------
    // The conveyor/lift math recomputes every card/word/author opacity on every
    // scroll frame, but the VALUES only change for the one case currently in its
    // window — the rest re-wrote identical strings (~150 CSSOM writes/frame,
    // each a potential style invalidation). Cache the last written value per
    // node and skip no-op writes. Caches (not style read-backs) because CSS
    // serialisation trims numbers ("140.00%" → "140%"), so a read-back compare
    // would never match and we'd rewrite every frame anyway. Initialised from
    // the current inline styles so a language-switch re-run stays in sync with
    // whatever the previous effect instance left in the DOM.
    const cardLast = ovCards.map((c) => ({ t: c.style.transform, o: c.style.opacity }));
    const blockLast = ovBlockData.map((d) => ({
      o: d.block.style.opacity,
      a: d.author ? d.author.style.opacity : "",
      w: d.words.map((w) => w.style.opacity),
    }));
    let lastOvT = overlay.style.transform;
    let lastOvO = overlay.style.opacity;
    let lastClip = overlay.style.clipPath;
    let lastGradOp = ovGrad ? ovGrad.style.opacity : "";
    let lastCapOp = ovCaption ? ovCaption.style.opacity : "";
    const setCard = (k: number, transform: string, opacity: string) => {
      const s = cardLast[k];
      if (s.t !== transform) {
        s.t = transform;
        ovCards[k].style.transform = transform;
      }
      if (s.o !== opacity) {
        s.o = opacity;
        ovCards[k].style.opacity = opacity;
      }
    };
    const setBlockOp = (k: number, v: string) => {
      if (blockLast[k].o !== v) {
        blockLast[k].o = v;
        ovBlockData[k].block.style.opacity = v;
      }
    };
    const setAuthorOp = (k: number, v: string) => {
      const a = ovBlockData[k].author;
      if (a && blockLast[k].a !== v) {
        blockLast[k].a = v;
        a.style.opacity = v;
      }
    };
    const setWordOp = (k: number, i: number, v: string) => {
      const arr = blockLast[k].w;
      if (arr[i] !== v) {
        arr[i] = v;
        ovBlockData[k].words[i].style.opacity = v;
      }
    };
    const setOvTransform = (v: string) => {
      if (lastOvT !== v) {
        lastOvT = v;
        overlay.style.transform = v;
      }
    };
    const setOvOpacity = (v: string) => {
      if (lastOvO !== v) {
        lastOvO = v;
        overlay.style.opacity = v;
      }
    };
    const setClip = (v: string) => {
      if (lastClip !== v) {
        lastClip = v;
        overlay.style.clipPath = v;
      }
    };
    const setGradOp = (v: string) => {
      if (ovGrad && lastGradOp !== v) {
        lastGradOp = v;
        ovGrad.style.opacity = v;
      }
    };
    const setCapOp = (v: string) => {
      if (ovCaption && lastCapOp !== v) {
        lastCapOp = v;
        ovCaption.style.opacity = v;
      }
    };
    // Geometry is written as whole-px strings ("123px"), which round-trip
    // exactly through the CSSOM — so the inline style itself is the cache
    // (reading .style never forces layout).
    const setPx = (prop: "left" | "top" | "width" | "height", px: number) => {
      const v = px + "px";
      if (overlay.style[prop] !== v) overlay.style[prop] = v;
    };
    // Per-frame counter-transforms for the static-size morph (see update()).
    // The video element is re-sized ONCE to the source-aspect cover box; whole-px
    // strings round-trip the CSSOM exactly, so the style is its own cache.
    const setVidPx = (prop: "width" | "height", px: number) => {
      const v = px + "px";
      if (ovVideo && ovVideo.style[prop] !== v) ovVideo.style[prop] = v;
    };
    let lastVidT = ovVideo ? ovVideo.style.transform : "";
    let lastGradT = ovGrad ? ovGrad.style.transform : "";
    const setVideoT = (v: string) => {
      if (ovVideo && lastVidT !== v) {
        lastVidT = v;
        ovVideo.style.transform = v;
      }
    };
    const setGradT = (v: string) => {
      if (ovGrad && lastGradT !== v) {
        lastGradT = v;
        ovGrad.style.transform = v;
      }
    };
    // the counter-transform maths assume a top-left origin on both layers
    if (ovVideo) ovVideo.style.transformOrigin = "0 0";
    if (ovGrad) ovGrad.style.transformOrigin = "0 0";

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
    // DESKTOP peel flourish (shadow/scale/fade) only applies once Contact starts
    // rising. This tracks whether it's currently written so the pure-expand phase
    // can clear it ONCE instead of re-writing neutral values every scroll frame.
    let peelActive = false;
    const reset = (tile: HTMLElement) => {
      if (settledInactive) return;
      settledInactive = true;
      conveyorIdle = false;
      ovVideo?.pause(); // back to a still frame when the overlay isn't in play
      overlay.style.display = "none";
      setClip("");
      // clear the desktop peel flourish so a later re-expand starts neutral
      peelActive = false;
      setOvTransform("");
      setOvOpacity("");
      setVideoT("");
      setGradT("");
      // back to the JSX inset:0/100% sizing while the overlay is parked
      if (ovVideo) {
        ovVideo.style.width = "";
        ovVideo.style.height = "";
      }
      tile.style.visibility = "";
      // release the mobile fixed-position pin (the stage returns to normal flow).
      // removeProperty so the !important-priority inline values set on pin-enter are
      // fully cleared (falling back to the static-flow CSS).
      // MOBILE-ONLY: on DESKTOP the stage's position:sticky/top/height and #services'
      // height are React INLINE styles (Services.tsx) — clearing them here would
      // strip the desktop pin (React won't re-apply, so the expand would never run).
      if (mq.matches) {
        if (mobileStage) {
          mobileStage.style.removeProperty("position");
          mobileStage.style.removeProperty("left");
          mobileStage.style.removeProperty("right");
          mobileStage.style.removeProperty("bottom");
          mobileStage.style.removeProperty("top");
          mobileStage.style.removeProperty("width");
        }
        services.style.removeProperty("height"); // drop the height lock taken on pin-enter
      }
      if (backdropRef.current) backdropRef.current.style.opacity = "0";
      ovCaption?.classList.remove("play");
      ovCards.forEach((_, k) => setCard(k, "translateY(140%)", "0"));
    };

    const update = () => {
      raf = 0;
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
      // If a background warm-up is still parked as a near-invisible fullscreen
      // overlay, cancel it and drop its 0.001 opacity NOW — the real expand is
      // taking over, and leaving the warm opacity would render it invisible.
      if (warmSettle) {
        clearTimeout(warmSettle);
        warmSettle = 0;
      }
      if (lastOvO === "0.001") setOvOpacity("");

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
      const bd = backdropRef.current;
      if (bd && bd.style.opacity !== "0") bd.style.opacity = "0";

      // The clip is FROZEN on a still frame (paused — cheap to just scale) for the
      // WHOLE expand and only starts playing once it's essentially fullscreen.
      // Decoding video WHILE the overlay is scaled + composited every scroll frame
      // was the scroll lag during the expand — pausing until p≈1 is the single
      // biggest win for the morph's smoothness. It then keeps playing through the
      // conveyor + lift (p stays clamped at 1).
      if (ovVideo) {
        if (p >= 0.985) {
          if (ovVideo.paused) {
            const pr = ovVideo.play();
            if (pr && typeof pr.catch === "function") pr.catch(() => {});
          }
        } else if (!ovVideo.paused) {
          ovVideo.pause();
        }
      }

      // End-of-Cazuri → Contact hand-off (BOTH widths reveal Contact, which sits
      // BENEATH the overlay at z5 < z6): both widths lift via a cheap GPU
      // `translateY` (desktop adds the peel-up flourish). See the branch below.
      const contactTop = contact ? contact.getBoundingClientRect().top : vh;
      const lift = Math.min(0, contactTop - vh); // 0 → -vh as Contact rises in
      const liftP = clamp01((vh - contactTop) / vh);

      // expand from the tile's own (pinned) rect → fullscreen by p, on both widths.
      const srcTop = qr.top;
      if (tile.style.visibility !== "hidden") tile.style.visibility = "hidden";
      if (overlay.style.display !== "block") overlay.style.display = "block";
      // the reveal window (tile → fullscreen), quantised to whole px so many
      // scroll frames land on the same value and skip work.
      const wx = Math.round(lerp(qr.left, 0, p));
      const wy = Math.round(lerp(srcTop, 0, p));
      const ww = Math.max(1, Math.round(lerp(qr.width, vw, p)));
      const wh = Math.max(1, Math.round(lerp(qr.height, vh, p)));
      // all corners share the expand radius (rounded tile → square fullscreen)
      const er = Math.round(lerp(18, 0, p));

      if (mq.matches) {
        // MOBILE — BOX-RESIZE morph. A CSS transform applied to a <video> blanks
        // its hardware video surface on many mobile browsers, so the expand
        // rendered the overlay's #28323f background instead of the clip (the
        // "just a dark blue box" bug). So on mobile the OVERLAY BOX itself
        // resizes tile→fullscreen and the video fills it at 100% with NO
        // transform — the original mobile path, which was already smooth (mobile
        // never had the desktop expand lag; the static-size morph below is the
        // desktop-only perf win). Clear any video transform/size the desktop
        // branch may have left, then size the box to the window.
        setVideoT("");
        if (ovVideo && ovVideo.style.width) {
          ovVideo.style.width = "";
          ovVideo.style.height = "";
        }
        setGradT("");
        setPx("left", wx);
        setPx("top", wy);
        setPx("width", ww);
        setPx("height", wh);
        // Reveal Contact by sliding the box UP (compositor translateY — no
        // repaint). Contact sits BENEATH it (z5 < z6) and is uncovered as the
        // video clears the screen, its bottom edge tracking Contact's top edge.
        setOvTransform(`translateY(${Math.max(-vh, lift).toFixed(1)}px)`);
        setOvOpacity("");
        // A PLAYING <video> ignores border-radius on mobile; clip-path clips the
        // composited layer too, so round the corners with it (er → 0 at full).
        setClip(`inset(0 round ${er}px)`);
      } else {
        // DESKTOP — STATIC-SIZE morph. The overlay box is parked at FULLSCREEN
        // for the whole expand (these writes are no-ops after the first frame)
        // and the tile→fullscreen window is carved out per frame with clip-path,
        // while the video + gradient are counter-transformed so the window's
        // content is pixel-identical to a resizing box. Why: the old morph
        // resized a promoted fullscreen layer every frame, forcing the GPU to
        // re-allocate + re-rasterise the overlay/gradient textures per frame —
        // the residual expand lag. clip-path + transforms are compositor-side, so
        // NOTHING re-rasterises during the morph. (Desktop renders a transformed
        // <video> correctly, unlike mobile — hence the split.)
        setPx("left", 0);
        setPx("top", 0);
        setPx("width", vw);
        setPx("height", vh);
        // Counter-map the video onto the window so it renders exactly as
        // object-fit:cover WITHIN the window. The element is parked at the SOURCE
        // aspect ratio at fullscreen-cover size (so the full source is available
        // for a differently-shaped window's cover-crop), then a uniform scale
        // k = coverScale(window)/coverScale(fullscreen) with aligned centres
        // reproduces the crop; the clip-path does the cropping. Identity at p=1,
        // so the caches skip these writes through the conveyor + lift.
        const ar = ovVideo && ovVideo.videoWidth > 0 ? ovVideo.videoWidth / ovVideo.videoHeight : 16 / 9;
        const coverW = Math.round(Math.max(vw, vh * ar));
        const coverH = Math.round(Math.max(vh, vw / ar));
        setVidPx("width", coverW); // layout writes only on resize / metadata load
        setVidPx("height", coverH);
        const k = Math.max(ww / coverW, wh / coverH);
        setVideoT(
          `translate(${(wx + (ww - k * coverW) / 2).toFixed(1)}px, ${(wy + (wh - k * coverH) / 2).toFixed(1)}px) scale(${k.toFixed(4)})`,
        );
        // The gradient (fullscreen-sized) is non-uniformly scaled onto the window
        // — linear gradients scale linearly, so the result is identical.
        setGradT(
          ww === vw && wh === vh && wx === 0 && wy === 0
            ? ""
            : `translate(${wx}px, ${wy}px) scale(${(ww / vw).toFixed(4)}, ${(wh / vh).toFixed(4)})`,
        );
        const windowClip = `inset(${wy}px ${vw - wx - ww}px ${vh - wy - wh}px ${wx}px round ${er}px)`;
        // "peel up" lift — translateY + shrink/round/fade flourish.
        if (liftP > 0) {
          peelActive = true;
          const lp = Math.min(1, liftP * 2.5);
          // Bottom corners round via clip-path alone (quantised to whole px, so
          // the clip mask updates ~44× across the lift, not every frame).
          const r = Math.max(er, Math.round(44 * lp));
          setClip(`inset(0 round ${er}px ${er}px ${r}px ${r}px)`);
          setOvTransform(
            `translateY(${lift.toFixed(1)}px) scale(${(1 - 0.05 * lp).toFixed(4)})`,
          );
          setOvOpacity(
            liftP > 0.5 ? Math.max(0, 1 - (liftP - 0.5) * 2).toFixed(3) : "",
          );
        } else {
          // PURE EXPAND (Contact not yet rising): the window clip. Dropping back
          // out of the lift (peelActive) restores the neutral transform/opacity.
          setClip(windowClip);
          if (peelActive) {
            peelActive = false;
            setOvTransform("");
            setOvOpacity("");
          }
        }
      }

      // fade the case content out as the card lifts, so the rising video is clean.
      const sf = 1 - liftP;
      // also fade the video's heavy bottom gradient so the bright clinic footage
      // shows at the edge — that contrast makes the rounding corners read clearly.
      setGradOp(liftP > 0 ? Math.max(0.15, 1 - liftP * 2).toFixed(3) : "");

      // title reveal (CSS-timed); fade out during the lift.
      ovCaption?.classList.toggle("play", p >= 0.9);
      setCapOp(liftP > 0 ? sf.toFixed(3) : "");

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
            setCard(k, "translateY(140%)", "0");
            // display:none the before/after glass cards + quote blocks for the WHOLE
            // morph. They're already invisible here (off-screen + opacity 0), but
            // while merely parked they stay in the layout tree — so every frame the
            // overlay resizes, the browser re-laid-out all 3 backdrop-filter glass
            // cards (blur is the most expensive paint on the page). Pulling them out
            // of layout entirely removes that per-frame cost during the expand; the
            // conveyor restores them (below) the instant it begins.
            cards[k].style.display = "none";
            const data = ovBlockData[k];
            if (!data) continue;
            setBlockOp(k, "0");
            data.block.style.display = "none";
            data.words.forEach((_, i) => setWordOp(k, i, "0"));
            setAuthorOp(k, "0");
          }
        }
        return;
      }
      if (conveyorIdle) {
        // conveyor is starting — put the cards/blocks back into layout ONCE.
        conveyorIdle = false;
        for (let k = 0; k < n; k++) {
          cards[k].style.display = "";
          const data = ovBlockData[k];
          if (data) data.block.style.display = "";
        }
      }
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
        const fadeIn = clamp01(localK / (move * 0.5));
        const fadeOut = isLast ? 1 : clamp01((move + hold + moveOut - localK) / moveOut);
        setCard(
          k,
          `translateY(${ty.toFixed(2)}%)`,
          String((localK <= 0 ? 0 : Math.min(fadeIn, fadeOut)) * sf),
        );

        const data = ovBlockData[k];
        if (!data) continue;
        const ws = data.words;
        const bIn = clamp01((localK - move * 0.6) / (move * 0.5));
        const bOut = isLast ? 1 : clamp01((move + hold + moveOut * 0.6 - localK) / (moveOut * 0.6));
        setBlockOp(k, String((localK <= 0 ? 0 : Math.min(bIn, bOut)) * sf));
        // words reveal ONLY during the Hold (i.e. after the card has stopped)
        const tp = clamp01((localK - move) / hold);
        const head = tp * (ws.length + 4);
        for (let i = 0; i < ws.length; i++) setWordOp(k, i, String(clamp01(head - i)));
        setAuthorOp(k, String(clamp01((tp - 0.9) / 0.1)));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();

    // FIRST-EXPAND WARM-UP. The overlay subtree (fullscreen video, the
    // before/after photos, glass cards with backdrop-filter) sits display:none
    // until the first expand — so the FIRST expand paid image decode + blur
    // layer creation + video-decoder init all at once, right in the middle of
    // the morph (the user reported the expand lags only the FIRST time; the
    // second run is smooth because every cache is warm by then — and that they
    // could MAKE it smooth by scrolling down to the before/after images once,
    // then back). Paint the whole subtree ONCE at near-zero opacity during idle
    // time so all that cold work happens invisibly long before Servicii.
    let warmed = false;
    // warmSettle is declared at the top of this effect (above update()) — see the
    // note there for why it can't live here anymore.
    const warmUp = () => {
      if (warmed) return;
      warmed = true;
      // Warm the SERVICES BENTO images FIRST — the actual first-expand culprit,
      // and independent of the overlay's state (so it runs even on the deep-link
      // path below). The 9 bento tiles use next/image (LAZY) and sit UNDECODED at
      // the top of the page, yet they're painted BEHIND the video as it grows to
      // fullscreen. So on the FIRST expand all 9 decode mid-morph (main-thread
      // decode racing the geometry animation = the jank). Scrolling the whole page
      // once pre-decodes them — exactly why the user's SECOND expand was smooth.
      // Promote them to eager + kick off decode now, during idle, so the morph
      // never competes with a cold image decode. (eager + decode() don't depend on
      // viewport visibility, unlike the lazy IntersectionObserver, so this warms
      // them without any scroll.)
      document.querySelectorAll<HTMLImageElement>("#services-grid img").forEach((img) => {
        try {
          img.loading = "eager";
          if (typeof img.decode === "function") img.decode().catch(() => {});
        } catch {
          /* ignore — best-effort warm-up */
        }
      });
      // Same guarantee for the overlay's before/after photos. The on-screen
      // flash below only kicks off their lazy downloads — if the network takes
      // longer than the 500ms hold, the bitmaps used to arrive AFTER the park
      // and were then decoded mid-conveyor on first paint (the "first pass
      // through Cazuri lags, second is smooth" report). decode() waits for the
      // download to finish and then decodes off-screen, however long it takes.
      overlay.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
        try {
          img.loading = "eager";
          if (typeof img.decode === "function") img.decode().catch(() => {});
        } catch {
          /* ignore — best-effort warm-up */
        }
      });
      // already live (deep link straight into the expand) — the overlay is in play,
      // so skip the (invisible) overlay/card warm-up below; the bento is warmed above.
      if (!settledInactive) return;
      const vw2 = document.documentElement.clientWidth || 1;
      const vh2 = window.innerHeight || 1;
      overlay.style.display = "block";
      setOvOpacity("0.001");
      setPx("left", 0);
      setPx("top", 0);
      setPx("width", vw2);
      setPx("height", vh2);
      if (ovVideo) {
        const pr = ovVideo.play();
        if (pr && typeof pr.then === "function") {
          pr.then(() => {
            if (settledInactive) ovVideo.pause();
          }).catch(() => {});
        }
      }
      // Warm the before/after cards too — THIS is the piece the old warm-up
      // missed. Their photos are next/image LAZY (never even requested while the
      // card is parked off-screen at translateY(140%)) and their glass panels use
      // backdrop-filter (an expensive first paint). The whole overlay is at 0.001
      // opacity, so we can bring the cards fully on-screen with no visible flash —
      // that makes next/image's IntersectionObserver fire (kicking off the image
      // downloads + decodes) and forces the blur layers to rasterise once.
      ovCards.forEach((c, k) => {
        c.style.display = "";
        setCard(k, "translateY(0)", "1");
      });
      ovBlockData.forEach((d) => {
        d.block.style.display = "";
      });
      const park = () => {
        warmSettle = 0;
        setOvOpacity("");
        // return the cards to the parked (reset) state — decoded + cached now.
        ovCards.forEach((_, k) => setCard(k, "translateY(140%)", "0"));
        if (settledInactive) {
          overlay.style.display = "none";
          overlay.style.left = "";
          overlay.style.top = "";
          overlay.style.width = "";
          overlay.style.height = "";
        }
      };
      // Two frames trigger the lazy-image requests + first blur raster; then hold
      // briefly (decode-while-painted is guaranteed only while on-screen) so the
      // webp bitmaps finish decoding before we pull the overlay back out.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          warmSettle = window.setTimeout(park, 500);
        }),
      );
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    // Don't even SCHEDULE the idle warm-up until the hero intro reveal has fully
    // played out: requestIdleCallback happily grants idle time within the first
    // second of a fast load, so the warm-up's cold work (video-decoder init,
    // ~20 image decodes, first backdrop-blur rasters) used to land right in the
    // middle of the intro transitions — a big part of the "simple hero intro
    // lags" jank. 2.6s > the ~1.8s reveal, and nobody can scroll from the hero
    // to Servicii faster than the warm-up completes after that.
    let warmId: number | undefined;
    const warmDelay = window.setTimeout(() => {
      warmId = ric ? ric(warmUp, { timeout: 2500 }) : window.setTimeout(warmUp, 1500);
    }, 2600);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (warmSettle) clearTimeout(warmSettle);
      clearTimeout(warmDelay);
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (warmId !== undefined) {
        if (ric && cic) cic(warmId);
        else clearTimeout(warmId);
      }
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
          // Isolate the expanding overlay's per-frame size changes so they can't
          // force layout/paint work on the rest of the page (the video/cards/quote
          // subtree still relayouts, but the containment stops it leaking out).
          contain: "layout paint",
        }}
      >
        <AutoplayVideo controlled loop poster="/video-card-poster.webp" preload="auto" src="/video-card.mp4" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
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
