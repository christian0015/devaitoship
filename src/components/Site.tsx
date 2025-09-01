'use client';

import { useState } from 'react';
import Header from './ui/Header';
import Footer from './ui/Footer';

import HomeSection from './sections/HomeSection';
import AboutSection from './sections/AboutSection';
import FeaturesSection from './sections/FeaturesSection';
import PricingSection from './sections/PricingSection';

// import '@/styles/site.css';

export default function Site() {
  const [currentSection, setCurrentSection] = useState('home');

  const renderContent = () => {
    switch (currentSection) {
      case 'about': return <AboutSection />;
      case 'features': return <FeaturesSection />;
      case 'pricing': return <PricingSection />;
      default: return <HomeSection />;
    }
  };

  return (
    <div className="appContainer">
      <Header current={currentSection} onChange={setCurrentSection} />
      <main className="mainContent">{renderContent()}</main>
      <Footer onChange={setCurrentSection} />
    </div>
  );
}
