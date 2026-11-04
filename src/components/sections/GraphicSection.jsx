import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { graphicProjects } from '../../data/graphicProjects';
import GraphicModal from '../ui/GraphicModal';

/* ------------------------------ settings ------------------------------ */
const TARGET_STEP = 20;          // degrees between neighbouring cards (approx.)
const START_INDEX = 3;           // which project starts in the center
const OPEN_AFTER_ROTATE = true;  // clicking a side card: rotate to center, THEN pop it open
const OPEN_DELAY_MS = 550;       // wait for the rotation to land before the pop-up
const BOTTOM_ROOM = 50;          // empty space (px) kept under the lowest card's corner + shadow
const MOBILE_BREAKPOINT = 640;   // below this width the phone layout is used
const PINK = '#C84B82';
const CREAM = '#E2DFD7';
const EASE = [0.22, 1, 0.36, 1];
/* --------------------------------------------------------------------- */

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
// wrap any angle into -180..180
const norm = (deg) => ((((deg + 180) % 360) + 360) % 360) - 180;

/*
 * Entrance: every card starts stacked on top of the center card (rotated back
 * to angle 0, turned away and faded), then is dealt out into its place in the
 * fan. The center card lands first, the outer cards follow.
 */
const dealVariants = {
  stacked: ({ a0 }) => ({ rotate: -a0, rotateY: 70, y: -40, scale: 0.88, opacity: 0 }),
  dealt: ({ delay }) => ({
    rotate: 0,
    rotateY: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      opacity: { duration: 0.3, delay },
      default: { type: 'spring', stiffness: 80, damping: 15, mass: 0.9, delay },
    },
  }),
};

function useViewport() {
  const read = () => ({
    w: typeof window === 'undefined' ? 1440 : window.innerWidth,
    h: typeof window === 'undefined' ? 900 : window.innerHeight,
  });
  const [size, setSize] = useState(read);
  useEffect(() => {
    const onResize = () => setSize(read());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
}

export default function GraphicSection() {
  const projects = graphicProjects;
  const N = projects.length;
  const { w: vw, h: vh } = useViewport();
  const isMobile = vw < MOBILE_BREAKPOINT;

  /*
   * The fan is a wheel. Cards sit on a full 360° ring (repeated if you have
   * only a few projects) and the whole ring rotates around a pivot far below
   * the screen - so only the top of the ring shows, like a hand of cards.
   * `rot` is the wheel's rotation and never wraps, so it always takes the
   * shortest way round.
   */
  const reps = Math.max(1, Math.round(360 / (TARGET_STEP * N)));
  const M = N * reps;           // total slots on the ring
  const step = 360 / M;         // degrees between slots
  const visibleSteps = isMobile ? 2 : 3;

  const [rot, setRot] = useState(() => -Math.min(START_INDEX, N - 1) * step);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  // entrance: play once when the section scrolls into view
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  // the wheel angle the section starts at (only the first value is kept)
  const startRot = useRef(-Math.min(START_INDEX, N - 1) * step).current;

  const activeSlot = (((Math.round(-rot / step)) % M) + M) % M;
  const activeProject = projects[activeSlot % N];

  const handleSelect = (slot) => {
    clearTimeout(timer.current);
    const a = norm(slot * step + rot); // how far this card is from center
    if (Math.abs(a) < step / 2) {
      setOpen(true);                    // already centered -> open it
      return;
    }
    setRot(rot - a);                    // spin so this card lands in the center
    if (OPEN_AFTER_ROTATE) {
      timer.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    }
  };

  // dir = +1 -> bring the next card (on the right) to the center, -1 -> previous
  const shift = (dir) => setRot((r) => r - dir * step);

  /* ------------------------------ geometry ------------------------------ */
  /*
   * Desktop: unchanged - a tall section (at least the window height) with the
   * heading at the top and the fan in the lower half.
   * Phone: the heading is wider, the cards are bigger relative to the screen,
   * and the section is only as tall as the heading + fan needs, so there is no
   * big empty gap above the cards.
   */
  const sectionH = isMobile ? 0 : Math.max(vh, 720);
  const headingW = isMobile ? vw * 0.8 : Math.min(vw * 0.5, 860);
  const headingH = headingW * (392 / 1000);           // the heading svg viewBox is 1000 x 392
  const gapTop = clamp(vw * 0.07, 56, 140);           // breathing room between UI/UX and this section
  const cardW = isMobile ? clamp(vw * 0.42, 160, 240) : clamp(vw * 0.2, 150, 340);
  const cardH = cardW * 1.12;
  const R = isMobile ? clamp(vw * 0.62, 240, 400) : clamp(vw * 0.36, 260, 720); // wheel radius
  const centerTop = isMobile ? headingH + 48 : sectionH * 0.42; // top edge of the center card
  const pivotY = centerTop + cardH / 2 + R;           // wheel pivot (below the screen)

  // How far down do the outermost visible cards reach? Work out the lowest corner
  // of a card sitting at the edge of the fan, so the section is tall enough to
  // show it in full instead of slicing it off with a straight line.
  const edgeAngle = ((visibleSteps + 0.4) * step * Math.PI) / 180;
  let lowestCorner = -Infinity;
  for (const x of [-cardW / 2, cardW / 2]) {
    for (const y of [-R - cardH / 2, -R + cardH / 2]) {
      lowestCorner = Math.max(lowestCorner, x * Math.sin(edgeAngle) + y * Math.cos(edgeAngle));
    }
  }
  const fullH = Math.max(sectionH, pivotY + lowestCorner + BOTTOM_ROOM);

  return (
    <section
      ref={sectionRef}
      id="graphic-design"
      className="relative w-full select-none overflow-hidden"
      style={{ height: fullH, marginTop: gapTop }}
    >
      {/* ---------------------------- Heading ---------------------------- */}
      {/*
        Syne ExtraBold, drawn as SVG text so each word is stretched to EXACTLY
        the same width (textLength): GRAPHIC is pulled tall, DESIGN is pressed
        flat, like your mockup. Solid colors - no texture.
        To resize the whole heading, change headingW in the geometry block above.
        Centering is done with `left` + Framer's `x: '-50%'` so it doesn't
        fight the entrance animation.
      */}
      <motion.div
        className="pointer-events-none absolute top-0"
        style={{ left: '50%', x: '-50%', width: headingW }}
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <h2 aria-label="Graphic Design" className="m-0">
          <svg
            viewBox="0 0 1000 392"
            className="block w-full"
            style={{ overflow: 'visible' }}
            aria-hidden="true"
            focusable="false"
          >
            <g fontFamily="Syne, system-ui, sans-serif" fontWeight="800">
              <text
                transform="translate(0 318) scale(1 3.1)"
                fontSize="156"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fill={CREAM}
              >
                GRAPHIC
              </text>
              <text
                transform="translate(0 385) scale(1 0.42)"
                fontSize="182"
                textLength="1000"
                lengthAdjust="spacingAndGlyphs"
                fill={PINK}
              >
                DESIGN
              </text>
            </g>
          </svg>
        </h2>
      </motion.div>

      {/* ------------------------- Fanned carousel ------------------------- */}
      <motion.div
        className="absolute"
        style={{ left: '50%', top: pivotY, width: 0, height: 0 }}
        initial={false}
        animate={{ rotate: rot }}
        transition={{ type: 'spring', stiffness: 70, damping: 16, mass: 0.9 }}
      >
        {Array.from({ length: M }, (_, slot) => {
          const p = projects[slot % N];
          const a = norm(slot * step + rot);          // where the card will end up
          const dist = Math.abs(a) / step;            // 0 = center, 1 = neighbour...
          const visible = dist <= visibleSteps + 0.4;

          // entrance: where this card sits at the start, so the deal fans out from the center
          const a0 = norm(slot * step + startRot);
          const dist0 = Math.min(Math.abs(a0) / step, 4);

          return (
            <div
              key={slot}
              className="absolute"
              style={{
                left: -cardW / 2,
                top: -R - cardH / 2,
                width: cardW,
                height: cardH,
                transform: `rotate(${slot * step}deg)`,
                transformOrigin: `${cardW / 2}px ${R + cardH / 2}px`,
                zIndex: 100 - Math.round(dist * 10),
                pointerEvents: visible ? 'auto' : 'none',
              }}
            >
              {/* deal layer: stacked on the center card -> fanned into place */}
              <motion.div
                className="h-full w-full"
                style={{
                  transformOrigin: `${cardW / 2}px ${R + cardH / 2}px`,
                  transformPerspective: 900,
                }}
                variants={dealVariants}
                custom={{ a0, delay: 0.2 + dist0 * 0.09 }}
                initial="stacked"
                animate={inView ? 'dealt' : 'stacked'}
              >
                <motion.button
                  type="button"
                  onClick={() => handleSelect(slot)}
                  aria-label={dist < 0.5 ? `Open ${p.title}` : `Show ${p.title}`}
                  tabIndex={visible ? 0 : -1}
                  className="block h-full w-full cursor-pointer overflow-hidden rounded-[1.6rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C84B82]"
                  style={{ boxShadow: '0 18px 40px rgba(0, 0, 0, 0.55)' }}
                  animate={{ opacity: visible ? 1 : 0 }}
                  whileHover={visible ? { y: -14 } : undefined}
                  transition={{
                    opacity: { duration: 0.3 },
                    default: { type: 'spring', stiffness: 300, damping: 22 },
                  }}
                >
                  {p.src ? (
                    <img
                      src={p.src}
                      alt={p.title}
                      draggable={false}
                      decoding="async"
                      className="pointer-events-none h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-full w-full items-end p-5 text-left"
                      style={{ background: `linear-gradient(145deg, ${p.accent}, #121212)` }}
                    >
                      <span className="font-syne text-xl font-extrabold uppercase leading-none tracking-wide text-[#E2DFD7]">
                        {p.title}
                      </span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* ------------------------------ Pop-up ------------------------------ */}
      <AnimatePresence>
        {open && (
          <GraphicModal
            key="graphic-modal"
            project={activeProject}
            onClose={() => setOpen(false)}
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
