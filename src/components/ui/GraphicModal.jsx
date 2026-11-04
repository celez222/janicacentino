import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DiIllustrator } from 'react-icons/di';

/**
 * Pop-up viewer for the Graphic Design carousel.
 * The enlarged card springs up from the fan, the rest of the page stays
 * visible behind a soft dim. Close with the X, a backdrop click, or Esc.
 * Left / right arrows (buttons or keyboard) move to the neighbouring project.
 *
 * Around the card (wide screens) sit three details, each drawn like a
 * selected element in a design editor (thin white outline + a square
 * handle on all 4 corners):
 *   - left:         title, category and description (glass box)
 *   - top right:    "Made with" tool logo(s)
 *   - bottom right: year (glass box)
 * On smaller screens they collapse into one row under the card.
 *
 * RESPONSIVE FIX: the wrapper around the card is now capped to the screen
 * width, and the info bar under the card no longer pushes the wrapper wider
 * than the image (w-0 + min-w-full), so nothing is cut off on phones.
 *
 * TOOL LOGOS: 'figma' and 'illustrator' are drawn with real logos
 * (Illustrator comes from the react-icons library, Figma is drawn in code).
 * For any tool you can also save your own logo file in
 *   src/assets/icons/tools/   named after the tool, e.g.  canva.png  figma.webp
 * (png, svg and webp all work) - your file always wins. If there is no file
 * and no built-in logo, a simple look-alike badge is drawn instead.
 */

const toolLogos = import.meta.glob('../../assets/icons/tools/*.{svg,png,webp}', {
  eager: true,
  import: 'default',
});

const logoFor = (key) => {
  const hit = Object.entries(toolLogos).find(
    ([path]) =>
      path
        .split('/')
        .pop()
        .replace(/\.[^.]+$/, '')
        .toLowerCase() === key
  );
  return hit ? hit[1] : null;
};

const glassBtn =
  'flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B82]';

// Glassmorphism (same recipe as the bottom dock, but with square corners):
// translucent gradient + strong blur/saturation + bright top edge.
const glassPanel = {
  WebkitBackdropFilter: 'blur(20px) saturate(170%)',
  backdropFilter: 'blur(20px) saturate(170%)',
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.07) 55%, rgba(200,75,130,0.12) 100%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 10px 32px rgba(0,0,0,0.4)',
};

/* ------------------------- selection-style frame ------------------------- */
// Thin white outline with a small white square on each of the 4 corners,
// like an element that's selected in Canva / Figma.
const HANDLES = [
  '-left-[4.5px] -top-[4.5px]',
  '-right-[4.5px] -top-[4.5px]',
  '-bottom-[4.5px] -left-[4.5px]',
  '-bottom-[4.5px] -right-[4.5px]',
];

function SelectionFrame({ children, className = '', style, delay = 0.25 }) {
  // Only add "relative" when the caller isn't positioning it with "absolute"
  // (having both classes made the box fall back into normal flow).
  const position = /\babsolute\b/.test(className) ? '' : 'relative';

  return (
    <motion.div
      className={`${position} border border-white/80 ${className}`}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
      {HANDLES.map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute h-2 w-2 bg-[#f4f4f4] ${pos}`}
        />
      ))}
    </motion.div>
  );
}

/* ---------------------------- tool badges ---------------------------- */

// Rounded app-icon tile that a logo sits on
function LogoTile({ size, label, bg, border, children }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="flex items-center justify-center"
      style={{ width: size, height: size, background: bg, border, borderRadius: size * 0.2 }}
    >
      {children}
    </span>
  );
}

// The official five-color Figma mark
function FigmaMark({ height }) {
  return (
    <svg
      viewBox="0 0 38 57"
      height={height}
      width={(height * 38) / 57}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

function ToolBadge({ tool, size = 64 }) {
  const key = String(tool).toLowerCase();
  const base = { width: size, height: size };

  // 1) Your own logo file, if you added one
  const logo = logoFor(key);
  if (logo) {
    return (
      <img
        src={logo}
        alt={toolName(tool)}
        draggable={false}
        className={`block object-contain ${key === 'canva' ? 'rounded-full' : ''}`}
        style={base}
      />
    );
  }

  // 2) Built-in logos
  if (key === 'figma') {
    return (
      <LogoTile size={size} label="Figma" bg="#1e1e1e" border="1px solid rgba(255,255,255,0.25)">
        <FigmaMark height={size * 0.62} />
      </LogoTile>
    );
  }

  if (key === 'illustrator') {
    return (
      <LogoTile size={size} label="Adobe Illustrator" bg="#330000" border="2px solid #ff9a00">
        <DiIllustrator size={size * 0.7} color="#ff9a00" aria-hidden="true" />
      </LogoTile>
    );
  }

  // 3) Fallback: simple look-alike badges
  if (key === 'canva') {
    return (
      <span
        role="img"
        aria-label="Canva"
        className="flex items-center justify-center rounded-full text-white"
        style={{
          ...base,
          background: 'linear-gradient(135deg, #00c4cc 0%, #5a6cf0 55%, #7d2ae8 100%)',
          fontFamily: "'Pacifico', 'Brush Script MT', 'Segoe Script', cursive",
          fontSize: size * 0.3,
          fontStyle: 'italic',
        }}
      >
        Canva
      </span>
    );
  }

  const squares = {
    photoshop: { text: 'Ps', bg: '#001e36', fg: '#31a8ff', label: 'Photoshop' },
  };
  const s = squares[key];

  if (s) {
    return (
      <span
        role="img"
        aria-label={s.label}
        className="flex items-center justify-center font-bold"
        style={{
          ...base,
          background: s.bg,
          color: s.fg,
          border: `2px solid ${s.fg}`,
          fontSize: size * 0.4,
        }}
      >
        {s.text}
      </span>
    );
  }

  // 4) Unknown tool -> plain text label
  return (
    <span
      className="flex items-center justify-center bg-white/10 px-3 text-xs font-semibold text-white"
      style={{ height: size * 0.6 }}
    >
      {tool}
    </span>
  );
}

function toolName(t) {
  const k = String(t).toLowerCase();
  return { canva: 'Canva', photoshop: 'Photoshop', illustrator: 'Illustrator', figma: 'Figma' }[k] ?? t;
}

/* -------------------------------- modal -------------------------------- */
export default function GraphicModal({ project, onClose, onPrev, onNext }) {
  // Keyboard controls + lock page scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onPrev, onNext]);

  const src = project.full ?? project.src;
  const tools = project.tools ?? [];

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[45] flex items-start justify-center overflow-y-auto px-4 pb-24 pt-[4vh]"
      // NOTE: no backdrop-filter on this element. A blurred parent stops the glass
      // boxes inside from seeing the page behind them, so the blur lives on a
      // separate sibling layer below instead.
      style={{ background: 'rgba(8, 8, 8, 0.45)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 backdrop-blur-[3px]" />

      {/* Springs up out of the fan, shrinks back into it on close.
          max-w-full keeps it inside the screen padding on phones. */}
      <motion.div
        className="relative max-w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.55, y: 260, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.55, y: 260, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            {src ? (
              <img
                src={src}
                alt={project.title}
                draggable={false}
                className="block h-auto max-h-[72vh] w-auto max-w-[min(calc(100vw_-_2rem),720px)] object-contain"
              />
            ) : (
              <div
                className="flex aspect-square w-[min(calc(100vw_-_2rem),520px)] items-end p-8"
                style={{ background: `linear-gradient(145deg, ${project.accent}, #121212)` }}
              >
                <p className="font-syne font-bold text-3xl uppercase leading-none tracking-wide text-[#E2DFD7]">
                  {project.title}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ------------- Selection-style details around the card (wide screens) ------------- */}
        {/* Keyed so the boxes fade in again whenever the project changes */}
        <div
          key={`details-${project.id}`}
          className="pointer-events-none absolute inset-0 hidden xl:block"
        >
          {/* Left: title / category / description (glass box) */}
          <SelectionFrame
            className="pointer-events-auto absolute top-[8%] w-[180px] p-4 text-white"
            style={{ ...glassPanel, left: -145 }}
          >
            <p className="font-syne text-[11px] font-medium tracking-wide text-white/75">{project.category}</p>
            <h3 className="mt-1 font-syne font-bold text-base uppercase leading-[1.05] tracking-wide">
              {project.title}
            </h3>
            {project.description && (
              <p className="mt-2 font-syne text-xs leading-relaxed text-white/80">{project.description}</p>
            )}
          </SelectionFrame>

          {/* Top right: tool logo in a selection frame, "Made with" underneath */}
          {tools.length > 0 && (
            <motion.div
              className="pointer-events-auto absolute top-[6%] flex flex-col items-center gap-2"
              style={{ right: -118 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <div className="flex flex-col items-center gap-3">
                {tools.map((t) => (
                  <SelectionFrame key={t} className="p-1" delay={0}>
                    <ToolBadge tool={t} size={74} />
                  </SelectionFrame>
                ))}
              </div>
              <span className="font-syne text-xs font-medium text-white/80">Made with</span>
            </motion.div>
          )}

          {/* Bottom right: year (glass box) */}
          {project.year && (
            <SelectionFrame
              className="pointer-events-auto absolute bottom-[14%] px-4 py-2 text-white"
              style={{ ...glassPanel, right: -95, minWidth: 113 }}
            >
              <p className="font-syne text-[11px] font-medium tracking-wide text-white/75">Year</p>
              <p className="font-syne font-bold text-lg leading-none tracking-wide">{project.year}</p>
            </SelectionFrame>
          )}
        </div>

        {/* ------------- Compact details under the card (smaller screens) ------------- */}
        {/* w-0 + min-w-full: the bar takes the card's width but never makes the
            wrapper wider than the image, so a long title truncates instead of
            pushing everything off the screen. */}
        <SelectionFrame
          className="mt-5 flex w-0 min-w-full items-center justify-between gap-4 p-4 text-white xl:hidden"
          style={glassPanel}
        >
          <div className="min-w-0">
            <p className="font-syne text-[11px] font-medium tracking-wide text-white/75">
              {[project.category, project.year].filter(Boolean).join(' · ')}
            </p>
            <h3 className="truncate font-syne font-bold text-base uppercase tracking-wide">{project.title}</h3>
          </div>
          {tools.length > 0 && (
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-syne text-xs text-white/80">Made with</span>
              {tools.map((t) => (
                <ToolBadge key={t} tool={t} size={36} />
              ))}
            </div>
          )}
        </SelectionFrame>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`${glassBtn} absolute right-3 top-3`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>

        {/* Previous / next project (lower than center so they never touch the left box) */}
        <button
          type="button"
          onClick={onPrev}
          aria-label="Previous project"
          className={`${glassBtn} absolute left-3 top-[40%] -translate-y-1/2 lg:-left-16 lg:top-[60%]`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next project"
          className={`${glassBtn} absolute right-3 top-[40%] -translate-y-1/2 lg:-right-16 lg:top-[60%]`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
