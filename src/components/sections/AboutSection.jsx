import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { aboutTabs } from '../../data/aboutTabs';
import FolderDrawer from '../ui/FolderDrawer';
import portraitImg from '../../assets/images/hero/halftone-me.webp';

/**
 * "ABOUT ME" - an outlined file folder full of papers.
 *
 *   - Click a paper (or its cream tab) to pull it out and read it.
 *   - Click a paper edge peeking out on the sides, or use the arrow
 *     buttons / left + right arrow keys, to flip to another paper.
 *   - Close with the X, Esc, or by clicking anywhere outside the folder.
 *
 * ENTRANCE: the folder slides up like a drawer, and the heading rises out
 * from behind the folder tab.
 *
 * Content lives in src/data/aboutTabs.js.
 * The folder drawing lives in src/components/ui/FolderDrawer.jsx.
 *
 * To resize the heading AND the folder together, change --fw below
 * (it is the folder's width: 61% of the screen, never below ~300px
 * and never above 900px).
 */

const PINK = '#C84B82';
const MAX_TABS = 6; // the folder has room for 6 papers
const EASE = [0.22, 1, 0.36, 1];

const shownTabs = aboutTabs.slice(0, MAX_TABS);

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: 0.15, ease: 'easeOut' },
};

const bodyText = 'text-[13px] leading-relaxed text-[#E2DFD7]/80 @xl:text-[15px]';

/* ----------------------------- paper contents ----------------------------- */

function Title({ parts }) {
  return (
    <h3 className="m-0 font-display text-xl font-extrabold uppercase leading-[1.05] tracking-wide text-[#E2DFD7] @xl:text-3xl">
      {parts[0]}
      <span className="text-[#C84B82]">{parts[1]}</span>
    </h3>
  );
}

function ProfileView({ tab }) {
  return (
    <motion.div
      {...fadeIn}
      className="flex min-h-full flex-col justify-center gap-5 p-5 @xl:flex-row @xl:items-center @xl:gap-9 @xl:p-9"
    >
      <div className="mx-auto h-32 w-32 shrink-0 overflow-hidden rounded-full bg-[#C84B82] @xl:h-48 @xl:w-48">
        <img
          src={portraitImg}
          alt="Janica Centino"
          draggable={false}
          decoding="async"
          className="h-full w-full object-cover object-bottom"
        />
      </div>

      <div className="min-w-0">
        <p className="m-0 mb-2 font-serif-thin text-xs uppercase tracking-wider text-white/70 @xl:text-base">
          {tab.eyebrow}
        </p>
        <Title parts={tab.title} />
        {tab.paragraphs.map((text) => (
          <p key={text} className={`mb-0 mt-3 ${bodyText}`}>
            {text}
          </p>
        ))}
        <ul className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
          {tab.highlights.map((item) => (
            <li
              key={item}
              className="rounded-full border border-[#C84B82]/70 px-3 py-1 text-xs text-[#E2DFD7] @xl:text-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function TimelineView({ tab }) {
  return (
    <motion.div {...fadeIn} className="flex min-h-full flex-col justify-center gap-5 p-5 @xl:p-9">
      <Title parts={tab.title} />

      <ol className="m-0 list-none border-l border-white/20 p-0 pl-5">
        {tab.items.map((item) => (
          <li key={`${item.title}-${item.period}`} className="relative pb-5 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[25px] h-2 w-2 rounded-full bg-[#C84B82]"
            />
            <p className="m-0 text-[11px] uppercase tracking-[0.18em] text-[#C84B82]">{item.period}</p>
            <h4 className="m-0 mt-1 font-display text-sm font-bold text-[#E2DFD7] @xl:text-lg">
              {item.title}
            </h4>
            <p className="m-0 text-xs text-white/60 @xl:text-sm">{item.place}</p>

            {item.note && <p className={`mb-0 mt-2 ${bodyText}`}>{item.note}</p>}

            {item.bullets && (
              <ul className="m-0 mt-2 list-none space-y-1 p-0">
                {item.bullets.map((line) => (
                  <li key={line} className={`flex gap-2 ${bodyText}`}>
                    <span aria-hidden="true" className="text-[#C84B82]">
                      ›
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

function SkillsView({ tab }) {
  return (
    <motion.div {...fadeIn} className="flex min-h-full flex-col justify-center gap-5 p-5 @xl:p-9">
      <Title parts={tab.title} />

      <div className="flex flex-col gap-4">
        {tab.groups.map((group) => (
          <div key={group.name}>
            <p className="m-0 mb-2 text-[11px] uppercase tracking-[0.18em] text-[#C84B82]">{group.name}</p>
            <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/25 bg-white/5 px-3 py-1 text-xs text-[#E2DFD7] transition-colors hover:border-[#C84B82] hover:text-[#C84B82] @xl:text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function renderPaper(tab) {
  switch (tab.type) {
    case 'profile':
      return <ProfileView tab={tab} />;
    case 'timeline':
      return <TimelineView tab={tab} />;
    case 'skills':
      return <SkillsView tab={tab} />;
    default:
      return null;
  }
}

/* -------------------------------- section -------------------------------- */

export default function AboutSection() {
  const [activeId, setActiveId] = useState(null);
  const active = shownTabs.find((t) => t.id === activeId) ?? null;

  const close = useCallback(() => setActiveId(null), []);

  const step = useCallback((dir) => {
    setActiveId((current) => {
      const i = shownTabs.findIndex((t) => t.id === current);
      if (i < 0) return current;
      return shownTabs[(i + dir + shownTabs.length) % shownTabs.length].id;
    });
  }, []);

  // While a paper is open: Esc closes, arrows flip, clicking outside closes
  useEffect(() => {
    if (!activeId) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    const onPointerDown = (e) => {
      if (e.target instanceof Element && !e.target.closest('[data-about-folder]')) close();
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [activeId, close, step]);

  return (
    <section
      id="about"
      className="relative flex w-full flex-col items-center"
      style={{
        '--fw': 'min(900px, max(61vw, min(92vw, 520px)))',
        paddingTop: 'clamp(64px, 7.5vw, 150px)', // gap under Graphic Design
        paddingBottom: '9rem', // room for the floating dock
      }}
    >
      {/* ---------------------------- Heading ---------------------------- */}
      {/*
        Syne ExtraBold drawn as SVG text so both words are pulled tall and
        sit exactly side by side (same trick as GRAPHIC DESIGN).
        zIndex is set to 1 so the bottom edge tucks behind the folder tab.
        It starts lower (y: 70) and rises up out of the folder as it fades in.
      */}
      <motion.h2
        aria-label="About me"
        className="pointer-events-none relative m-0 select-none"
        style={{ zIndex: 1, width: 'calc(var(--fw) * 0.97)' }}
        initial={{ opacity: 0, y: 70 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      >
        <svg
          viewBox="0 0 1000 170"
          className="block w-full"
          style={{
            overflow: 'visible',
            filter: 'drop-shadow(0 0 16px rgba(200, 75, 130, 0.2))',
          }}
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="about-heading-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.55" stopColor="#F4F1EA" />
              <stop offset="1" stopColor="#FFF6FA" />
            </linearGradient>
          </defs>
          <g fontFamily="Syne, system-ui, sans-serif" fontWeight="800">
            <text
              transform="translate(0 166) scale(1 2.27)"
              fontSize="110.6"
              textLength="666"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#about-heading-fill)"
            >
              ABOUT
            </text>
            <text
              transform="translate(710 166) scale(1 2.27)"
              fontSize="110.6"
              textLength="290"
              lengthAdjust="spacingAndGlyphs"
              fill={PINK}
            >
              ME
            </text>
          </g>
        </svg>
      </motion.h2>

      {/* ----------------------------- Folder ----------------------------- */}
      {/* slides up like a drawer being pushed in */}
      <motion.div
        className="relative w-full"
        style={{ zIndex: 10, marginTop: 'calc(var(--fw) * -0.027)' }}
        initial={{ opacity: 0, y: 120 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <FolderDrawer
          tabs={shownTabs}
          activeId={activeId}
          onSelect={setActiveId}
          onClose={close}
          onStep={step}
        >
          {active && renderPaper(active)}
        </FolderDrawer>
      </motion.div>
    </section>
  );
}
