import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Hero from "./sections/Hero";
import Ecosystem from "./sections/Ecosystem";
import Features from "./sections/Features";
import AISection from "./sections/AISection";
import Security from "./sections/Security";
import Waitlist from "./sections/Waitlist";
import ProductStory from "./sections/ProductStory";
import PlatformOverview from "./sections/PlatformOverview";
import FadeIn from "./components/animations/FadeIn";



export default function App() {
  return (
    <main className="min-h-screen bg-[#f8fbfc] text-slate-950 overflow-hidden">
      <Navbar />

<Hero />

<FadeIn>
  <Ecosystem />
</FadeIn>

<FadeIn>
  <Features />
</FadeIn>

<FadeIn>
  <ProductStory />
</FadeIn>

<FadeIn>
  <PlatformOverview />
</FadeIn>

<FadeIn>
  <AISection />
</FadeIn>

<FadeIn>
  <Security />
</FadeIn>

<FadeIn>
  <Waitlist />
</FadeIn>

<Footer />
    </main>
  );
}