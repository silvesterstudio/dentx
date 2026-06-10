export default function Stats() {
  const stats = [
    { value: "100%", label: "Empatie și Rabdare" },
    { value: "24", label: "Săli de Tratament" },
    { value: "50+", label: "Medici Calificași" },
    { value: "160+", label: "Pacienși Fericiți / Zi" },
  ];

  return (
    <section className="bg-white py-12 border-b border-[var(--color-brand-muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y-0 md:divide-x divide-[var(--color-brand-muted)]">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center text-center">
              <span className="text-[56px] font-bold text-[var(--color-brand-teal)] leading-none">
                {stat.value}
              </span>
              <span className="uppercase text-sm font-semibold tracking-wider text-[var(--color-brand-black)]/70 mt-2">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

