import { CLINIC_NAME, CONTACT_INFO } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-brand-teal)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-white/90">Legături Rapide</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                  Acasă
                </a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors text-sm">
                  Servicii
                </a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors text-sm">
                  Despre Noi
                </a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-white/90">Informații de Contact</h4>
            <ul className="space-y-3">
              <li className="text-white/80 text-sm leading-relaxed">{CONTACT_INFO.address}</li>
              <li className="text-white/80 text-sm">
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-wider text-sm mb-6 text-white/90">Program de Lucru</h4>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex justify-between">
                <span>Luni - Vineri:</span> <span>08:00 - 20:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sâmbătă:</span> <span>09:00 - 15:00</span>
              </li>
              <li className="flex justify-between font-bold text-white">
                <span>Duminică:</span> <span>Închis</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-white/60 text-xs">&copy; 2026 {CLINIC_NAME} | Toate drepturile rezervate</p>
        </div>
      </div>
    </footer>
  );
}
