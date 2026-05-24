import { Link, useLocation } from "react-router-dom";
import { useLang } from "@/i18n";
import { Radio } from "lucide-react";

export default function Navbar() {
  const { lang, setLang, t } = useLang();
  const location = useLocation();

  return (
    <header
      data-testid="main-navbar"
      className="sticky top-0 z-50 backdrop-blur-2xl bg-[#050510]/80 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-4">
        <Link
          to="/"
          data-testid="nav-logo"
          className="flex items-center gap-3 group"
        >
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#ff00ff] glow-box-pink">
            <Radio className="h-5 w-5 text-[#050510]" strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#00ffff] pulse-neon" />
          </span>
          <div className="leading-none">
            <div className="font-display text-xl text-white glow-pink tracking-tighter">
              GTA<span className="text-[#00ffff] glow-cyan ml-1">6</span>
            </div>
            <div className="font-mono-accent text-[10px] tracking-[0.3em] text-[#a1a1aa] uppercase mt-0.5">
              NEWS HUB
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono-accent text-xs uppercase tracking-[0.25em]">
          <Link
            to="/"
            data-testid="nav-home"
            className={`hover:text-[#00ffff] transition-colors ${
              location.pathname === "/" ? "text-[#00ffff] glow-cyan" : "text-white/80"
            }`}
          >
            {t.nav.home}
          </Link>
          <a href="/#feed" data-testid="nav-news" className="text-white/80 hover:text-[#00ffff] transition-colors">
            {t.nav.news}
          </a>
          <a href="/#weekly" data-testid="nav-rumors" className="text-white/80 hover:text-[#ff00ff] transition-colors">
            {t.nav.rumors}
          </a>
        </nav>

        <div className="flex items-center gap-1 rounded-full border border-[#ff00ff]/40 p-1 bg-[#13131a]/60">
          <button
            data-testid="language-toggle-pt"
            onClick={() => setLang("pt")}
            className={`px-3 py-1 text-xs font-mono-accent uppercase tracking-widest rounded-full transition-all ${
              lang === "pt"
                ? "bg-[#ff00ff] text-[#050510] glow-box-pink"
                : "text-white/70 hover:text-white"
            }`}
          >
            PT
          </button>
          <button
            data-testid="language-toggle-en"
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-xs font-mono-accent uppercase tracking-widest rounded-full transition-all ${
              lang === "en"
                ? "bg-[#00ffff] text-[#050510] glow-box-cyan"
                : "text-white/70 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </header>
  );
}
