import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { api } from "@/api";
import { Sparkles, RefreshCw, Loader2 } from "lucide-react";

const BG =
  "https://static.prod-images.emergentagent.com/jobs/7678aca8-210f-471f-907f-f94592b20c3d/images/a4b09a62ba02523bb0302e32b8d231693d0c60f12784c7a1be892f51248f0a7f.png";

export default function WeeklySummary() {
  const { lang, t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.get("/weekly-summary");
      setData(r.data);
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    try {
      const r = await api.post("/weekly-summary/refresh");
      setData(r.data);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section id="weekly" data-testid="weekly-summary-section" className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-transparent to-[#050510]" />
      <div className="relative max-w-5xl mx-auto px-5">
        <div className="tracing-border rounded-lg">
          <div className="bg-[#13131a]/90 backdrop-blur-xl p-8 md:p-12 rounded-lg relative">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
              <div className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#00ffff]" />
                <span className="font-mono-accent text-[10px] tracking-[0.4em] text-[#00ffff] uppercase">
                  {t.weekly.tag}
                </span>
              </div>
              <button
                onClick={refresh}
                disabled={refreshing || loading}
                data-testid="weekly-refresh-button"
                className="inline-flex items-center gap-2 text-xs font-mono-accent uppercase tracking-widest text-white/70 hover:text-[#ff00ff] disabled:opacity-50 transition-colors"
              >
                {refreshing ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {refreshing ? t.weekly.generating : t.weekly.refresh}
              </button>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tighter uppercase glow-cyan mb-6">
              {t.weekly.title}
            </h2>

            {loading || !data ? (
              <div className="space-y-3">
                <div className="h-4 bg-white/10 animate-pulse rounded w-full" />
                <div className="h-4 bg-white/10 animate-pulse rounded w-11/12" />
                <div className="h-4 bg-white/10 animate-pulse rounded w-9/12" />
              </div>
            ) : (
              <>
                <p className="text-base md:text-lg text-white/85 leading-relaxed">
                  {lang === "pt" ? data.summary_pt : data.summary_en}
                </p>

                {data.highlights && data.highlights.length > 0 && (
                  <div className="mt-8">
                    <div className="font-mono-accent text-[10px] tracking-[0.3em] text-[#ffb800] uppercase mb-3">
                      {t.weekly.highlights}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {data.highlights.map((h, idx) => (
                        <div
                          key={idx}
                          data-testid={`weekly-highlight-${idx}`}
                          className="flex items-start gap-3 border-l-2 border-[#ff00ff] pl-4 py-2 bg-[#050510]/40"
                        >
                          <span className="text-[#ff00ff] font-mono-accent text-xs">
                            0{idx + 1}
                          </span>
                          <span className="text-sm text-white/85">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
