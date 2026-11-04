import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import portraitImg from '../../assets/images/hero/halftone-me.webp';

/**
 * The pink quarter-circle in the top-right corner of the hero.
 * Hover it and it grows to show the portrait.
 *
 * SIZE: the circle is always SQUARE (width = height). With a rounded
 * bottom-left corner, a square box is a perfect quarter circle whose
 * center is the top-right corner of the screen, so the arc runs exactly
 * from the top-left to the bottom-right corner of the box and the
 * portrait is clipped cleanly by it (no leftover pink ledge).
 *   CLOSED -> size of the little circle before you hover
 *   OPEN   -> size when hovered (on narrow screens it shrinks to 86% of the width)
 */
const CLOSED = 64;
const OPEN = 500;

function useOpenSize() {
  const read = () =>
    typeof window === 'undefined' ? OPEN : Math.min(OPEN, Math.round(window.innerWidth * 0.86));
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

// small arrow that points at the circle and nudges toward it
function HoverArrow({ animateIt }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={animateIt ? { x: [0, 5, 0] } : undefined}
      transition={animateIt ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </motion.svg>
  );
}

export default function CornerPortrait() {
  const [isHovered, setIsHovered] = useState(false);
  const reduce = useReducedMotion();
  const openSize = useOpenSize();
  const size = isHovered ? openSize : CLOSED;

  return (
    // "absolute" (was "fixed") so it belongs to the hero and doesn't float over the other sections
    <div className="absolute top-0 right-0 z-40 flex items-start justify-end pointer-events-none">
      {/* "hover me" + arrow in idle state */}
      <AnimatePresence>
        {!isHovered && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-[18px] mr-3 flex items-center gap-2 font-sans text-[15px] tracking-wider text-zinc-300"
          >
            hover me
            <HoverArrow animateIt={!reduce} />
          </motion.span>
        )}
      </AnimatePresence>

      {/* Expandable Pink Quarter-Circle (always square, so the arc is exact) */}
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: size, height: size }}
        transition={{ type: 'spring', stiffness: 180, damping: 24 }}
        className="bg-[#C84B82] rounded-bl-full relative overflow-hidden cursor-pointer pointer-events-auto shadow-2xl"
      >
        <motion.img
          src={portraitImg}
          alt="Janica Centino"
          draggable={false}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.9,
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full object-cover object-bottom select-none pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
