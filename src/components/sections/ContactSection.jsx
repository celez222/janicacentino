import { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import instagramImg from '../../assets/icons/instagram.webp';
import phoneImg from '../../assets/icons/phone.webp';
import mailImg from '../../assets/icons/mail.webp';

/**
 * "CONNECT WITH ME" - a 3D cube that spins up / down to show each way to
 * reach you. Click Instagram / Contact / Email on the right and the cube
 * rotates to that face (it spins upward when you go down the list, and
 * downward when you go back up).
 *
 * EDIT YOUR DETAILS HERE. The ORDER below is the order of the list on the
 * right AND of the cube's faces.
 *   label -> word in the list on the right
 *   text  -> what is shown under the cube
 *   href  -> where clicking that text goes (instagram link / tel: / mailto:)
 *   image -> the face of the cube (files live in src/assets/icons/)
 */
const contacts = [
  {
    id: 'instagram',
    label: 'Instagram',
    text: '@celez.u_u',
    href: 'https://www.instagram.com/celez.u_u',
    image: instagramImg,
    alt: 'Chrome Instagram icon',
  },
  {
    id: 'contact',
    label: 'Contact',
    text: '+63 953 3451 052',
    href: 'tel:+639533451052',
    image: phoneImg,
    alt: 'Chrome phone icon',
  },
  {
    id: 'email',
    label: 'Email',
    text: 'centinojanica.10@gmail.com',
    href: 'mailto:centinojanica.10@gmail.com',
    image: mailImg,
    alt: 'Chrome mail icon',
  },
];

// A cube has 4 side faces. The 4th one is a plain black face that only
// shows for a moment if the spin overshoots.
const FACES = [...contacts, null];

const PINK = '#C84B82';
const CREAM = '#F4F1EA';

/* ------------------------------ cube face ------------------------------ */
// Faces are stacked around the horizontal axis: face k sits k quarter-turns
// "below" the front, so spinning the cube up brings the next face in from below.
function Face({ k, item, rot }) {
  // darker the further a face is turned away from us
  const shade = useTransform(rot, (v) => {
    const diff = Math.abs((((v - k * 90) % 360) + 540) % 360 - 180);
    return Math.min(0.85, (diff / 90) * 0.8);
  });

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-black"
      style={{
        transform: `rotateX(${-k * 90}deg) translateZ(calc(var(--cube) / 2))`,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
      }}
    >
      {item && (
        <img
          src={item.image}
          alt={item.alt}
          draggable={false}
          decoding="async"
          className="pointer-events-none h-full w-full object-cover"
        />
      )}
      <motion.div aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: shade }} />
    </div>
  );
}

function Cube({ index }) {
  const reduce = useReducedMotion();
  const rot = useMotionValue(0);

  useEffect(() => {
    const controls = animate(
      rot,
      index * 90,
      reduce ? { duration: 0 } : { type: 'spring', stiffness: 85, damping: 17, mass: 1 }
    );
    return () => controls.stop();
  }, [index, reduce, rot]);

  return (
    <div
      aria-hidden="true"
      style={{
        width: 'var(--cube)',
        height: 'var(--cube)',
        perspective: 'calc(var(--cube) * 3.4)',
      }}
    >
      {/* push the cube back by half its size so the front face sits at its true size */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(calc(var(--cube) / -2))',
        }}
      >
        <motion.div
          style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', rotateX: rot }}
        >
          {FACES.map((item, k) => (
            <Face key={item ? item.id : 'back'} k={k} item={item} rot={rot} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* -------------------------------- section -------------------------------- */

const captionVariants = {
  enter: (dir) => ({ opacity: 0, y: dir * 20 }),
  center: { opacity: 1, y: 0 },
  exit: (dir) => ({ opacity: 0, y: dir * -20 }),
};

export default function ContactSection() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1); // 1 = moving down the list, -1 = up
  const active = contacts[index];

  const select = (next) => {
    if (next === index) return;
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen w-full flex-col items-center"
      style={{
        '--cube': 'clamp(220px, 25vw, 520px)',
        paddingTop: 'clamp(72px, 11.6vh, 150px)',
        paddingBottom: '9rem', // room for the floating dock
      }}
    >
      {/* ---------------------------- Heading ---------------------------- */}
      {/* CONNECT is pulled wide and short, WITH ME sits under it - both drawn as SVG
          text so they always keep these exact proportions. */}
      <h2 aria-label="Connect with me" className="m-0 select-none" style={{ width: 'clamp(240px, 28vw, 540px)' }}>
        <svg viewBox="0 0 1000 238" className="block w-full" aria-hidden="true" focusable="false">
          <text
            transform="translate(0 118) scale(1 1.6)"
            fontFamily="Syne, system-ui, sans-serif"
            fontWeight="800"
            fontSize="113.6"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill={PINK}
          >
            CONNECT
          </text>
          <text
            x="272.7"
            y="238"
            fontFamily="'Perpetua Titling MT Std Light', 'Times New Roman', serif"
            fontWeight="300"
            fontSize="104.7"
            textLength="458.7"
            lengthAdjust="spacingAndGlyphs"
            fill={CREAM}
          >
            WITH ME
          </text>
        </svg>
      </h2>

      {/* ------------------------ Cube + options ------------------------ */}
      <div
        className="relative flex w-full flex-col items-center"
        style={{ marginTop: 'clamp(40px, 8vh, 96px)' }}
      >
        <Cube index={index} />

        {/* what the cube is showing */}
        <div
          className="mt-[clamp(28px,5vw,60px)] flex items-center justify-center"
          style={{ minHeight: '2.6em', fontSize: 'clamp(1.05rem, 1.7vw, 1.95rem)' }}
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.a
              key={active.id}
              href={active.href}
              target={active.href.startsWith('http') ? '_blank' : undefined}
              rel={active.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              custom={dir}
              variants={captionVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="font-display font-normal text-[#F4F1EA] no-underline transition-colors hover:text-[#C84B82] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C84B82]"
            >
              {active.text}
            </motion.a>
          </AnimatePresence>
        </div>

        {/* the list on the right (under the caption on phones) */}
        <nav
          aria-label="Contact options"
          className="mt-8 md:absolute md:right-[3.5vw] md:top-[calc(var(--cube)/2)] md:mt-0 md:-translate-y-1/2"
        >
          <ul className="m-0 flex list-none gap-6 p-0 md:flex-col md:items-end md:gap-[clamp(10px,1.5vw,26px)]">
            {contacts.map((c, i) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={i === index}
                  className={`cursor-pointer font-display font-bold leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C84B82] ${
                    i === index ? 'text-white' : 'text-white/40 hover:text-white/75'
                  }`}
                  style={{ fontSize: 'clamp(1.1rem, 2vw, 2.1rem)' }}
                >
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p
        className="absolute bottom-4 left-5 m-0 font-display font-normal text-white/90"
        style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1.3rem)' }}
      >
        Created by: Janica
      </p>
    </section>
  );
}
