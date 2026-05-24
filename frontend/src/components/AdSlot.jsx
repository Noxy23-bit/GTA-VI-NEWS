import { useEffect, useRef } from "react";
import { useLang } from "@/i18n";

const ADSENSE_CLIENT = process.env.REACT_APP_ADSENSE_CLIENT || "";
const ADS_ENABLED =
  (process.env.REACT_APP_ADS_ENABLED || "").toLowerCase() === "true";

let adsenseScriptLoaded = false;

function loadAdsenseScript(clientId) {
  if (adsenseScriptLoaded || typeof document === "undefined") return;
  if (document.querySelector('script[data-adsense="true"]')) {
    adsenseScriptLoaded = true;
    return;
  }
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  s.crossOrigin = "anonymous";
  s.setAttribute("data-adsense", "true");
  document.head.appendChild(s);
  adsenseScriptLoaded = true;
}

/**
 * AdSlot — Google AdSense placeholder.
 *
 * To activate: set REACT_APP_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 * and REACT_APP_ADS_ENABLED=true in /app/frontend/.env, then restart frontend.
 * Also create /app/frontend/public/ads.txt with the AdSense verification line.
 *
 * Props:
 *   position: string id used for data-testid and a deterministic slot label
 *   slot:     (optional) AdSense ad-slot numeric id, falls back to position
 *   format:   AdSense layout: "auto" | "rectangle" | "horizontal" | "in-feed"
 *   minHeight: number, fallback height for the placeholder
 */
export default function AdSlot({
  position,
  slot = "",
  format = "auto",
  minHeight = 90,
  className = "",
}) {
  const { lang } = useLang();
  const insRef = useRef(null);
  const live = ADS_ENABLED && !!ADSENSE_CLIENT;

  useEffect(() => {
    if (!live) return;
    loadAdsenseScript(ADSENSE_CLIENT);
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // adsbygoogle may not be ready yet; silent in dev
    }
  }, [live]);

  const label =
    lang === "pt" ? "PUBLICIDADE" : "ADVERTISEMENT";

  return (
    <section
      data-testid={`ad-slot-${position}`}
      className={`relative w-full my-8 ${className}`}
      aria-label="advertisement"
    >
      <div className="font-mono-accent text-[9px] tracking-[0.4em] uppercase text-white/40 text-center mb-2">
        {label}
      </div>

      {live ? (
        <ins
          ref={insRef}
          className="adsbygoogle block"
          style={{ display: "block", minHeight: `${minHeight}px` }}
          data-ad-client={ADSENSE_CLIENT}
          data-ad-slot={slot || position}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div
          data-testid={`ad-slot-${position}-placeholder`}
          className="relative w-full max-w-5xl mx-auto border border-dashed border-[#ff00ff]/40 bg-[#13131a]/60 backdrop-blur-sm flex flex-col items-center justify-center px-6 text-center overflow-hidden"
          style={{ minHeight: `${minHeight}px` }}
        >
          <div className="absolute inset-0 retro-grid opacity-20 pointer-events-none" />
          <div className="relative font-display text-2xl text-[#ff00ff] glow-pink tracking-tighter">
            AD&nbsp;SLOT
          </div>
          <div className="relative font-mono-accent text-[10px] tracking-[0.3em] uppercase text-[#00ffff] mt-1">
            {position}
          </div>
          <div className="relative font-mono-accent text-[10px] tracking-[0.2em] uppercase text-white/40 mt-2">
            ca-pub-XXXXXXXX · set REACT_APP_ADSENSE_CLIENT to activate
          </div>
        </div>
      )}
    </section>
  );
}
