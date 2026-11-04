import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { uiuxProjects, STAGE, HEADING } from '../../data/uiuxProjects';

/**
 * UI/UX collage.
 *
 * md and up: everything sits on a 1147x744 stage. With FIT_TO_SCREEN on (default)
 * the stage is scaled so the WHOLE collage fits in the window at once - titles
 * and text at the bottom included. Cosmic Chronicles and Tives Toolkit keep
 * running out to the screen edges. All sizes inside use `cqw` (1% of the stage
 * width) so the text scales with the collage.
 * Positions live in src/data/uiuxProjects.js.
 *
 * Hover (or focus / tap) a panel: it fades from grayscale to full color and
 * its description + "View Project" button slide into the gap next to it.
 *
 * below md: everything stacks into a single column with the text always shown.
 * RESPONSIVE FIX: below md the text and button use fixed, readable sizes
 * (14px text, 40px tall button) instead of the cqw sizes, which shrank to
 * their tiny minimums on phones. The title row wraps so the button never
 * squeezes the title, and each project has even spacing between its parts.
 *
 * ENTRANCE: when the section scrolls into view, every project slides in from
 * the side of the stage it sits on (left / right edge, or top / bottom).
 * Below md the projects simply rise into place one after another.
 *
 * Clicking a picture, or its "View Project" button, opens /work/<slug> (the case
 * study page). Pass `onOpen` to override.
 *
 * Fonts (loaded in src/index.css):
 *   Syne ExtraBold  -> UI/UX DESIGN title
 *   Perpetua Titling -> project titles (font-serif-thin)
 *   Syne Regular / Medium -> descriptions / button
 */

const PINK = '#C84B82';
const CREAM = '#E2DFD7';
const TEXT = '#F1EFEA';
const CLOSE_DELAY_MS = 220; // lets the pointer travel from a panel to its text/button

// true  -> scale the collage so it all fits in the window height (nothing is cut off below)
// false -> always full page width; the page scrolls if the window is short
const FIT_TO_SCREEN = true;

// gap between the stage and the screen edge (0 when the stage fills the width)
const BLEED_EXTRA = 'calc((100vw - 100%) / 2)';

/* ------------------------------ transitions ------------------------------ */
const EASE = [0.22, 1, 0.36, 1];
const FAR = 24; // how far (in % of the stage) a project travels in from its side

function useIsMd() {
  const query = '(min-width: 768px)';
  const [md, setMd] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMd(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return md;
}

// which side of the stage does this project sit on?
function enterFrom(p) {
  if (p.bleed === 'left') return { x: -FAR, y: 0 };
  if (p.bleed === 'right') return { x: FAR, y: 0 };
  const dx = (p.panel.l + p.panel.w / 2 - 50) * STAGE.w;
  const dy = (p.panel.t + p.panel.h / 2 - 50) * STAGE.h;
  return Math.abs(dx) >= Math.abs(dy)
    ? { x: Math.sign(dx || 1) * FAR, y: 0 }
    : { x: 0, y: Math.sign(dy || 1) * FAR };
}

// the stage only passes "hidden" / "show" down to its children
const stageVariants = { hidden: {}, show: {} };

const itemVariants = {
  hidden: ({ md, dir }) =>
    md ? { opacity: 0, x: `${dir.x}%`, y: `${dir.y}%` } : { opacity: 0, x: '0%', y: 48 },
  show: ({ delay }) => ({
    opacity: 1,
    x: '0%',
    y: 0,
    transition: { duration: 0.9, delay, ease: EASE },
  }),
};

const headingVariants = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};
/* ------------------------------------------------------------------------- */

function ViewButton({ onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      // below md: fixed 144 x 40 px, 13px text. md and up: scales with the stage (cqw).
      className={`flex h-10 w-36 items-center justify-center rounded-full font-syne text-[13px] font-medium transition-colors md:h-[var(--bh)] md:w-[var(--bw)] md:text-[length:var(--bf)] hover:border-[#C84B82] hover:bg-[#C84B82]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B82] ${className}`}
      style={{
        '--bw': 'max(120px, 9.84cqw)',
        '--bh': 'max(30px, 2.49cqw)',
        '--bf': 'max(11px, 0.8cqw)',
        color: TEXT,
        border: '1px solid rgba(200, 75, 130, 0.5)',
        background:
          'linear-gradient(90deg, rgba(200,75,130,0.30) 0%, rgba(200,75,130,0.05) 45%, rgba(0,0,0,0) 100%)',
        boxShadow: 'inset 8px 0 14px -10px rgba(200, 75, 130, 0.6)',
      }}
    >
      View Project
    </button>
  );
}

export default function UiUxSection({ onOpen }) {
  const [active, setActive] = useState(null);
  const timer = useRef(null);
  const md = useIsMd();
  const navigate = useNavigate();
  const open = (p) => (onOpen ? onOpen(p) : navigate(`/work/${p.slug}`));

  // Clicking a picture opens its case study. On touch screens that can't hover
  // (md and up), the first tap shows the description and the second tap opens it.
  const onPanelClick = (p, isActive) => {
    const touchOnly = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;
    if (md && touchOnly && !isActive) {
      show(p.id);
      return;
    }
    open(p);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (id) => {
    clearTimeout(timer.current);
    setActive(id);
  };
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setActive(null), CLOSE_DELAY_MS);
  };
  const hoverProps = (id) => ({
    onMouseEnter: () => show(id),
    onMouseLeave: hide,
    onFocus: () => show(id),
    onBlur: hide,
  });

  return (
    <section
      id="ui-ux-design"
      className="relative w-full select-none overflow-hidden px-6 py-16 md:p-0"
      style={{
        '--stage-w': FIT_TO_SCREEN
          ? `min(100vw, calc(100vh * ${STAGE.w} / ${STAGE.h}))`
          : '100vw',
      }}
    >
      {/* Stage */}
      <motion.div
        className="relative flex flex-col gap-12 md:mx-auto md:block md:w-[var(--stage-w)] md:aspect-[1147/744]"
        style={{ containerType: 'inline-size' }}
        variants={stageVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: md ? 0.35 : 0.1 }}
      >
        {/* ---------------------------- Title ---------------------------- */}
        {/*
          Drawn as SVG text so each word is stretched to EXACTLY the same width
          (textLength), like your mockup, without the letters overlapping.
          viewBox = the title box (453 x 100 stage px); font-size 55 gives the
          same cap height as the mockup. Baselines: UI/UX y=44, DESIGN y=93.
        */}
        <motion.h2
          aria-label="UI/UX Design"
          variants={headingVariants}
          className="z-10 mx-auto w-full max-w-[520px] md:absolute md:left-[var(--l)] md:top-[var(--t)] md:mx-0 md:w-[var(--w)] md:max-w-none"
          style={{
            '--l': `${HEADING.l}%`,
            '--t': `${HEADING.t}%`,
            '--w': `${HEADING.w}%`,
          }}
        >
          <svg
            viewBox="0 0 453 100"
            className="block w-full"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
            focusable="false"
          >
            <g fontFamily="Syne, system-ui, sans-serif" fontWeight="800" fontSize="55">
              <text x="2" y="44" textLength="450" lengthAdjust="spacingAndGlyphs" fill={CREAM}>
                UI/UX
              </text>
              <text x="0" y="93" textLength="448" lengthAdjust="spacingAndGlyphs" fill={PINK}>
                DESIGN
              </text>
            </g>
          </svg>
        </motion.h2>

        {/* --------------------------- Projects --------------------------- */}
        {uiuxProjects.map((p, i) => {
          const isActive = active === p.id;
          const ratio = ((p.panel.w / 100) * STAGE.w) / ((p.panel.h / 100) * STAGE.h);
          const right = p.info.align === 'right';

          // panels that run off a screen edge keep going when the stage is narrower than the screen
          const bleedL = p.bleed === 'left';
          const bleedR = p.bleed === 'right';
          const panelL = bleedL ? `calc(${p.panel.l}% - ${BLEED_EXTRA})` : `${p.panel.l}%`;
          const panelW =
            bleedL || bleedR ? `calc(${p.panel.w}% + ${BLEED_EXTRA})` : `${p.panel.w}%`;

          // optional small lift on hover (Tives Toolkit)
          const lift = p.hoverShift
            ? `${-((p.hoverShift / STAGE.w) * 100).toFixed(3)}cqw`
            : '0cqw';
          const liftClass = p.hoverShift
            ? `md:transition-transform md:duration-300 ${isActive ? 'md:translate-y-[var(--sy)]' : ''}`
            : '';

          return (
            // On md+ this is a stage-sized, click-through layer that carries the
            // entrance slide. The label / panel / info inside opt back in to clicks.
            // Below md it is a simple column (flex-col + gap-4) so title, picture
            // and text have even spacing.
            <motion.article
              key={p.id}
              variants={itemVariants}
              custom={{ md, dir: enterFrom(p), delay: 0.25 + i * 0.14 }}
              className={`flex flex-col gap-4 md:pointer-events-none md:absolute md:inset-0 md:block ${
                isActive ? 'md:z-20' : 'md:z-[1]'
              }`}
            >
              {/* Title label (+ the View Project button for projects that put it beside the title) */}
              <div
                className={`flex flex-wrap items-center gap-3 md:flex-nowrap md:gap-[0.8cqw] md:pointer-events-auto md:absolute md:left-[var(--ll)] md:top-[var(--lt)] ${liftClass}`}
                style={{
                  '--ll': `${p.label.l}%`,
                  '--lt': `${p.label.t}%`,
                  '--sy': lift,
                }}
                {...hoverProps(p.id)}
              >
                <span
                  className={`block font-serif-thin text-xl uppercase leading-none md:text-[length:var(--lf)] ${
                    p.label.vertical ? 'md:[writing-mode:vertical-rl]' : ''
                  }`}
                  style={{ '--lf': 'max(12px, 1.88cqw)', color: TEXT }}
                >
                  {p.title}
                </span>

                {p.buttonBeside && (
                  <ViewButton
                    onClick={() => open(p)}
                    className={`transition-opacity duration-300 ${
                      isActive
                        ? 'md:pointer-events-auto md:opacity-100'
                        : 'md:pointer-events-none md:opacity-0'
                    }`}
                  />
                )}
              </div>

              {/* Panel: grayscale until hovered, then full color */}
              {/* Click (or press Enter) on the picture to open the case study */}
              <div
                role="link"
                tabIndex={0}
                aria-label={`${p.title} - open case study`}
                onClick={() => onPanelClick(p, isActive)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open(p);
                  }
                }}
                className={`relative aspect-[var(--ar)] w-full cursor-pointer overflow-hidden border border-white/30 outline-none focus-visible:border-[#C84B82] md:pointer-events-auto md:absolute md:left-[var(--l)] md:top-[var(--t)] md:aspect-auto md:h-[var(--h)] md:w-[var(--w)] ${liftClass}`}
                style={{
                  '--ar': ratio,
                  '--l': panelL,
                  '--t': `${p.panel.t}%`,
                  '--w': panelW,
                  '--h': `${p.panel.h}%`,
                  '--sy': lift,
                }}
                {...hoverProps(p.id)}
              >
                {p.src ? (
                  <img
                    src={p.src}
                    alt={p.title}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className={`h-full w-full object-cover object-center transition duration-500 ${
                      isActive ? 'grayscale-0' : 'grayscale'
                    }`}
                  />
                ) : (
                  // Placeholder until you add the image: gray now, colored on hover
                  <div
                    className={`flex h-full w-full items-end p-4 transition duration-500 ${
                      isActive ? 'grayscale-0' : 'grayscale'
                    }`}
                    style={{ background: `linear-gradient(160deg, ${p.accent}, #1a1a1a)` }}
                  >
                    <span
                      className="font-serif-thin text-lg uppercase leading-none"
                      style={{ color: TEXT }}
                    >
                      {p.title}
                    </span>
                  </div>
                )}

                {p.hoverSrc && (
                  <img
                    src={p.hoverSrc}
                    alt=""
                    aria-hidden="true"
                    draggable={false}
                    loading="lazy"
                    className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-500 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                )}
              </div>

              {/* Description + button: always visible when stacked, slides in on hover on md+ */}
              <div
                className={`z-10 transition duration-300 md:absolute md:left-[var(--il)] md:w-[var(--iw)] ${
                  p.info.b !== undefined ? 'md:bottom-[var(--ib)]' : 'md:top-[var(--it)]'
                } ${
                  isActive
                    ? 'md:pointer-events-auto md:translate-y-0 md:opacity-100'
                    : 'md:pointer-events-none md:translate-y-2 md:opacity-0'
                }`}
                style={{
                  '--il': `${p.info.l}%`,
                  '--iw': `${p.info.w}%`,
                  '--it': `${p.info.t}%`,
                  '--ib': `${p.info.b}%`,
                }}
                {...hoverProps(p.id)}
              >
                <p
                  className={`m-0 font-syne text-[14px] font-normal leading-[1.5] md:text-[length:var(--df)] md:leading-[1.38] ${
                    right ? 'md:text-right' : ''
                  }`}
                  style={{ '--df': 'max(11px, 0.95cqw)', color: TEXT }}
                >
                  {p.text}
                </p>

                {!p.buttonBeside && (
                  <div className={`mt-3 flex md:mt-[0.7cqw] ${right ? 'md:justify-end' : ''}`}>
                    <ViewButton onClick={() => open(p)} />
                  </div>
                )}
              </div>
            </motion.article>
          );
        })}
      </motion.div>
    </section>
  );
}
