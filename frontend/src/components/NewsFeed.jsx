import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { fetchNews, generateArticle, seedNews } from "@/api";
import NewsCard from "@/components/NewsCard";
import { Search, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = ["all", "rumor", "official", "leak", "trailer", "gameplay"];

export default function NewsFeed() {
  const { t } = useLang();
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = async (cat = category, q = search) => {
    setLoading(true);
    try {
      const params = {};
      if (cat && cat !== "all") params.category = cat;
      if (q) params.search = q;
      const data = await fetchNews(params);
      // If empty on first load, seed
      if (data.length === 0 && cat === "all" && !q) {
        try {
          await seedNews(6);
          const seeded = await fetchNews({});
          setArticles(seeded);
        } catch (e) {
          setArticles([]);
        }
      } else {
        setArticles(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load("all", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCategory = (c) => {
    setCategory(c);
    load(c, search);
  };

  const onSearch = (e) => {
    e.preventDefault();
    load(category, search);
  };

  const onGenerate = async () => {
    setGenerating(true);
    try {
      await generateArticle();
      toast.success(t.toast.generated);
      load(category, search);
    } catch (e) {
      toast.error(t.toast.generateError);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section id="feed" data-testid="news-feed-section" className="relative py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <div className="font-mono-accent text-[10px] tracking-[0.4em] text-[#ff00ff] uppercase mb-2">
              {t.feed.tag}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl text-white tracking-tighter uppercase glow-pink">
              {t.feed.title}
            </h2>
          </div>
          <button
            data-testid="generate-news-button"
            onClick={onGenerate}
            disabled={generating}
            className="self-start md:self-auto inline-flex items-center gap-2 border border-[#00ffff]/60 text-[#00ffff] px-5 py-3 font-mono-accent text-xs tracking-[0.2em] uppercase hover:bg-[#00ffff]/10 transition-all disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {generating ? t.feed.generating : t.feed.generateMore}
          </button>
        </div>

        <form onSubmit={onSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              data-testid="news-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.feed.searchPlaceholder}
              className="w-full bg-[#13131a]/80 border border-white/15 pl-11 pr-4 py-3 font-mono-accent text-sm text-white focus:border-[#00ffff] focus:outline-none focus:ring-1 focus:ring-[#00ffff] placeholder:text-white/40"
            />
          </div>
          <button
            type="submit"
            data-testid="news-search-button"
            className="bg-[#ff00ff] text-[#050510] px-6 py-3 font-mono-accent text-xs tracking-[0.2em] uppercase hover:bg-[#00ffff] transition-colors"
          >
            GO
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              data-testid={`category-filter-${c}`}
              onClick={() => onCategory(c)}
              className={`px-4 py-2 font-mono-accent text-[10px] tracking-[0.25em] uppercase border transition-all ${
                category === c
                  ? "bg-[#ff00ff] text-[#050510] border-[#ff00ff] glow-box-pink"
                  : "border-white/15 text-white/70 hover:border-[#00ffff] hover:text-[#00ffff]"
              }`}
            >
              {c === "all" ? t.feed.all : t.categories[c]}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-[400px] bg-[#13131a]/60 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div
            data-testid="news-empty-state"
            className="text-center py-20 border border-dashed border-white/15 text-white/60"
          >
            <p className="font-mono-accent uppercase tracking-widest text-sm">
              {t.feed.empty}
            </p>
          </div>
        ) : (
          <div
            data-testid="news-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {articles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
