import Image from "next/image";
import { Smile, Sparkles, ShieldCheck } from "lucide-react";
import { CLINIC_NAME } from "@/lib/constants";

const introText =
  "La Dent-X combinăm tehnologie de ultimă generație cu o abordare umană. Fiecare tratament este planificat clar, transparent și adaptat nevoilor tale.";

const sectionHeadingClass =
  "font-primary text-[1.65rem] leading-snug sm:text-4xl sm:leading-tight lg:text-4xl font-bold";

export default function About() {
  return (
    <section id="about" className="py-6 md:py-20 bg-[var(--color-brand-grey)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-x-8 md:gap-y-4 items-start">
          <div className="order-1 md:col-start-1 md:row-start-1">
            <h2 className={`${sectionHeadingClass} text-[var(--color-brand-black)] mb-0`}>
              {CLINIC_NAME}: stomatologie modernă pentru întreaga familie
            </h2>
            <p className="hidden md:block mt-3 text-[var(--color-brand-black)]/80 leading-relaxed">{introText}</p>
          </div>

          <div className="order-2 md:col-start-2 md:row-start-1 md:row-span-2 relative w-full aspect-[16/9] md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/under-hero.jpg"
              alt={`Clinica ${CLINIC_NAME}`}
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="order-3 md:col-start-1 md:row-start-2">
            <p className="md:hidden text-[var(--color-brand-black)]/80 mb-6 leading-relaxed">{introText}</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Sparkles className="text-[var(--color-brand-teal)] w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[var(--color-brand-black)]">Dr. Alex Rusu</span>
                  <p className="text-sm text-[var(--color-brand-black)]/70">
                    Implantologie și chirurgie orală — soluții durabile, cu recuperare rapidă
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Smile className="text-[var(--color-brand-teal)] w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[var(--color-brand-black)]">Dr. Maria Ceban</span>
                  <p className="text-sm text-[var(--color-brand-black)]/70">
                    Estetică dentară și ortodonție — zâmbete naturale, tratamente confortabile
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-[var(--color-brand-teal)] w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-[var(--color-brand-black)]">Abordare integrată</span>
                  <p className="text-sm text-[var(--color-brand-black)]/70">
                    Plan de tratament personalizat, de la consultație la control post-tratament
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#services"
                className="border-2 border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] px-6 py-3 rounded-full uppercase font-semibold text-center hover:bg-[var(--color-brand-teal)] hover:text-white transition-all"
              >
                Serviciile Noastre
              </a>
              <a
                href="#contact"
                className="bg-[var(--color-brand-teal)] text-white px-6 py-3 rounded-full uppercase font-semibold text-center hover:brightness-90 transition-all"
              >
                Programează o consultație
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
