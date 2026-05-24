import { useLang } from "@/i18n";
import CountdownTimer from "@/components/CountdownTimer";
import { ArrowDown, Sparkles } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/7678aca8-210f-471f-907f-f94592b20c3d/images/dcbfcc4a580c7e3d1a2c5c6b930df1e016d8f008d6199995727cb6fcd530d499.png";

export default function Hero() {
  const { t } = useLang();
  return (
    <section data-testid="hero-section" className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/40 via-[#050510]/70 to-[#050510]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 retro-grid opacity-60" />
      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[800px] h-[800px] hero-sun opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="fade-up max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-[#00ffff]/50 px-3 py-1.5 rounded-full bg-[#13131a]/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#00ffff]" />
            <span className="font-mono-accent text-[10px] tracking-[0.3em] text-[#00ffff] uppercase">
              {t.hero.tag}
            </span>
          </div>

          <h1
            data-testid="hero-title"
            className="font-display text-6xl sm:text-7xl lg:text-8xl text-white mt-6 tracking-tighter glow-pink leading-[0.95]"
          >
            GTA<span className="text-[#00ffff] glow-cyan"> 6</span>
            <br />
            <span className="text-[#ffb800] glow-amber text-5xl sm:text-6xl lg:text-7xl">
              NEWS HUB
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/85 mt-6 max-w-2xl leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#feed"
              data-testid="hero-cta-primary"
              className="group inline-flex items-center gap-3 bg-[#ff00ff] text-[#050510] px-7 py-3.5 font-mono-accent text-xs tracking-[0.25em] uppercase hover:bg-[#00ffff] transition-all glow-box-pink hover:glow-box-cyan"
            >
              {t.hero.ctaPrimary}
              <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </a>
            <a
              href="#feed"
              data-testid="hero-cta-secondary"
              className="inline-flex items-center gap-3 border border-[#00ffff]/60 text-[#00ffff] px-7 py-3.5 font-mono-accent text-xs tracking-[0.25em] uppercase hover:bg-[#00ffff]/10 transition-all"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mt-16">
          <CountdownTimer />
        </div>
      </div>
    </section>
  );
}
