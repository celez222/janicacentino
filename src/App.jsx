import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Preloader from './components/layout/Preloader';

const Home = lazy(() => import('./pages/Home'));
const CaseStudyTemplate = lazy(() => import('./pages/CaseStudyTemplate'));

/**
 * Routes:
 *   /              -> the portfolio (Home)
 *   /work/:slug    -> one case study (screen-mate, bantay-paws, ecoquest,
 *                     cosmic-chronicles, tives-toolkit)
 *
 * ScrollToHash: when you come back from a case study to "/#ui-ux-design",
 * this scrolls the page down to that section once it has loaded.
 */
function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return undefined;
    const id = hash.slice(1);
    let tries = 0;
    // Home is lazy-loaded and the section may not be on screen yet - keep trying for ~5s
    const timer = setInterval(() => {
      const el = document.getElementById(id);
      tries += 1;
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        clearInterval(timer);
      } else if (tries > 50) {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <Suspense fallback={<Preloader />}>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudyTemplate />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}
