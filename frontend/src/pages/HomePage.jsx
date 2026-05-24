import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import NewsFeed from "@/components/NewsFeed";
import WeeklySummary from "@/components/WeeklySummary";
import Newsletter from "@/components/Newsletter";
import AdSlot from "@/components/AdSlot";

export default function HomePage() {
  return (
    <main data-testid="home-page">
      <Hero />
      <Marquee />
      <div className="max-w-7xl mx-auto px-5">
        <AdSlot position="top-banner" format="horizontal" minHeight={120} />
      </div>
      <WeeklySummary />
      <NewsFeed />
      <div className="max-w-3xl mx-auto px-5">
        <AdSlot position="pre-footer" format="auto" minHeight={250} />
      </div>
      <Newsletter />
    </main>
  );
}
