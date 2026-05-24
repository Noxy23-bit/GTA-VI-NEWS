import { useState } from "react";
import { useLang } from "@/i18n";
import { subscribeNewsletter } from "@/api";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Newsletter() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const r = await subscribeNewsletter(email.trim());
      if (r.status === "already_subscribed") {
        toast.info(t.newsletter.already);
      } else {
        toast.success(t.newsletter.success);
      }
      setEmail("");
    } catch (e) {
      toast.error(t.newsletter.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section data-testid="newsletter-section" className="relative py-20">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <Mail className="h-3.5 w-3.5 text-[#ff00ff]" />
          <span className="font-mono-accent text-[10px] tracking-[0.4em] text-[#ff00ff] uppercase">
            {t.newsletter.tag}
          </span>
        </div>
        <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tighter uppercase glow-pink">
          {t.newsletter.title}
        </h2>
        <p className="text-[#a1a1aa] mt-4 max-w-xl mx-auto leading-relaxed">
          {t.newsletter.subtitle}
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
        >
          <input
            data-testid="newsletter-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.newsletter.placeholder}
            className="flex-1 bg-[#13131a]/80 border border-white/15 px-5 py-3.5 font-mono-accent text-sm text-white focus:border-[#ff00ff] focus:outline-none focus:ring-1 focus:ring-[#ff00ff] placeholder:text-white/40"
          />
          <button
            type="submit"
            disabled={loading}
            data-testid="newsletter-submit-button"
            className="inline-flex items-center justify-center gap-2 bg-[#ff00ff] text-[#050510] px-7 py-3.5 font-mono-accent text-xs tracking-[0.25em] uppercase hover:bg-[#00ffff] transition-colors disabled:opacity-50 glow-box-pink hover:glow-box-cyan"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t.newsletter.cta}
          </button>
        </form>
      </div>
    </section>
  );
}
