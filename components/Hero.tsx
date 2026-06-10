"use client";
import Image from "next/image";
import { CLINIC_NAME, PLACEHOLDERS } from "@/lib/constants";

export default function Hero() {
  return (
    <section className="relative h-screen w-full">
      <Image
        src={PLACEHOLDERS.heroImageMobile}
        alt={`Echipa ${CLINIC_NAME}`}
        fill
        sizes="100vw"
        className="object-cover object-center md:hidden"
        priority
      />
      <Image
        src={PLACEHOLDERS.heroImage}
        alt={`Clinica stomatologică ${CLINIC_NAME}`}
        fill
        sizes="100vw"
        className="hidden object-cover md:block"
        priority
      />

      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none h-[55%] sm:h-[48%] md:h-[42%] bg-gradient-to-t from-black/90 via-black/55 to-transparent"
        aria-hidden="true"
      />
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-10 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-primary text-[1.65rem] leading-snug sm:text-4xl sm:leading-tight lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              <span className="whitespace-nowrap sm:whitespace-normal">Zâmbetul tău, prioritatea noastră:</span>
              <br className="sm:hidden" />
              <span> tratamente moderne, rezultate naturale.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/90 mb-5 drop-shadow-md max-w-xl">
              Implanturi, estetică dentară și îngrijire preventivă pentru copii și adulți — la {CLINIC_NAME}.
            </p>
            <a
              href="#contact"
              className="inline-block bg-[var(--color-brand-teal)] text-white px-7 py-2.5 rounded-full uppercase font-semibold text-sm text-center hover:brightness-90 transition-all shadow-lg"
            >
              Programează o consultație
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
