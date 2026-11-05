import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Floating bottom dock: a small glass pill that expands into Work / About / Contact.
 *
 * RESPONSIVE
 *   - The expanded width never goes wider than the screen (screen - 2 x SIDE_GAP),
 *     and padding, text size and letter-spacing shrink on phones, so the three
 *     words always have room between them.
 *   - Mouse: expands on hover.
 *   - Touch: tap the pill to open it, tap it again (or anywhere else) to close it.
 *     (Phones have no real hover, which is why it used to stay stuck open.)
 *   - Keyboard: focusing the dock opens it.
 *
 * GLASS (iOS "liquid glass" look)
 *   Three layers sit behind the links:
 *     1. a distortion layer - blurs AND warps whatever is behind the dock
 *        (an SVG displacement filter used as a backdrop-filter)
 *     2. a tint layer - a faint white-to-pink gradient plus bright inner edges
 *     3. a glossy sheen across the top half
 *   The warping only works in Chrome / Edge / other Chromium browsers (desktop and
 *   Android). Safari, Firefox and every iPhone browser can't run SVG filters on a
 *   backdrop, so they automatically get the frosted blur version instead.
 *
 * Tweak the look with the GLASS settings below.
 */

/* ------------------------------ sizes ------------------------------ */
const COLLAPSED = {
  desktop: { width: 220, height: 30 },
  mobile: { width: 170, height: 34 }, // a bit taller so it is easy to tap
};
const EXPANDED = {
  desktop: { width: 600, height: 76 },
  mobile: { width: 600, height: 60 }, // width is capped to the screen below
};
const MOBILE_BREAKPOINT = 640;
const SIDE_GAP = 16; // minimum space (px) between the dock and the screen edge

/* ------------------------------ glass ------------------------------ */
const GLASS = {
  distortion: 24, // how strongly the background is warped (0 = none, 60 = very wavy)
  blur: 4, // px of blur on top of the warp (Chromium)
  fallbackBlur: 16, // px of blur when warping isn't supported
  saturate: 180, // % color boost behind the glass
};
const FILTER_ID = 'dock-glass-distortion';
/* ------------------------------------------------------------------- */

const LINKS = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
];

function useViewportWidth() {
  // Use the narrower of the two readings so a scrollbar or zoomed layout can't make the dock too wide
  const read = () =>
    typeof window === 'undefined'
      ? 1440
      : Math.min(window.innerWidth, document.documentElement.clientWidth || window.innerWidth);
  const [w, setW] = useState(read);
  useEffect(() => {
    const onResize = () => setW(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return w;
}

// SVG filters on a backdrop only work in Chromium (Chrome, Edge, Android browsers).
// iPhone browsers (even Chrome on iOS) use WebKit, so they report "CriOS", not "Chrome/".
function supportsDistortion() {
  if (typeof window === 'undefined' || typeof CSS === 'undefined' || !CSS.supports) return false;
  return CSS.supports('backdrop-filter', 'url(#a)') && /Chrome\/\d+/.test(navigator.userAgent);
}

const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

export default function BottomDock() {
  const [open, setOpen] = useState(false);
  const [distort] = useState(supportsDistortion);
  const navRef = useRef(null);
  const vw = useViewportWidth();

  const compact = vw < MOBILE_BREAKPOINT;
  const collapsed = compact ? COLLAPSED.mobile : COLLAPSED.desktop;
  const expandedBase = compact ? EXPANDED.mobile : EXPANDED.desktop;
  const expanded = {
    width: Math.min(expandedBase.width, vw - SIDE_GAP * 2),
    height: expandedBase.height,
  };

  // Touch: tapping anywhere outside the dock closes it
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  const backdrop = distort
    ? `url(#${FILTER_ID}) blur(${GLASS.blur}px) saturate(${GLASS.saturate}%) brightness(1.08)`
    : `blur(${GLASS.fallbackBlur}px) saturate(${GLASS.saturate}%) brightness(1.08)`;

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      {/* The warp itself: a soft noise map that pushes the pixels behind the glass around */}
      <svg aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter
            id={FILTER_ID}
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.03"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="map" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={GLASS.distortion}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Soft pink glow behind the dock so the collapsed pill is easy to spot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#C84B82]/45 blur-xl"
        animate={{ opacity: open ? 0.55 : 0.9 }}
        transition={{ duration: 0.3 }}
      />

      <motion.nav
        ref={navRef}
        aria-label="Main"
        tabIndex={0}
        // Mouse hover opens / closes. Touch ignores these and uses tap (onClick) instead.
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen(false)}
        onClick={() => {
          if (!canHover()) setOpen((o) => !o);
        }}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
        }}
        animate={{
          width: open ? expanded.width : collapsed.width,
          height: open ? expanded.height : collapsed.height,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        // Hard limit in CSS: the dock can never be wider than the screen, whatever the JS says
        style={{ maxWidth: `calc(100vw - ${SIDE_GAP * 2}px)` }}
        className="relative flex cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border border-white/35 shadow-[0_8px_32px_rgba(0,0,0,0.35),0_0_30px_rgba(200,75,130,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-[#C84B82]"
      >
        {/* 1) Distortion + blur of whatever is behind the dock */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
        />

        {/* 2) Tint and bright inner edges, like light catching the rim of the glass */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 50%, rgba(200,75,130,0.12) 100%)',
            boxShadow:
              'inset 0 1px 1px rgba(255,255,255,0.6), inset 0 -1px 1px rgba(255,255,255,0.18), inset 0 0 18px rgba(255,255,255,0.12)',
          }}
        />

        {/* 3) Glossy sheen across the top half */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent" />

        {/* Handle shown while collapsed, so the dock reads as something to hover or tap */}
        <AnimatePresence>
          {!open && (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[5px] w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative flex w-full items-center justify-around px-2 font-syne text-[11px] font-semibold uppercase tracking-[0.14em] text-white sm:justify-between sm:px-8 sm:text-sm sm:tracking-[0.2em] md:text-base"
            >
              {LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="px-2 py-2 transition-colors hover:text-[#C84B82] sm:px-3"
                >
                  {l.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
