import { useLang } from "@/i18n";
import { Radio, Github, Twitter } from "lucide-react";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer data-testid="main-footer" className="relative border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#ff00ff] glow-box-pink">
              <Radio className="h-5 w-5 text-[#050510]" />
            </span>
            <span className="font-display text-2xl glow-pink">
              GTA<span className="text-[#00ffff] glow-cyan ml-1">6</span>
            </span>
          </div>
          <p className="text-sm text-[#a1a1aa] max-w-xs">{t.footer.tagline}</p>
        </div>

        <div className="space-y-3">
          <div className="font-mono-accent text-xs tracking-[0.3em] uppercase text-[#00ffff]">
            #GTA6 · #GTAVI
          </div>
          <div className="text-sm text-[#a1a1aa]">Vice City · Jason & Lucia · 2026</div>
        </div>

        <div className="space-y-3 md:text-right">
          <div className="flex md:justify-end gap-3">
            <a
              href="#"
              data-testid="footer-twitter"
              className="h-9 w-9 inline-flex items-center justify-center border border-white/15 hover:border-[#00ffff] hover:text-[#00ffff] transition-colors rounded-sm"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              data-testid="footer-github"
              className="h-9 w-9 inline-flex items-center justify-center border border-white/15 hover:border-[#ff00ff] hover:text-[#ff00ff] transition-colors rounded-sm"
              aria-label="Github"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-[#71717a]">{t.footer.disclaimer}</p>
        </div>
      </div>
      <div className="divider-neon" />
      <div className="text-center py-4 font-mono-accent text-[10px] tracking-[0.3em] text-[#71717a] uppercase">
        © 2026 · BUILT WITH NEON & AI
      </div>
    </footer>
  );
}
