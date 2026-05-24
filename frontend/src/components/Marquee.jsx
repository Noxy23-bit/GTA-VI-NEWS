const ITEMS = [
  "#GTA6",
  "#GTAVI",
  "VICE CITY",
  "JASON & LUCIA",
  "ROCKSTAR GAMES",
  "MAY 26 · 2026",
  "AI TRACKER ONLINE",
  "LEAKS · RUMORS · OFFICIAL",
];

export default function Marquee() {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div
      data-testid="marquee-bar"
      className="bg-[#ff00ff] text-[#050510] py-2.5 overflow-hidden border-y border-[#ff00ff]"
    >
      <div className="marquee-track">
        {items.map((it, idx) => (
          <span
            key={idx}
            className="px-8 font-mono-accent text-xs tracking-[0.4em] uppercase font-bold"
          >
            {it} <span className="mx-3 text-[#050510]/60">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
