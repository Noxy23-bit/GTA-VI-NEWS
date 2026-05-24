import { createContext, useContext, useEffect, useState } from "react";

const translations = {
  pt: {
    nav: { home: "Início", news: "Notícias", rumors: "Rumores", about: "Sobre" },
    hero: {
      tag: "RASTREADOR DE NOTÍCIAS COM IA",
      title: "GTA 6 NEWS HUB",
      subtitle:
        "A IA rastreia 24/7 a internet em busca de tudo sobre #GTA6 e #GTAVI. Vazamentos, rumores e anúncios oficiais — primeiro aqui.",
      ctaPrimary: "Ler Últimas Notícias",
      ctaSecondary: "Ver Rumores",
    },
    countdown: {
      title: "LANÇAMENTO OFICIAL EM",
      days: "Dias",
      hours: "Horas",
      mins: "Minutos",
      secs: "Segundos",
      releaseLabel: "26 de Maio, 2026 · Rockstar Games",
    },
    weekly: {
      tag: "IA · RESUMO DA SEMANA",
      title: "O QUE ROLOU ESSA SEMANA",
      refresh: "Atualizar resumo",
      generating: "Gerando...",
      highlights: "Destaques",
    },
    feed: {
      tag: "ÚLTIMAS NOTÍCIAS",
      title: "FEED DE NOTÍCIAS",
      empty: "Nenhuma notícia encontrada. Gere algumas com a IA.",
      generateMore: "Gerar Mais (IA)",
      generating: "Gerando notícia...",
      readMore: "Ler mais",
      searchPlaceholder: "Buscar por #GTA6, Vice City, vazamentos...",
      all: "Todas",
    },
    categories: {
      rumor: "Rumores",
      official: "Oficial",
      leak: "Vazamentos",
      trailer: "Trailers",
      gameplay: "Gameplay",
    },
    article: {
      back: "Voltar ao feed",
      views: "visualizações",
      tags: "Tags",
      comments: "Comentários",
      yourName: "Seu apelido",
      yourMessage: "Deixe seu comentário sobre o GTA 6...",
      send: "Enviar",
      noComments: "Seja o primeiro a comentar.",
      related: "Notícias Relacionadas",
      aiBadge: "GERADO POR IA",
    },
    newsletter: {
      tag: "NEWSLETTER",
      title: "RECEBA OS VAZAMENTOS PRIMEIRO",
      subtitle:
        "Inscreva-se e a IA te avisa toda vez que algo novo sobre GTA 6 aparecer na rede.",
      placeholder: "seu@email.com",
      cta: "Quero entrar",
      success: "Inscrição confirmada! Fique de olho no email.",
      already: "Você já está inscrito!",
      error: "Erro ao inscrever. Tente novamente.",
    },
    footer: {
      tagline: "Rastreador de notícias GTA 6 movido a Inteligência Artificial.",
      disclaimer:
        "Site não oficial · Não afiliado à Rockstar Games · Conteúdo gerado por IA.",
    },
    toast: {
      commentSent: "Comentário enviado!",
      commentError: "Erro ao enviar comentário.",
      generated: "Nova notícia gerada pela IA!",
      generateError: "Falha ao gerar notícia.",
    },
  },
  en: {
    nav: { home: "Home", news: "News", rumors: "Rumors", about: "About" },
    hero: {
      tag: "AI-POWERED NEWS TRACKER",
      title: "GTA 6 NEWS HUB",
      subtitle:
        "AI scans the internet 24/7 for everything #GTA6 and #GTAVI. Leaks, rumors and official drops — here first.",
      ctaPrimary: "Read Latest News",
      ctaSecondary: "See Rumors",
    },
    countdown: {
      title: "OFFICIAL RELEASE IN",
      days: "Days",
      hours: "Hours",
      mins: "Minutes",
      secs: "Seconds",
      releaseLabel: "May 26, 2026 · Rockstar Games",
    },
    weekly: {
      tag: "AI · WEEKLY RECAP",
      title: "THIS WEEK IN GTA 6",
      refresh: "Refresh summary",
      generating: "Generating...",
      highlights: "Highlights",
    },
    feed: {
      tag: "LATEST",
      title: "NEWS FEED",
      empty: "No news yet. Generate some with the AI.",
      generateMore: "Generate More (AI)",
      generating: "Generating news...",
      readMore: "Read more",
      searchPlaceholder: "Search #GTA6, Vice City, leaks...",
      all: "All",
    },
    categories: {
      rumor: "Rumors",
      official: "Official",
      leak: "Leaks",
      trailer: "Trailers",
      gameplay: "Gameplay",
    },
    article: {
      back: "Back to feed",
      views: "views",
      tags: "Tags",
      comments: "Comments",
      yourName: "Your nickname",
      yourMessage: "Share your thoughts about GTA 6...",
      send: "Send",
      noComments: "Be the first to comment.",
      related: "Related News",
      aiBadge: "AI GENERATED",
    },
    newsletter: {
      tag: "NEWSLETTER",
      title: "GET THE LEAKS FIRST",
      subtitle:
        "Subscribe and the AI will ping you every time something new about GTA 6 hits the web.",
      placeholder: "you@email.com",
      cta: "Sign me up",
      success: "Subscribed! Watch your inbox.",
      already: "You are already subscribed!",
      error: "Subscription failed. Try again.",
    },
    footer: {
      tagline: "AI-powered GTA 6 news tracker.",
      disclaimer:
        "Unofficial site · Not affiliated with Rockstar Games · AI-generated content.",
    },
    toast: {
      commentSent: "Comment posted!",
      commentError: "Failed to send comment.",
      generated: "New AI news generated!",
      generateError: "Failed to generate news.",
    },
  },
};

const LangContext = createContext({ lang: "pt", setLang: () => {}, t: translations.pt });

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("gta6_lang") || "pt");
  useEffect(() => {
    localStorage.setItem("gta6_lang", lang);
  }, [lang]);
  const t = translations[lang];
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
