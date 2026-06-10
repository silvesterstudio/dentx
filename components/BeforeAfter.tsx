"use client";
import Image from "next/image";

const cases = [
  { before: "/1-before.jpg", after: "/1-after.jpg" },
  { before: "/2-before.jpg", after: "/2-after.jpg" },
  { before: "/3-before.jpg", after: "/3-after.jpg" },
  { before: "/4-before.jpg", after: "/4-after.jpg" },
];

function CaseCard({ c, index }: { c: (typeof cases)[0]; index: number }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-[var(--color-brand-muted)] h-full">
      <div className="flex justify-start items-center mb-4">
        <span className="text-xs uppercase font-bold text-black bg-gray-200 px-2 py-1 rounded">Înainte</span>
      </div>
      <div className="relative h-40 rounded-lg mb-4 overflow-hidden bg-gray-200">
        <Image src={c.before} alt={`Înainte cazul ${index + 1}`} fill className="object-cover" sizes="85vw" />
      </div>
      <div className="flex justify-start items-center mb-4">
        <span className="text-xs uppercase font-bold text-white bg-[var(--color-brand-teal)] px-2 py-1 rounded">După</span>
      </div>
      <div className="relative h-40 rounded-lg overflow-hidden bg-gray-300">
        <Image src={c.after} alt={`După cazul ${index + 1}`} fill className="object-cover" sizes="85vw" />
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  return (
    <section id="beforeafter" className="py-6 md:py-20 bg-[var(--color-brand-grey)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-primary text-[1.65rem] leading-snug sm:text-4xl sm:leading-tight lg:text-4xl font-bold text-center text-[var(--color-brand-black)] mb-6 md:mb-8">
          Cazuri clinice rezolvate cu <span className="text-[var(--color-brand-teal)]">succes</span>
        </h2>

        {/* Mobile: horizontal swipe slider */}
        <div className="md:hidden -mx-4">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 scroll-pr-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {cases.map((c, i) => (
              <div
                key={i}
                className="shrink-0 w-[85vw] max-w-sm snap-center first:ml-4 last:mr-4"
              >
                <CaseCard c={c} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={i} c={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
