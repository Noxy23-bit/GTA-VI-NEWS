import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLang } from "@/i18n";
import { fetchArticle, fetchTrending } from "@/api";
import { ArrowLeft, Sparkles, Eye, Tag } from "lucide-react";
import Comments from "@/components/Comments";
import NewsCard from "@/components/NewsCard";
import AdSlot from "@/components/AdSlot";

const CAT_COLOR = {
  rumor: "#ff00ff",
  official: "#00ffff",
  leak: "#ffb800",
  trailer: "#ff00ff",
  gameplay: "#00ffff",
};

export default function NewsDetailPage() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([fetchArticle(id), fetchTrending()])
      .then(([a, tr]) => {
        if (!mounted) return;
        setArticle(a);
        setRelated(tr.filter((x) => x.id !== id).slice(0, 3));
      })
      .catch(console.error)
      .finally(() => mounted && setLoading(false));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-20">
        <div className="h-8 w-40 bg-white/10 animate-pulse mb-6" />
        <div className="h-72 bg-white/10 animate-pulse mb-6" />
        <div className="space-y-2">
          <div className="h-4 bg-white/10 animate-pulse" />
          <div className="h-4 bg-white/10 animate-pulse w-11/12" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-20 text-center">
        <p className="font-mono-accent text-sm text-white/60 uppercase tracking-widest">
          404 · NOT FOUND
        </p>
        <Link to="/" className="mt-6 inline-block text-[#00ffff] hover:underline">
          ← {t.article.back}
        </Link>
      </div>
    );
  }

  const title = lang === "pt" ? article.title_pt : article.title_en;
  const content = lang === "pt" ? article.content_pt : article.content_en;
  const catColor = CAT_COLOR[article.category] || "#ff00ff";
  const paragraphs = (content || "").split(/\n+/).filter(Boolean);

  return (
    <main data-testid="news-detail-page" className="relative">
      <article className="max-w-4xl mx-auto px-5 pt-10 pb-16">
        <Link
          to="/"
          data-testid="back-to-feed-link"
          className="inline-flex items-center gap-2 font-mono-accent text-xs tracking-[0.25em] uppercase text-white/60 hover:text-[#00ffff] transition-colors mb-8"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t.article.back}
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span
            data-testid="article-category-badge"
            className="px-3 py-1.5 font-mono-accent text-[10px] tracking-[0.3em] uppercase border"
            style={{ color: catColor, borderColor: catColor }}
          >
            {t.categories[article.category] || article.category}
          </span>
          {article.is_ai_generated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 font-mono-accent text-[10px] tracking-[0.3em] uppercase border border-[#00ffff] text-[#00ffff]">
              <Sparkles className="h-3 w-3" />
              {t.article.aiBadge}
            </span>
          )}
          <span className="font-mono-accent text-[10px] tracking-[0.3em] uppercase text-white/40">
            {new Date(article.created_at).toLocaleDateString(
              lang === "pt" ? "pt-BR" : "en-US",
              { day: "2-digit", month: "long", year: "numeric" }
            )}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono-accent text-[10px] uppercase text-white/40">
            <Eye className="h-3 w-3" />
            {article.views || 0} {t.article.views}
          </span>
        </div>

        <h1
          data-testid="article-title"
          className="font-display text-4xl sm:text-5xl lg:text-6xl text-white tracking-tighter uppercase glow-pink leading-[1.05]"
        >
          {title}
        </h1>

        <div className="relative mt-10 mb-10 overflow-hidden border border-[#ff00ff]/30">
          <img
            src={article.image_url}
            alt={title}
            className="w-full h-[300px] sm:h-[420px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050510]/80 via-transparent to-transparent" />
        </div>

        <div className="prose prose-invert max-w-none">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              data-testid={`article-paragraph-${i}`}
              className={`leading-relaxed mb-5 ${
                i === 0
                  ? "text-lg text-white/95 first-letter:font-display first-letter:text-5xl first-letter:text-[#ff00ff] first-letter:mr-2 first-letter:float-left first-letter:leading-none"
                  : "text-base text-white/85"
              }`}
            >
              {p}
            </p>
          ))}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-3.5 w-3.5 text-[#ffb800]" />
              <span className="font-mono-accent text-[10px] tracking-[0.3em] uppercase text-[#ffb800]">
                {t.article.tags}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  data-testid={`article-tag-${tag}`}
                  className="px-3 py-1 font-mono-accent text-xs uppercase tracking-wider border border-white/15 text-white/70 hover:border-[#00ffff] hover:text-[#00ffff] transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <AdSlot position="article-mid" format="rectangle" minHeight={250} />

        <Comments articleId={article.id} />
      </article>

      {related.length > 0 && (
        <section className="bg-[#13131a]/40 border-t border-white/10 py-16">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="font-display text-3xl text-white tracking-tighter uppercase glow-cyan mb-8">
              {t.article.related}
            </h2>
            <div data-testid="related-news-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <NewsCard key={r.id} article={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
