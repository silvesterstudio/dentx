"use client";

import { useEffect, useRef, useState } from "react";

// Replace with Dent-X Instagram reel embed URLs in components/Reviews.tsx
const reelUrls = [
  "https://www.instagram.com/reel/DWnrhvaCNu7/embed",
  "https://www.instagram.com/reel/DYjbu67I4ji/embed",
  "https://www.instagram.com/reel/DWOOvZkiC3B/embed",
];

const EMBED_WIDTH = 389;
const EMBED_HEIGHT = 530;

function InstagramEmbed({ url }: { url: string }) {
  return (
    <div className="absolute inset-0" style={{ top: "0%", height: "108%" }}>
      <iframe
        src={url}
        className="h-full w-full"
        scrolling="no"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        loading="lazy"
        style={{ border: 0, overflow: "hidden" }}
        title="Recenzie Instagram"
      />
    </div>
  );
}

function InstagramCard({ url, className }: { url: string; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-300 ${className ?? ""}`}
      style={{ height: EMBED_HEIGHT }}
    >
      <InstagramEmbed url={url} />
    </div>
  );
}

/** Renders embed at 389×530 then scales down to fit container — keeps 108% crop identical to desktop */
function MobileInstagramCard({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      setScale(Math.min(1, el.offsetWidth / EMBED_WIDTH));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden rounded-2xl bg-gray-900 border border-gray-300"
      style={{ height: EMBED_HEIGHT * scale }}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: EMBED_WIDTH,
          height: EMBED_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        <InstagramEmbed url={url} />
      </div>
    </div>
  );
}

export default function Reviews() {
  return (
    <section className="py-6 md:py-20 pb-6 md:pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-primary text-[1.65rem] leading-snug sm:text-4xl sm:leading-tight lg:text-4xl font-bold text-center text-[var(--color-brand-black)] mb-6 md:mb-8">
          Recenziile pacienților <span className="text-[var(--color-brand-teal)]">clinicii</span>
        </h2>

        {/* Mobile: one card per screen, scaled to fit while keeping desktop embed crop */}
        <div className="md:hidden -mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {reelUrls.map((url, i) => (
              <div
                key={i}
                className="shrink-0 snap-center w-[calc(100vw-2rem)] max-w-[389px]"
              >
                <MobileInstagramCard url={url} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: unchanged grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {reelUrls.map((url, i) => (
            <InstagramCard key={i} url={url} className="w-full" />
          ))}
        </div>
      </div>
    </section>
  );
}
