import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

/**
 * The wireframe file folder for "ABOUT ME".
 *
 * Layers, back to front:
 *   1. folder back (outlined body + tab)
 *   2. paper sheets, each with its own cream tab sticking out
 *   3. front flap (lip + slanted face) that says "Everything about me"
 *   4. the pulled-out paper (pop-up) with the chosen tab in pink
 *
 * Click a paper -> it springs out in front of the folder and shows `children`.
 * Click one of the paper edges peeking out on the sides to switch papers.
 *
 * SIZING: the folder is drawn on a 580 x 425 canvas ("design units").
 * One unit = folder width / 580, exposed as the CSS variable --u, so every
 * piece scales together. The parent sets the folder width with --fw
 * (see AboutSection.jsx).
 *
 * Props:
 *   tabs      -> the list from src/data/aboutTabs.js (up to 6 are drawn)
 *   activeId  -> id of the open paper, or null when the folder is closed
 *   onSelect  -> (id) => void   a paper was clicked
 *   onClose   -> () => void
 *   onStep    -> (+1 | -1) => void   previous / next paper
 *   children  -> the content shown on the open paper
 */

const W = 580;
const H = 425;
const PINK = '#C84B82';
const CREAM = '#E2DFD7';
const LINE = 'rgba(244, 241, 234, 0.88)';
const FILL = '#181818';

// "n design units" as a CSS length
const u = (n) => `calc(var(--u) * ${n})`;

/* ------------------------------ the sheets ------------------------------ */
const SHEET = { left: 25, width: 530, bottom: 300 };
const SHEET_TOPS = [151, 174, 197, 220, 243, 266]; // back -> front
const TAB_H = 29;

/*
 * TAB LAYOUT (no overlaps)
 *
 * Neighbouring sheets are only 23 units apart but a tab is 29 units tall,
 * so two tabs on NEIGHBOURING sheets must never share the same horizontal
 * space. The tabs therefore zig-zag: tabs on the front-most sheet, and on
 * every second sheet behind it, sit in the LEFT half of the folder
 * (x 43 - 285); the tabs in between sit in the RIGHT half (x 300 - 550).
 * Each side steps a little to the right as it goes back, like a staircase.
 *
 *   sheet slot (back -> front):   0     1     2     3     4     5
 *   tab number:                   06    05    04    03    02    01
 *   side:                         right left  right left  right left
 *
 * If you change a tab's width or left value, keep tabs on neighbouring
 * slots on opposite halves (or at least 8 units apart) so they never touch.
 */

// Tab number n (01, 02...) lives on this sheet slot
const TAB_SLOT = [5, 4, 3, 2, 1, 0];
const TAB_BOX = [
  { left: 43, width: 119 },  // 01  slot 5 (front)  left
  { left: 300, width: 145 }, // 02  slot 4          right
  { left: 100, width: 131 }, // 03  slot 3          left
  { left: 380, width: 112 }, // 04  slot 2          right
  { left: 160, width: 125 }, // 05  slot 1          left
  { left: 425, width: 125 }, // 06  slot 0 (back)   right
];

// The pulled-out paper
const PANEL = { left: 36, top: 89, width: 508, height: 294 };
const COMPACT_EXTRA = 330; // phones: the paper grows taller so text has room

function useCompact() {
  const query = '(max-width: 639px)';
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setCompact(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return compact;
}

/* A trapezoid tab with rounded top corners, drawn at its real size */
function TabShape({ width }) {
  const s = 12; // how far the sides slant outward
  const d =
    `M0 ${TAB_H} L${s} 7 Q${s + 2.5} 0 ${s + 10} 0 ` +
    `L${width - s - 10} 0 Q${width - s - 2.5} 0 ${width - s} 7 L${width} ${TAB_H} Z`;
  return (
    <svg
      viewBox={`0 0 ${width} ${TAB_H}`}
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} fill={CREAM} />
    </svg>
  );
}

const ctrlBtn =
  'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:border-[#C84B82] hover:text-[#C84B82] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B82]';

function Icon({ d }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export default function FolderDrawer({ tabs, activeId, onSelect, onClose, onStep, children }) {
  const compact = useCompact();
  const reduce = useReducedMotion();
  const paperRef = useRef(null);

  const list = tabs.slice(0, TAB_SLOT.length);
  const activeIndex = list.findIndex((t) => t.id === activeId);
  const active = activeIndex >= 0 ? list[activeIndex] : null;
  const open = active !== null;
  const extra = compact && open ? COMPACT_EXTRA : 0;

  // When a paper opens, move keyboard focus onto it (so the focus ring
  // doesn't stay stuck on the sheet that was clicked)
  useEffect(() => {
    if (open) paperRef.current?.focus({ preventScroll: true });
  }, [open]);

  // slot number -> { tab, box }
  const bySlot = {};
  list.forEach((tab, i) => {
    bySlot[TAB_SLOT[i]] = { tab, box: TAB_BOX[i] };
  });

  return (
    <div
      data-about-folder
      className="relative mx-auto"
      style={{
        '--u': 'calc(var(--fw) / 580)',
        width: 'var(--fw)',
        aspectRatio: `${W} / ${H}`,
        marginBottom: u(extra),
        transition: 'margin-bottom 0.45s ease',
        isolation: 'isolate',
      }}
    >
      {/* soft pink glow behind the whole folder */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: '4%',
          right: '4%',
          top: '8%',
          bottom: '2%',
          background: 'radial-gradient(ellipse at center, rgba(200, 75, 130, 0.24), transparent 70%)',
          filter: 'blur(38px)',
        }}
      />

      {/* 1. folder back */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
        style={{ zIndex: 1 }}
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M22 55 Q22 31 46 31 L218 31 C232 31 232 2 250 2 L338 2 C356 2 356 31 370 31 L534 31 Q558 31 558 55 L558 300 L22 300 Z"
          fill={FILL}
          stroke={LINE}
          strokeWidth="1.2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* 2. paper sheets (back -> front) */}
      {SHEET_TOPS.map((top, slot) => {
        const entry = bySlot[slot];
        const isActive = entry?.tab.id === activeId;
        const style = {
          left: u(SHEET.left),
          top: u(top),
          width: u(SHEET.width),
          height: u(SHEET.bottom - top),
          zIndex: 2 + slot,
          background: FILL,
          border: `1.2px solid ${isActive ? PINK : LINE}`,
          borderBottom: 'none',
          borderRadius: `${u(9)} ${u(9)} 0 0`,
          transition: 'border-color 0.25s',
        };

        // blank paper (no tab assigned)
        if (!entry) {
          return <div key={slot} aria-hidden="true" className="absolute" style={style} />;
        }

        const { tab, box } = entry;
        return (
          <motion.button
            key={slot}
            type="button"
            onClick={() => onSelect(tab.id)}
            aria-label={`${open ? 'Switch to' : 'Open'} ${tab.number} ${tab.label}`}
            aria-expanded={isActive}
            className="group absolute cursor-pointer p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C84B82]"
            style={style}
            whileHover={open ? undefined : { y: -9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            {/* the cream tab sticking out of the top of the paper */}
            <motion.span
              className="absolute block"
              style={{
                left: u(box.left - SHEET.left),
                top: u(-TAB_H),
                width: u(box.width),
                height: u(TAB_H),
              }}
              animate={{ opacity: open ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <TabShape width={box.width} />
              <span
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-display font-medium text-[#1c1c1c] transition-colors group-hover:text-[#C84B82] group-focus-visible:text-[#C84B82]"
                style={{ fontSize: `max(9px, ${u(11.5)})` }}
              >
                {tab.number} {tab.label}
              </span>
            </motion.span>
          </motion.button>
        );
      })}

      {/* 3. front flap */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        style={{ zIndex: 20 }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="about-flap-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1d1d1d" />
            <stop offset="1" stopColor="#141414" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="290"
          width="578"
          height="14"
          fill={FILL}
          stroke={LINE}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M1 304 L579 304 L553 423 L27 423 Z"
          fill="url(#about-flap-fill)"
          stroke={LINE}
          strokeWidth="1.2"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <motion.p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 m-0 text-center font-display font-medium"
        style={{ top: u(354), zIndex: 21, color: PINK, fontSize: `max(11px, ${u(17)})` }}
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      >
        Everything <em className="italic">about me</em>
      </motion.p>

      {/* 4. the pulled-out paper */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="paper"
            ref={paperRef}
            tabIndex={-1}
            role="dialog"
            aria-label={`${active.number} ${active.label}`}
            className="absolute outline-none"
            style={{
              left: u(PANEL.left),
              top: u(PANEL.top),
              width: u(PANEL.width),
              height: u(PANEL.height + extra),
              zIndex: 40,
              transformOrigin: '50% 100%',
            }}
            initial={reduce ? false : { opacity: 0, y: 70, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 230, damping: 26 }}
          >
            {/* paper surface */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background: FILL,
                border: `1.2px solid ${LINE}`,
                borderRadius: u(10),
                boxShadow: '0 18px 50px rgba(0, 0, 0, 0.55)',
              }}
            />

            {/* the chosen tab, in pink */}
            <div
              className="pointer-events-none absolute"
              style={{
                left: u(38),
                top: `calc(var(--u) * -${TAB_H} + 1.5px)`,
                width: u(TAB_BOX[activeIndex].width),
                height: u(TAB_H),
              }}
            >
              <TabShape width={TAB_BOX[activeIndex].width} />
              <span
                className="absolute inset-0 flex items-center justify-center whitespace-nowrap font-display font-medium"
                style={{ color: PINK, fontSize: `max(9px, ${u(11.5)})` }}
              >
                {active.number} {active.label}
              </span>
            </div>

            {/* previous / next / close, on the tab row */}
            <div
              className="absolute right-0 flex items-center gap-2"
              style={{ bottom: '100%', marginBottom: 'max(4px, calc(var(--u) * 7))' }}
            >
              <button type="button" className={ctrlBtn} onClick={() => onStep(-1)} aria-label="Previous paper">
                <Icon d="M15 5l-7 7 7 7" />
              </button>
              <button type="button" className={ctrlBtn} onClick={() => onStep(1)} aria-label="Next paper">
                <Icon d="M9 5l7 7-7 7" />
              </button>
              <button type="button" className={ctrlBtn} onClick={onClose} aria-label="Close">
                <Icon d="M6 6l12 12M18 6L6 18" />
              </button>
            </div>

            {/* scrollable content (re-mounted per paper so scroll resets) */}
            <div
              key={active.id}
              className="@container absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-color:#C84B82_transparent] [scrollbar-width:thin]"
              style={{ borderRadius: u(10) }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
