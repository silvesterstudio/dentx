"use client";

import { MapPin, Phone, Clock, ChevronDown, Send } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

const cardClass = "bg-white rounded-2xl border border-[var(--color-brand-muted)] p-5 sm:p-6";

const inputClass =
  "w-full border border-[var(--color-brand-muted)] rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/20 transition-all bg-[var(--color-brand-grey)]";

export default function Contact() {
  return (
    <section id="contact" className="py-6 sm:py-16 md:py-20 bg-[var(--color-brand-grey)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
          <h2 className="font-primary text-[1.65rem] leading-snug sm:text-4xl sm:leading-tight lg:text-4xl font-bold text-[var(--color-brand-black)] mb-2 leading-tight">
            Programează o vizită
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[var(--color-brand-black)]/70 leading-relaxed">
            Ai grijă de zâmbetul familiei tale în siguranță. Suntem aici pentru tine.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Form — first on mobile for faster action */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className={cardClass}>
              <div className="flex gap-4 mb-5 sm:mb-6">
                <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--color-brand-teal)]/15 flex items-center justify-center">
                  <Send className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-black)]/50 mb-1">
                    Trimite o cerere
                  </p>
                  <p className="text-sm sm:text-base text-[var(--color-brand-black)]/80 leading-snug">
                    Completează formularul și te contactăm noi în cel mai scurt timp.
                  </p>
                </div>
              </div>

              <form className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-black)] mb-1.5">
                    Nume complet *
                  </label>
                  <input type="text" className={inputClass} placeholder="Ex: Ion Popescu" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-black)] mb-1.5">
                    Număr de telefon *
                  </label>
                  <input type="tel" className={inputClass} placeholder="Ex: +373 6X XXX XXX" />
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-[var(--color-brand-black)] mb-1.5">
                    Doresc o programare pentru *
                  </label>
                  <select className={`${inputClass} appearance-none pr-10`} defaultValue="">
                    <option value="" disabled>
                      Selectează tipul consultației
                    </option>
                    <option value="orl">Consultație ORL</option>
                    <option value="stomatologie">Consultație Stomatologie / Ortodonție</option>
                  </select>
                  <ChevronDown className="absolute right-3 bottom-3.5 w-5 h-5 text-[var(--color-brand-black)]/40 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--color-brand-teal)] text-white px-8 py-3.5 sm:py-4 rounded-full uppercase font-semibold text-sm hover:brightness-90 transition-all shadow-md shadow-[var(--color-brand-teal)]/20"
                >
                  Solicită programarea
                </button>
                <p className="text-xs text-[var(--color-brand-black)]/45 text-center">
                  Te vom contacta în maxim 24 de ore.
                </p>
              </form>
            </div>
          </div>

          {/* Info + map */}
          <div className="lg:col-span-5 order-2 lg:order-1 space-y-4 sm:space-y-5">
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
              className="flex sm:hidden items-center justify-center gap-2 bg-[var(--color-brand-teal)] text-white py-3.5 rounded-full font-semibold text-sm uppercase hover:brightness-90 transition-all"
            >
              <Phone className="w-4 h-4" />
              Sună acum: {CONTACT_INFO.phone}
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5">
              <div className={`${cardClass} flex gap-4`}>
                <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--color-brand-teal)]/15 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-black)]/50 mb-1">
                    Adresa
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-[var(--color-brand-black)] leading-snug break-words">
                    {CONTACT_INFO.address}
                  </p>
                </div>
              </div>

              <div className={`${cardClass} flex gap-4`}>
                <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--color-brand-teal)]/15 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-black)]/50 mb-1">
                    Telefon
                  </p>
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="text-sm sm:text-base font-semibold text-[var(--color-brand-black)] hover:text-[var(--color-brand-teal)] transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className={`${cardClass} flex gap-4 sm:col-span-2 lg:col-span-1`}>
                <div className="w-11 h-11 shrink-0 rounded-full bg-[var(--color-brand-teal)]/15 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand-black)]/50 mb-2">
                    Program de lucru
                  </p>
                  <ul className="space-y-1.5 text-sm text-[var(--color-brand-black)]/80">
                    <li className="flex justify-between gap-4">
                      <span>Luni – Vineri</span>
                      <span className="font-medium text-[var(--color-brand-black)]">09:00 – 19:00</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Sâmbătă</span>
                      <span className="font-medium text-[var(--color-brand-black)]">09:00 – 14:00</span>
                    </li>
                    <li className="flex justify-between gap-4">
                      <span>Duminică</span>
                      <span className="font-semibold text-[var(--color-brand-black)]">Închis</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[var(--color-brand-muted)] shadow-sm bg-white p-1">
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] min-h-[200px] sm:min-h-[240px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10861!2d28.8598!3d47.0303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97df6e11c7e1d%3A0xb8d6f7e2c5b9a3f!2sStrada%20Andrei%20Doga%2026%2FA%2C%20Chi%C8%99in%C4%83u!5e0!3m2!1sen!2smd!4v1717000000000!5m2!1sen!2smd"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  title="Locația clinicii pe hartă"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
