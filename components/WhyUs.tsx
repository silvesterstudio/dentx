import { Heart, Shield, Zap, Users, Star } from "lucide-react";

export default function WhyUs() {
  const reasons = [
    { icon: Heart, label: "Grija pentru Familie", active: false },
    { icon: Shield, label: "Siguranța absoluta", active: true },
    { icon: Zap, label: "Excelența Medicala", active: false },
    { icon: Users, label: "Empatie și Rabdare", active: false },
    { icon: Star, label: "Anestezie Fără Stres", active: false },
  ];

  return (
    <section className="py-20 bg-[var(--color-brand-grey)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-primary text-4xl md:text-5xl font-bold text-center text-[var(--color-brand-black)] mb-12">
          de ce <span className="text-[var(--color-brand-teal)]">My Dental Clinic?</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {reasons.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-4 hover:-translate-y-2 ${
                  item.active
                    ? "bg-[var(--color-brand-teal)] border-[var(--color-brand-teal)] text-white shadow-lg shadow-[var(--color-brand-teal)]/30"
                    : "bg-white border-[var(--color-brand-muted)] text-[var(--color-brand-black)] hover:shadow-xl"
                }`}
              >
                <Icon className={`w-10 h-10 ${item.active ? "text-white" : "text-[var(--color-brand-teal)]"}`} />
                <span className="font-semibold">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

