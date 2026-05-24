import { useEffect, useState } from "react";
import { useLang } from "@/i18n";
import { fetchComments, postComment } from "@/api";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Comments({ articleId }) {
  const { lang, t } = useLang();
  const [comments, setComments] = useState([]);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchComments(articleId);
      setComments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    try {
      await postComment(articleId, {
        nickname: nickname.trim() || (lang === "pt" ? "Anônimo" : "Anonymous"),
        message: message.trim(),
      });
      setMessage("");
      toast.success(t.toast.commentSent);
      load();
    } catch (e) {
      toast.error(t.toast.commentError);
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="comments-section" className="mt-12">
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="h-5 w-5 text-[#00ffff]" />
        <h3 className="font-display text-2xl text-white tracking-tight uppercase glow-cyan">
          {t.article.comments}
          <span className="text-[#a1a1aa] ml-3 font-mono-accent text-sm">
            ({comments.length})
          </span>
        </h3>
      </div>

      <form
        onSubmit={onSubmit}
        className="bg-[#13131a]/70 border border-white/10 p-5 mb-8 space-y-3"
      >
        <input
          data-testid="comment-nickname-input"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t.article.yourName}
          maxLength={40}
          className="w-full bg-[#050510] border border-white/15 px-4 py-2.5 font-mono-accent text-sm text-white focus:border-[#00ffff] focus:outline-none placeholder:text-white/40"
        />
        <textarea
          data-testid="comment-message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.article.yourMessage}
          rows={3}
          required
          maxLength={1000}
          className="w-full bg-[#050510] border border-white/15 px-4 py-2.5 text-sm text-white focus:border-[#ff00ff] focus:outline-none placeholder:text-white/40 resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending}
            data-testid="comment-submit-button"
            className="inline-flex items-center gap-2 bg-[#ff00ff] text-[#050510] px-5 py-2.5 font-mono-accent text-xs tracking-[0.25em] uppercase hover:bg-[#00ffff] transition-colors disabled:opacity-50"
          >
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
            {t.article.send}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="space-y-3">
          <div className="h-20 bg-white/5 animate-pulse" />
          <div className="h-20 bg-white/5 animate-pulse" />
        </div>
      ) : comments.length === 0 ? (
        <p
          data-testid="comments-empty"
          className="text-center text-white/50 font-mono-accent text-xs uppercase tracking-widest py-8 border border-dashed border-white/10"
        >
          {t.article.noComments}
        </p>
      ) : (
        <div data-testid="comments-list" className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="border-l-2 border-[#ff00ff] bg-[#13131a]/60 p-4 fade-up"
            >
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-mono-accent text-[#00ffff] text-xs uppercase tracking-widest">
                  {c.nickname}
                </span>
                <span className="text-[10px] text-white/40 font-mono-accent">
                  {new Date(c.created_at).toLocaleString(lang === "pt" ? "pt-BR" : "en-US")}
                </span>
              </div>
              <p className="text-sm text-white/85 leading-relaxed whitespace-pre-wrap">
                {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
