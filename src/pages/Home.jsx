import React, { useEffect } from 'react';
import HeroSection from '../components/sections/HeroSection';
import UiUxSection from '../components/sections/UiUxSection';
import GraphicSection from '../components/sections/GraphicSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';
import BottomDock from '../components/layout/BottomDock';
import InteractiveGrid from '../components/layout/InteractiveGrid';

export default function Home() {
  // Smooth scrolling for the dock links (#work, #about, #contact)
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#121212] text-[#E2DFD7] relative overflow-x-hidden">
      {/* Animated, cursor-reactive grid (sits behind everything) */}
      <InteractiveGrid />

      {/* Section 1: Hero */}
      <HeroSection />

      {/* Section 2: Work = UI/UX first, then Graphic Design (the dock's "Work" link lands here) */}
      <div id="work">
        <UiUxSection />
        <GraphicSection />
      </div>

      {/* Section 3: About Me (the dock's "About" link lands here) */}
      <AboutSection />

      {/* Section 4: Contact */}
      <ContactSection />

      {/* Global Floating Bottom Dock */}
      <BottomDock />
    </div>
  );
}