import { Link } from "react-router-dom";
import { useLang } from "@/i18n";
import { Sparkles, Eye } from "lucide-react";

const CAT_COLOR = {
  rumor: "#ff00ff",
  official: "#00ffff",
  leak: "#ffb800",
  trailer: "#ff00ff",
  gameplay: "#00ffff",
};

export default function NewsCard({ article }) {
  const { lang, t } = useLang();
  const title = lang === "pt" ? article.title_pt : article.title_en;
  const summary = lang === "pt" ? article.summary_pt : article.summary_en;
  const catColor = CAT_COLOR[article.category] || "#ff00ff";
  const date = new Date(article.created_at);

  return (
    <Link
      to={`/news/${article.id}`}
      data-testid="news-card-link"
      className="news-card group block relative bg-[#13131a]/70 backdrop-blur-xl border border-[#ff00ff]/30 hover:border-[#00ffff]/70 hover:shadow-[0_0_24px_rgba(0,255,255,0.35)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={article.image_url}
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13131a] via-[#13131a]/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className="px-2.5 py-1 font-mono-accent text-[9px] tracking-[0.25em] uppercase border bg-[#050510]/70 backdrop-blur"
            style={{ color: catColor, borderColor: catColor }}
          >
            {t.categories[article.category] || article.category}
          </span>
        </div>
        {article.is_ai_generated && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 bg-[#050510]/80 backdrop-blur border border-[#00ffff]/60">
            <Sparkles className="h-3 w-3 text-[#00ffff]" />
            <span className="font-mono-accent text-[8px] tracking-[0.2em] uppercase text-[#00ffff]">
              IA
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl text-white tracking-tight leading-tight line-clamp-2 group-hover:text-[#00ffff] transition-colors uppercase">
          {title}
        </h3>
        <p className="text-sm text-[#a1a1aa] mt-3 line-clamp-3 leading-relaxed">{summary}</p>
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <span className="font-mono-accent text-[10px] tracking-[0.2em] uppercase text-white/50">
            {date.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
              day: "2-digit",
              month: "short",
            })}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono-accent text-[10px] uppercase text-[#a1a1aa]">
            <Eye className="h-3 w-3" />
            {article.views || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
