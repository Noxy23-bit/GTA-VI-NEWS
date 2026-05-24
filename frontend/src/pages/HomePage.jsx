import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import NewsFeed from "@/components/NewsFeed";
import WeeklySummary from "@/components/WeeklySummary";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <main data-testid="home-page">
      <Hero />
      <Marquee />
      <WeeklySummary />
      <NewsFeed />
      <Newsletter />
    </main>
  );
}
