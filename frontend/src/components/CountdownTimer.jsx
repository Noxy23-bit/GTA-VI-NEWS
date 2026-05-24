import { useEffect, useState } from "react";
import { useLang } from "@/i18n";

const RELEASE_DATE = new Date("2026-11-19T00:00:00Z").getTime();

function calc() {
  const now = Date.now();
  const diff = Math.max(0, RELEASE_DATE - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

const Box = ({ value, label, color }) => (
  <div
    className="flex-1 min-w-[80px] border border-white/10 bg-[#13131a]/80 backdrop-blur-xl px-4 py-5 text-center relative overflow-hidden"
  >
    <div
      className="font-mono-accent text-4xl sm:text-5xl font-bold"
      style={{ color, textShadow: `0 0 16px ${color}` }}
    >
      {String(value).padStart(2, "0")}
    </div>
    <div className="font-mono-accent text-[10px] tracking-[0.3em] uppercase mt-2 text-white/60">
      {label}
    </div>
  </div>
);

export default function CountdownTimer() {
  const { t } = useLang();
  const [time, setTime] = useState(calc());
  useEffect(() => {
    const i = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div data-testid="countdown-timer" className="max-w-2xl">
      <div className="font-mono-accent text-[10px] tracking-[0.4em] text-[#ff00ff] uppercase mb-3">
        {t.countdown.title}
      </div>
      <div className="flex gap-2 sm:gap-3 tracing-border bg-[#050510] p-3 rounded-md">
        <Box value={time.days} label={t.countdown.days} color="#ff00ff" />
        <Box value={time.hours} label={t.countdown.hours} color="#00ffff" />
        <Box value={time.mins} label={t.countdown.mins} color="#ffb800" />
        <Box value={time.secs} label={t.countdown.secs} color="#ff00ff" />
      </div>
      <div className="font-mono-accent text-[10px] tracking-[0.3em] text-white/60 uppercase mt-3">
        {t.countdown.releaseLabel}
      </div>
    </div>
  );
}
