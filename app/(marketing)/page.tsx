import Features from './_components/features-1';
import { HeroHeader } from './_components/header';
import HeroSection from './_components/hero-section';

export default function Home() {
  return (
    <div className="">
      <HeroHeader />
      <HeroSection />
      <Features />
    </div>
  );
}
