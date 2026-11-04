import React from 'react';
import { motion } from 'framer-motion';
import CornerPortrait from '../layout/CornerPortrait';

const EASE = [0.22, 1, 0.36, 1];

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
      className="relative min-h-screen w-full flex flex-col justify-between p-8 md:p-12 overflow-hidden select-none"
    >
      {/* Top Left Brand Header */}
      <motion.header
        className="z-10"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <h2 className="font-display text-xl md:text-2xl font-extrabold tracking-widest uppercase text-[#E2DFD7]">
          JANICA CENTINO
        </h2>
      </motion.header>

      {/* Top Right Interactive Portrait */}
      <CornerPortrait />

      {/* Bottom Left Hero Typography */}
      <div className="z-10 mt-auto mb-6">
        <motion.p
          className="font-serif-thin text-xl md:text-3xl tracking-wider uppercase text-white/90 mb-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          UI/UX DESIGNER | GRAPHIC DESIGNER
        </motion.p>

        <motion.h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] font-extrabold leading-[1.05] tracking-wide uppercase"
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
