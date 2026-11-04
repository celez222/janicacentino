import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ------------------------------ sizes ------------------------------ */
// Collapsed (always visible) and expanded (on hover). Change these to resize the dock.
const COLLAPSED = { width: 220, height: 30 };
const EXPANDED = { width: 600, height: 76 };
/* ------------------------------------------------------------------- */

export default function BottomDock() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      {/* Soft pink glow behind the dock so the collapsed pill is easy to spot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#C84B82]/45 blur-xl"
        animate={{ opacity: isHovered ? 0.55 : 0.9 }}
        transition={{ duration: 0.3 }}
      />

      <motion.nav
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          width: isHovered ? EXPANDED.width : COLLAPSED.width,
          height: isHovered ? EXPANDED.height : COLLAPSED.height,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
        className="glass-surface relative flex cursor-pointer items-center justify-around overflow-hidden rounded-full border border-white/40 px-8 shadow-[0_0_30px_rgba(200,75,130,0.4)]"
      >
        {/* Glossy sheen across the top half */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/25 to-transparent" />

        {/* Handle shown while collapsed, so the dock reads as something to hover */}
        <AnimatePresence>
          {!isHovered && (
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
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="relative flex w-full items-center justify-between px-6 font-syne text-sm font-semibold uppercase tracking-[0.2em] text-white md:text-base"
            >
              <a href="#work" className="transition-colors hover:text-[#C84B82]">
                Work
              </a>
              <a href="#about" className="transition-colors hover:text-[#C84B82]">
                About
              </a>
              <a href="#contact" className="transition-colors hover:text-[#C84B82]">
                Contact
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
