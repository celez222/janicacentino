import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
 * STACKED PROJECTS (a project with a `gallery`, e.g. Dragon Brew):
 *   - the pop-up opens on the first design, with a pink tooltip hotspot
 *     ("Click to see 2 more designs") and a pulsing pink outline on it
 *   - clicking the design (or pressing Enter on it) reveals the others as
 *     small selection-frame thumbnails under the card; pick one to view it
 *   Props for this: gallery, galleryIndex, revealed, onReveal, onSelectDesign.
 *
 * TOSS THEM: on wide screens the three detail boxes (info, tool logo, year)
 * can be grabbed and thrown. They keep gliding in the direction of the throw,
 * slow down and stop, and bounce softly off the edges of the screen. The one
 * you touched last stays on top. They snap back to their place when the
 * pop-up is closed or you move to another project.
 * HOW PEOPLE KNOW: each box has a small grip tab on its top edge (it turns
 * pink on hover), the cursor is a grab hand, and the first time the pop-up
 * opens in a visit the three boxes give one little wiggle, one after the
 * other (not for people who prefer reduced motion). Tune the glide in
 * `dragProps` (power = how far a throw travels, timeConstant = how long it
 * floats before stopping).
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

const PINK = '#C84B82';

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

/* ----------------------- "you can drag me" cues ----------------------- */

// Small handle that straddles the top edge of a box (like a drag handle in a
// design tool). The box it sits on needs the `group` class so it can react to hover.
function GripTab() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-10 flex h-3.5 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-[#1b1b1b]/85 text-white/80 transition-colors duration-200 group-hover:border-[#C84B82] group-hover:bg-[#C84B82] group-hover:text-white"
    >
      <svg width="12" height="6" viewBox="0 0 16 8" fill="currentColor">
        <circle cx="3" cy="2" r="1.2" />
        <circle cx="8" cy="2" r="1.2" />
        <circle cx="13" cy="2" r="1.2" />
        <circle cx="3" cy="6" r="1.2" />
        <circle cx="8" cy="6" r="1.2" />
        <circle cx="13" cy="6" r="1.2" />
      </svg>
    </span>
  );
}

// One-time wiggle. Separate translate/rotate properties preserve Framer's drag movement.
const NUDGE_CSS = `
@keyframes box-nudge {
  0%, 100% { translate: 0 0; rotate: 0deg; }
  25% { translate: 3px -2px; rotate: 0.8deg; }
  50% { translate: -2px 1px; rotate: -0.6deg; }
  75% { translate: 1px -1px; rotate: 0.3deg; }
}`;
const NUDGE_DELAY = {
  info: 1,
  tools: 1.6,
  year: 2.2,
};
// the wiggle plays on the first pop-up of the visit only
let nudgePlayed = false;

/* ------------------------- selection-style frame ------------------------- */
// Thin white outline with a small white square on each of the 4 corners,
// like an element that's selected in Canva / Figma.
const HANDLES = [
  '-left-[4.5px] -top-[4.5px]',
  '-right-[4.5px] -top-[4.5px]',
  '-bottom-[4.5px] -left-[4.5px]',
  '-bottom-[4.5px] -right-[4.5px]',
];

function SelectionFrame({ children, className = '', style, delay = 0.25, grip = false, ...rest }) {
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
      {...rest}
    >
      {children}
      {HANDLES.map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`pointer-events-none absolute h-2 w-2 bg-[#f4f4f4] ${pos}`}
        />
      ))}
      {grip && <GripTab />}
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

/* ------------------- stacked project: hint + thumbnails ------------------- */

// The tooltip glyph: a callout box with a line of text, a stem and a dot
function TooltipIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="11" rx="2.5" />
      <path d="M8.5 8.5h7" />
      <path d="M12 14v3" />
      <circle cx="12" cy="20.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

/*
 * A tooltip pinned onto the design, like a hotspot in a design tool:
 * pink callout -> little tail -> pulsing dot. Sits low on the image so it
 * stays clear of the logo area at the top. It bobs gently (not for people
 * who prefer reduced motion) and ignores the mouse, so a click goes
 * straight to the design underneath.
 */
function DesignHint({ extra, reduceMotion }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 z-10 flex -translate-x-1/2 flex-col items-center"
      style={{ bottom: '8%' }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 font-syne text-[13px] font-bold text-white"
          style={{
            background: PINK,
            border: '1.5px solid rgba(255,255,255,0.9)',
            boxShadow: '0 10px 28px rgba(0,0,0,0.5)',
          }}
        >
          <TooltipIcon />
          Click to see {extra} more design{extra > 1 ? 's' : ''}
        </div>
        {/* tail */}
        <span
          aria-hidden="true"
          className="-mt-[7px] block h-3 w-3 rotate-45"
          style={{
            background: PINK,
            borderRight: '1.5px solid rgba(255,255,255,0.9)',
            borderBottom: '1.5px solid rgba(255,255,255,0.9)',
          }}
        />
      </motion.div>

      {/* hotspot dot */}
      <span className="relative mt-1 flex h-4 w-4 items-center justify-center" aria-hidden="true">
        <span
          className="absolute inline-flex h-full w-full rounded-full opacity-80 motion-safe:animate-ping"
          style={{ background: PINK }}
        />
        <span
          className="relative block h-3.5 w-3.5 rounded-full bg-white"
          style={{ border: `3px solid ${PINK}`, boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}
        />
      </span>
    </div>
  );
}

// The other designs pop out from the first one, each in a selection frame
function DesignStrip({ items, index, onSelect, className = '' }) {
  return (
    <div role="tablist" aria-label="Designs in this project" className={`flex justify-center gap-4 ${className}`}>
      {items.map((item, i) => {
        const active = i === index;
        return (
          <motion.button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={item.label}
            onClick={() => onSelect(i)}
            className="flex cursor-pointer flex-col items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C84B82]"
            initial={i === 0 ? false : { opacity: 0, scale: 0.4, x: -90 * i }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20, delay: i === 0 ? 0 : 0.05 + i * 0.1 }}
          >
            <SelectionFrame
              className="p-1"
              delay={0}
              style={{ borderColor: active ? PINK : undefined, borderWidth: active ? 2 : undefined }}
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt=""
                  draggable={false}
                  className="pointer-events-none block h-[60px] w-[44px] object-cover object-top"
                  style={{ opacity: active ? 1 : 0.7 }}
                />
              ) : (
                <span className="block h-[60px] w-[44px] bg-white/10" />
              )}
            </SelectionFrame>
            <span
              className="font-syne text-[11px] font-semibold tracking-wide"
              style={{ color: active ? '#fff' : 'rgba(255,255,255,0.7)' }}
            >
              {item.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

/* -------------------------------- modal -------------------------------- */
export default function GraphicModal({
  project,
  onClose,
  onPrev,
  onNext,
  gallery = null,
  galleryIndex = 0,
  revealed = false,
  onReveal,
  onSelectDesign,
}) {
  const reduceMotion = useReducedMotion();

  // Wiggle only the first project shown during this visit.
  const [nudgeState, setNudgeState] = useState(() => ({
    projectId: project.id,
    shouldPlay: !nudgePlayed,
  }));
  if (nudgeState.projectId !== project.id) {
    setNudgeState({ projectId: project.id, shouldPlay: false });
  }
  useEffect(() => {
    if (nudgeState.shouldPlay) nudgePlayed = true;
  }, [nudgeState.shouldPlay]);
  const nudgeStyle = (key) =>
    reduceMotion === false && nudgeState.shouldPlay && project.id === nudgeState.projectId
      ? { animation: `box-nudge 0.45s ease-in-out ${NUDGE_DELAY[key]}s 1` }
      : undefined;

  // ---- toss-able detail boxes ----
  const constraintsRef = useRef(null); // the full-screen dialog: boxes can't leave the screen
  const dragging = useRef(false);      // true while a box is being dragged
  const [front, setFront] = useState(null); // the box touched last sits on top

  const z = (key) => (front === key ? 30 : undefined);
  const dragProps = (key) => ({
    drag: true,
    dragConstraints: constraintsRef,
    dragElastic: 0.15,
    dragMomentum: true,
    // power: how far a throw carries. timeConstant (ms): how long it floats before it stops.
    dragTransition: { power: 0.75, timeConstant: 450, bounceStiffness: 220, bounceDamping: 24 },
    whileDrag: { scale: 1.04 },
    onDragStart: () => {
      dragging.current = true;
      setFront(key);
    },
    onDragEnd: () => {
      // the click that follows letting go must not count as a backdrop click
      setTimeout(() => {
        dragging.current = false;
      }, 120);
    },
  });

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

  // stacked project: the image comes from the chosen design in the gallery
  const src = gallery
    ? gallery[galleryIndex]?.src ?? project.full ?? project.src
    : project.full ?? project.src;
  const tools = project.tools ?? [];

  const extra = gallery ? gallery.length - 1 : 0;
  const clickable = !!gallery && !revealed; // first design showing, the others still hidden
  const showStrip = !!gallery && revealed;

  return (
    <motion.div
      ref={constraintsRef}
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
      onClick={() => {
        if (!dragging.current) onClose();
      }}
    >
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 backdrop-blur-[3px]" />
      <style>{NUDGE_CSS}</style>

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
            key={`${project.id}-${galleryIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`relative overflow-hidden rounded-[2rem] shadow-[0_30px_80px_rgba(0,0,0,0.6)] ${
              clickable ? 'cursor-pointer' : ''
            }`}
            {...(clickable
              ? {
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': `Show ${extra} more designs`,
                  onClick: onReveal,
                  onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onReveal?.();
                    }
                  },
                }
              : {})}
          >
            {src ? (
              <img
                src={src}
                alt={gallery ? `${project.title} - ${gallery[galleryIndex]?.label}` : project.title}
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

            {/* stacked project, others still hidden: pulsing outline + tooltip hotspot */}
            {clickable && (
              <>
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[2rem] border-[3px]"
                  style={{ borderColor: PINK }}
                  animate={reduceMotion ? { opacity: 0.9 } : { opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <DesignHint extra={extra} reduceMotion={reduceMotion} />
              </>
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
            className="group pointer-events-auto absolute top-[8%] w-[180px] cursor-grab p-4 text-white active:cursor-grabbing"
            style={{ ...glassPanel, left: -145, zIndex: z('info'), ...nudgeStyle('info') }}
            grip
            {...dragProps('info')}
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
              className="group pointer-events-auto absolute top-[6%] flex cursor-grab flex-col items-center gap-2 active:cursor-grabbing"
              style={{ right: -118, zIndex: z('tools'), ...nudgeStyle('tools') }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              {...dragProps('tools')}
            >
              <GripTab />
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
              className="group pointer-events-auto absolute bottom-[14%] cursor-grab px-4 py-2 text-white active:cursor-grabbing"
              style={{ ...glassPanel, right: -95, minWidth: 113, zIndex: z('year'), ...nudgeStyle('year') }}
              grip
              {...dragProps('year')}
            >
              <p className="font-syne text-[11px] font-medium tracking-wide text-white/75">Year</p>
              <p className="font-syne font-bold text-lg leading-none tracking-wide">{project.year}</p>
            </SelectionFrame>
          )}
        </div>

        {/* Stacked project, wide screens: the other designs appear under the card.
            Absolutely placed so the boxes around the card don't shift. */}
        {showStrip && (
          <div className="pointer-events-auto absolute left-0 right-0 top-full mt-5 hidden xl:block">
            <DesignStrip items={gallery} index={galleryIndex} onSelect={onSelectDesign} />
          </div>
        )}

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

        {/* Stacked project, smaller screens: the other designs appear under the info bar */}
        {showStrip && (
          <DesignStrip items={gallery} index={galleryIndex} onSelect={onSelectDesign} className="mt-5 xl:hidden" />
        )}

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className={`${glassBtn} absolute right-3 top-3 z-40`}
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
          className={`${glassBtn} absolute left-3 top-[40%] z-40 -translate-y-1/2 lg:-left-16 lg:top-[60%]`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNext}
          aria-label="Next project"
          className={`${glassBtn} absolute right-3 top-[40%] z-40 -translate-y-1/2 lg:-right-16 lg:top-[60%]`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}
