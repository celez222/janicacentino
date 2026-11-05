import React from 'react';
import { motion } from 'framer-motion';
import CornerPortrait from '../layout/CornerPortrait';

const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------ responsive ------------------------------ */
// The headline can never be wider than its box. Its size is the smaller of:
//   - the normal size for the breakpoint (--fs, set by the classes on the <h1>), and
//   - FIT percent of the box width (cqw), so the longest word (PROGRAMMED /
//     DISMANTLED) always fits on one line.
// If a word is still cut off on some screen, lower FIT a little (e.g. 7.4).
// If the headline looks too small on phones, raise it a little (e.g. 8.2).
const FIT = 7.9;
/* ------------------------------------------------------------------------- */

// each headline line slides up out of its own masked box
const line = {
  hidden: { y: '115%' },
  show: (i) => ({
    y: '0%',
    transition: { duration: 0.9, delay: 0.35 + i * 0.12, ease: EASE },
  }),
};

const HEADLINE = [
  ['DISMANTLED GRID.', 'text-[#E2DFD7]'],
  ['PROGRAMMED', 'text-[#E2DFD7]'],
  ['VISCERAL.', 'text-[#C84B82]'],
];

export default function HeroSection() {
  return (
    <section
      id="home"
      // pb-20 on phones keeps the headline clear of the floating dock at the bottom
      className="relative flex min-h-screen w-full select-none flex-col justify-between overflow-hidden px-5 pb-20 pt-6 sm:p-8 md:p-12"
      style={{ minHeight: '100svh' }}
    >
      {/* Top Left Brand Header */}
      <motion.header
        className="z-10 max-w-[58%] sm:max-w-none"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <h2 className="font-display text-base font-extrabold uppercase tracking-[0.12em] text-[#E2DFD7] sm:text-xl sm:tracking-widest md:text-2xl">
          JANICA CENTINO
        </h2>
      </motion.header>

      {/*
        Top Right Interactive Portrait ("hover me").
        Wrapped so the whole thing (picture + label) shrinks on smaller screens,
        always shrinking toward the top-right corner it sits in.
      */}
      <div className="absolute right-0 top-0 z-10 origin-top-right scale-[0.55] sm:scale-75 md:scale-100">
        <CornerPortrait />
      </div>

      {/* Bottom Left Hero Typography */}
      {/* containerType makes the headline measure itself against THIS box (cqw units) */}
      <div className="z-10 mb-6 mt-auto" style={{ containerType: 'inline-size' }}>
        <motion.p
          className="mb-3 font-serif-thin text-base uppercase tracking-wider text-white/90 sm:text-xl md:text-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          UI/UX DESIGNER | GRAPHIC DESIGNER
        </motion.p>

        <motion.h1
          className="font-display font-extrabold uppercase leading-[1.05] tracking-normal [--fs:2.25rem] sm:tracking-wide sm:[--fs:3.75rem] md:[--fs:4.5rem] lg:[--fs:5.2rem]"
          style={{ fontSize: `min(var(--fs), ${FIT}cqw)` }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {HEADLINE.map(([text, color], i) => (
            <span key={text} className="block overflow-hidden pb-[0.08em]">
              <motion.span className={`block ${color}`} custom={i} variants={line}>
                {text}
              </motion.span>
            </span>
          ))}
        </motion.h1>
      </div>
    </section>
  );
}
