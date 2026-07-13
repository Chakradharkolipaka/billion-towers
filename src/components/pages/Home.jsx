import React, { useEffect } from 'react';
import HomeHero from './home/HomeHero';
import HomeStatsTrustSection from './home/HomeStatsTrustSection';
import HomeSteps from './home/HomeSteps';
import HomeFeatures from './home/HomeFeatures';
import HomeClosingCta from './home/HomeClosingCta';

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-transparent">
      <HomeHero />
      <HomeStatsTrustSection />
      <HomeSteps />
      <HomeFeatures />
      <HomeClosingCta />
    </div>
  );
};

export default Home;
