import { useEffect, useRef, useState } from "react";
import { useLang } from "@/i18n";
import CountdownTimer from "@/components/CountdownTimer";
import { ArrowDown, Sparkles } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/7678aca8-210f-471f-907f-f94592b20c3d/images/dcbfcc4a580c7e3d1a2c5c6b930df1e016d8f008d6199995727cb6fcd530d499.png";

export default function Hero() {
  const { t } = useLang();
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const sunRef = useRef(null);
  const gridRef = useRef(null);
  const cursorRef = useRef(null);
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let targetX = 0.5;
    let targetY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;
    let lastPointerTime = 0;
    let idleT = 0;

    const update = (now) => {
      // idle floating drift when no pointer activity
      const idleActive = now - lastPointerTime > 1500;
      if (idleActive) {
        idleT += 0.006;
        targetX = 0.5 + Math.sin(idleT) * 0.25;
        targetY = 0.5 + Math.cos(idleT * 0.8) * 0.18;
      }

      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      const dx = currentX - 0.5; // -0.5 .. 0.5
      const dy = currentY - 0.5;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${dx * -60}px, ${dy * -40}px, 0) scale(1.12)`;
      }
      if (sunRef.current) {
        sunRef.current.style.transform = `translate3d(calc(-50% + ${dx * 140}px), ${dy * 60}px, 0)`;
      }
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${dx * 40}px, ${dy * 26}px, 0) perspective(800px) rotateX(${5 + dy * 6}deg)`;
      }
      if (cursorRef.current) {
        const rect = section.getBoundingClientRect();
        cursorRef.current.style.transform = `translate3d(${currentX * rect.width - 220}px, ${currentY * rect.height - 220}px, 0)`;
      }

      rafId = requestAnimationFrame(update);
    };

    const handlePoint = (clientX, clientY) => {
      const rect = section.getBoundingClientRect();
      targetX = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      targetY = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
      lastPointerTime = performance.now();
    };

    const onMove = (e) => handlePoint(e.clientX, e.clientY);
    const onTouch = (e) => {
      const touch = e.touches && e.touches[0];
      if (touch) handlePoint(touch.clientX, touch.clientY);
    };

    window.addEventListener("mousemove", onMove);
    section.addEventListener("touchmove", onTouch, { passive: true });

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      section.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-testid="hero-section"
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {/* Parallax background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform pointer-events-none"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/40 via-[#050510]/70 to-[#050510] pointer-events-none" />

      {/* Retro grid (parallax + 3D tilt) */}
      <div
        ref={gridRef}
        className="absolute inset-x-0 bottom-0 h-1/2 retro-grid opacity-70 pointer-events-none will-change-transform"
        style={{ transformOrigin: "center bottom" }}
      />

      {/* Sun layer (parallax) */}
      <div
        ref={sunRef}
        className="absolute left-1/2 bottom-0 w-[800px] h-[800px] hero-sun opacity-60 pointer-events-none will-change-transform"
      />

      {/* Cursor glow */}
      <div
        ref={cursorRef}
        className="absolute top-0 left-0 w-[440px] h-[440px] pointer-events-none mix-blend-screen transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(0,255,255,0.55) 0%, rgba(255,0,255,0.28) 38%, transparent 70%)",
          filter: "blur(22px)",
          opacity: isHover ? 1 : 0.45,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-5 pt-20 pb-24 md:pt-32 md:pb-40">
        <div className="fade-up max-w-4xl">
          <div className="inline-flex items-center gap-2 border border-[#00ffff]/50 px-3 py-1.5 rounded-full bg-[#13131a]/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[#00ffff]" />
            <span className="font-mono-accent text-[10px] tracking-[0.3em] text-[#00ffff] uppercase">
              {t.hero.tag}
            </span>
          </div>

          <h1
            data-testid="hero-title"
            className="font-display text-6xl sm:text-7xl lg:text-8xl text-white mt-6 tracking-tighter glow-pink leading-[0.95]"
          >
            GTA<span className="text-[#00ffff] glow-cyan"> 6</span>
            <br />
            <span className="text-[#ffb800] glow-amber text-5xl sm:text-6xl lg:text-7xl">
              NEWS HUB
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/85 mt-6 max-w-2xl leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#feed"
              data-testid="hero-cta-primary"
              className="group inline-flex items-center gap-3 bg-[#ff00ff] text-[#050510] px-7 py-3.5 font-mono-accent text-xs tracking-[0.25em] uppercase hover:bg-[#00ffff] transition-all glow-box-pink hover:glow-box-cyan"
            >
              {t.hero.ctaPrimary}
              <ArrowDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </a>
            <a
              href="#feed"
              data-testid="hero-cta-secondary"
              className="inline-flex items-center gap-3 border border-[#00ffff]/60 text-[#00ffff] px-7 py-3.5 font-mono-accent text-xs tracking-[0.25em] uppercase hover:bg-[#00ffff]/10 transition-all"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="mt-16">
          <CountdownTimer />
        </div>
      </div>
    </section>
  );
}
