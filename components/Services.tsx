import Image from "next/image";
import { Sparkles, Smile } from "lucide-react";

const sectionHeadingClass =
  "font-primary text-[1.65rem] leading-snug sm:text-4xl sm:leading-tight lg:text-4xl font-bold";

export default function Servicii() {
  return (
    <section id="services" className="py-6 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6 md:gap-x-8 md:gap-y-4 items-start">
          <div className="order-1 md:col-start-2 md:row-start-1">
            <h2 className={`${sectionHeadingClass} text-[var(--color-brand-black)] mb-0 leading-tight`}>
              Servicii stomatologice pentru <span className="text-[var(--color-brand-teal)]">Toate Vârstele</span>
            </h2>
          </div>

          <div className="order-2 md:col-start-1 md:row-start-1 md:row-span-2 relative w-full aspect-[16/9] md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/under1-hero.png"
              alt="Servicii stomatologice Dent-X"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="order-3 md:col-start-2 md:row-start-2">
            <div className="bg-[var(--color-brand-grey)] rounded-2xl p-6 mb-4 border border-[var(--color-brand-muted)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-teal)]/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <h3 className="font-primary text-lg font-bold text-[var(--color-brand-black)]">
                  Implantologie & Estetică
                </h3>
              </div>
              <p className="text-[var(--color-brand-black)]/70 text-sm leading-relaxed">
                Implanturi dentare, fațete și albire profesională — realizate de <strong>Dr. Alex Rusu</strong>.
              </p>
            </div>

            <div className="bg-[var(--color-brand-grey)] rounded-2xl p-6 border border-[var(--color-brand-muted)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-brand-teal)]/20 flex items-center justify-center">
                  <Smile className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <h3 className="font-primary text-lg font-bold text-[var(--color-brand-black)]">
                  Ortodonție & Pedodonție
                </h3>
              </div>
              <p className="text-[var(--color-brand-black)]/70 text-sm leading-relaxed">
                Aparate dentare și tratamente blânde pentru copii, sub îndrumarea <strong>Dr. Maria Ceban</strong>.
              </p>
            </div>

            <div className="mt-6 md:mt-8">
              <a
                href="#beforeafter"
                className="block w-full sm:inline-block sm:w-auto border-2 border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] px-6 py-3 rounded-full uppercase font-semibold text-center hover:bg-[var(--color-brand-teal)] hover:text-white transition-all"
              >
                Citește mai mult
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
