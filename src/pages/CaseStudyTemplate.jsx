import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { caseStudies, CASE_STUDY_ORDER } from '../data/caseStudiesData';

/**
 * One page for every case study.  Route:  /work/:slug
 * Put this file in:  src/pages/CaseStudyTemplate.jsx
 * Content lives in:  src/data/caseStudiesData.js
 *
 * Styled to match the portfolio: near-black grid background, Syne headings
 * (font-display), Perpetua Titling labels (font-serif-thin), cream #E2DFD7
 * text and pink #C84B82 accents, square outlined image panels like the
 * UI/UX collage, and the same "View Project" style pill buttons.
 *
 * DEMO VIDEOS: while you run `npm run dev`, a demo that is missing (or can't be
 * played) shows a dashed pink note saying what's wrong. Visitors never see it.
 */

const PINK = '#C84B82';
const CREAM = '#E2DFD7';
const EASE = [0.22, 1, 0.36, 1];

/* ------------------------------ small helpers ------------------------------ */

function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const bodyCls = 'font-syne text-[14px] leading-[1.75] text-[#E2DFD7]/80 md:text-[15px]';

// pill outlined in pink, same look as the "View Project" button
const pillStyle = {
  border: '1px solid rgba(200, 75, 130, 0.5)',
  background:
    'linear-gradient(90deg, rgba(200,75,130,0.30) 0%, rgba(200,75,130,0.05) 45%, rgba(0,0,0,0) 100%)',
  boxShadow: 'inset 8px 0 14px -10px rgba(200, 75, 130, 0.6)',
};

function Paragraph({ p }) {
  if (typeof p === 'string') return <p className={`m-0 mb-4 ${bodyCls}`}>{p}</p>;
  return (
    <p className={`m-0 mb-4 ${bodyCls}`}>
      <strong className="font-semibold text-[#E2DFD7]">{p.lead}</strong> {p.text}
    </p>
  );
}

function Bullets({ items, acts = false }) {
  return (
    <ul className="m-0 mt-3 list-none space-y-3 p-0">
      {items.map((b) => (
        <li key={b.lead} className={`relative pl-5 ${bodyCls}`}>
          <span
            aria-hidden="true"
            className="absolute left-0 top-[0.8em] h-1.5 w-1.5 rounded-full"
            style={{ background: PINK }}
          />
          <strong className={`font-semibold text-[#E2DFD7] ${acts ? 'block' : ''}`}>{b.lead}</strong>
          {acts ? '' : ' '}
          {b.text}
        </li>
      ))}
    </ul>
  );
}

function Swatches({ title, colors }) {
  return (
    <div className="mt-6 inline-block border border-white/30 bg-white px-5 py-4">
      <span className="mb-3 block text-center font-display text-sm font-extrabold uppercase tracking-wider text-black">
        {title}
      </span>
      <div className="flex">
        {colors.map((c) => (
          <div key={c} className="h-10 w-10 border border-black" style={{ backgroundColor: c }} />
        ))}
      </div>
    </div>
  );
}

function Img({ item, className = '' }) {
  if (!item?.src) return null;
  return (
    <img
      src={item.src}
      alt={item.alt}
      draggable={false}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-full ${item.plain ? '' : 'border border-white/30'} ${className}`}
      style={item.maxW ? { maxWidth: item.maxW } : undefined}
    />
  );
}

/* ------------------------------ text blocks ------------------------------ */

function TextBlock({ b }) {
  return (
    <div>
      {b.title && (
        <h2
          className={`m-0 mb-4 font-display font-extrabold uppercase leading-[1.05] tracking-wide ${
            b.big ? 'text-3xl md:text-5xl' : 'text-2xl md:text-3xl'
          }`}
          style={{ color: b.big ? PINK : CREAM }}
        >
          {b.title}
        </h2>
      )}
      {b.paragraphs?.map((p, i) => (
        <Paragraph key={i} p={p} />
      ))}
      {b.bullets && <Bullets items={b.bullets} acts={b.bulletStyle === 'acts'} />}
      {b.subsections?.map((s) => (
        <div key={s.title} className="mt-8 first:mt-0">
          <h3 className="m-0 mb-3 font-serif-thin text-lg uppercase tracking-wider text-[#F1EFEA] md:text-2xl">
            {s.title}
          </h3>
          {s.paragraphs.map((p, i) => (
            <Paragraph key={i} p={p} />
          ))}
        </div>
      ))}
      {b.swatches && <Swatches {...b.swatches} />}
      {b.images && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {b.images.map((im) => (
            <Img key={im.alt} item={im} />
          ))}
        </div>
      )}
    </div>
  );
}

function Media({ media }) {
  const items = media.items.filter((m) => m.src);
  if (!items.length) return null;
  if (media.layout === 'trio') {
    return (
      <div className="grid grid-cols-3 items-start gap-3">
        {items.map((m) => (
          <Img key={m.alt} item={m} />
        ))}
      </div>
    );
  }
  if (media.layout === 'pair') {
    return (
      <div className="grid grid-cols-2 items-start gap-4">
        {items.map((m) => (
          <Img key={m.alt} item={m} />
        ))}
      </div>
    );
  }
  if (media.layout === 'stack') {
    return (
      <div className="flex flex-col justify-center gap-5">
        {items.map((m) => (
          <Img key={m.alt} item={m} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <Img item={items[0]} />
    </div>
  );
}

function SplitSection({ s }) {
  const w = s.mediaWidth ?? 400;
  const left = s.mediaSide === 'left';
  // no images added yet -> just show the text across the full width
  if (!s.media.items.some((m) => m.src)) {
    return (
      <div className="flex flex-col gap-9">
        {s.blocks.map((b, i) => (
          <TextBlock key={i} b={b} />
        ))}
      </div>
    );
  }
  return (
    <div
      className="grid items-center gap-8 lg:gap-[50px] lg:[grid-template-columns:var(--cols)]"
      style={{ '--cols': left ? `${w}px 1fr` : `1fr ${w}px` }}
    >
      <div className={`flex flex-col gap-9 ${left ? 'lg:order-2' : 'lg:order-1'}`}>
        {s.blocks.map((b, i) => (
          <TextBlock key={i} b={b} />
        ))}
      </div>
      <div className={`order-first mx-auto w-full max-w-[500px] lg:max-w-none ${left ? 'lg:order-1' : 'lg:order-2'}`}>
        <Media media={s.media} />
      </div>
    </div>
  );
}

function InlineSection({ s }) {
  return (
    <div>
      <h2 className="m-0 mb-6 font-display text-2xl font-extrabold uppercase leading-[1.05] tracking-wide text-[#E2DFD7] md:text-3xl">
        {s.title}
      </h2>
      <div className="flex flex-col gap-10">
        {s.items.map((it) => (
          <div
            key={it.title}
            className={`flex flex-col gap-5 md:items-center md:gap-10 ${
              it.imgSide === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'
            }`}
          >
            {it.img?.src && (
              <img
                src={it.img.src}
                alt={it.img.alt}
                loading="lazy"
                draggable={false}
                className={`w-full shrink-0 border border-white/30 ${
                  it.img.large ? 'max-w-[280px] md:w-[350px] md:max-w-none' : 'max-w-[220px]'
                }`}
              />
            )}
            <div>
              <h3 className="m-0 mb-2 font-serif-thin text-lg uppercase tracking-wider text-[#F1EFEA] md:text-2xl">
                {it.title}
              </h3>
              <p className={`m-0 ${bodyCls}`}>{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderSection(s) {
  if (s.type === 'split') return <SplitSection s={s} />;
  if (s.type === 'inline') return <InlineSection s={s} />;
  return <TextBlock b={s} />;
}

/* ------------------------------ demo videos ------------------------------ */

// Muted + looping so browsers allow it to autoplay. `muted` is also set in code,
// because React doesn't always write it onto the <video> tag.
function DemoVideo({ src, className, onError }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play?.().catch(() => {});
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      onError={onError}
      className={className}
    />
  );
}

// Only shown while developing (npm run dev) - visitors never see this.
function DevNote({ file, failed, laptop }) {
  return (
    <div
      className={`flex w-full items-center justify-center border border-dashed border-[#C84B82]/60 p-5 text-center font-syne text-xs leading-relaxed text-[#C84B82] ${
        laptop ? 'aspect-[16/10]' : 'aspect-[9/16]'
      }`}
    >
      {failed ? (
        <span>
          Found <b>{file}</b>, but the browser couldn&rsquo;t play it. If it&rsquo;s in OneDrive, make sure it finished
          syncing (right-click &rarr; Always keep on this device). Otherwise re-export it as an H.264 .mp4.
          <br />
          <i>(only you see this while developing)</i>
        </span>
      ) : (
        <span>
          Demo video not found.
          <br />
          Put <b>{file}</b> in <b>src/assets/videos/</b>
          <br />
          Press F12 &rarr; Console to see which videos I can see.
          <br />
          <i>(only you see this while developing)</i>
        </span>
      )}
    </div>
  );
}

function LaptopVideo({ src, onError }) {
  return (
    <div className="w-full max-w-[550px]" style={{ perspective: 1000 }}>
      <div className="relative mx-auto aspect-[16/10] w-[88%] overflow-hidden rounded-t-[10px] border-[15px] border-[#222] bg-[#111] shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]">
        {src && <DemoVideo src={src} onError={onError} className="h-full w-full object-cover" />}
      </div>
      <div className="relative h-[15px] w-full rounded-b-[15px] bg-[#333] shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        <div className="absolute left-1/2 top-0 h-1 w-1/5 -translate-x-1/2 rounded-b-[5px] bg-[#111]" />
      </div>
    </div>
  );
}

function PhoneVideo({ src, onError }) {
  if (!src) return null;
  return (
    <DemoVideo
      src={src}
      onError={onError}
      className="block h-auto w-full rounded-[35px] border border-white/30"
    />
  );
}

/* ------------------------------ hero ------------------------------ */

function Hero({ cs }) {
  const [videoFailed, setVideoFailed] = useState(false);
  const laptop = cs.video.device === 'laptop';
  const showVideo = Boolean(cs.video.src) && !videoFailed;
  // a missing / broken demo gets an explaining note while developing
  const showDevNote = import.meta.env.DEV && Boolean(cs.video.file) && !showVideo;
  const hasMedia = showVideo || showDevNote || Boolean(cs.heroExtraImage?.src);
  return (
    <div
      className={`grid gap-10 lg:gap-[50px] ${
        // A laptop is short and wide, so on desktop it sits centered beside the text
        // instead of leaving a big empty gap under it. Phone videos stay top-aligned.
        laptop ? 'items-start lg:items-center' : 'items-start'
      } ${hasMedia ? (laptop ? 'lg:grid-cols-[550px_1fr]' : 'lg:grid-cols-[320px_1fr]') : ''}`}
    >
      {hasMedia && (
        <motion.div
          className={`mx-auto flex w-full flex-col items-center gap-8 ${laptop ? 'max-w-[550px]' : 'max-w-[320px]'}`}
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          {showVideo &&
            (laptop ? (
              <LaptopVideo src={cs.video.src} onError={() => setVideoFailed(true)} />
            ) : (
              <PhoneVideo src={cs.video.src} onError={() => setVideoFailed(true)} />
            ))}
          {showDevNote && <DevNote file={cs.video.file} failed={videoFailed} laptop={laptop} />}
          {cs.heroExtraImage?.src && (
            <img
              src={cs.heroExtraImage.src}
              alt={cs.heroExtraImage.alt}
              className="w-full max-w-[450px] border border-white/30"
            />
          )}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
      >
        <h1 className="m-0 font-display text-4xl font-extrabold uppercase leading-[1.05] tracking-wide text-[#E2DFD7] sm:text-5xl md:text-6xl">
          {cs.name}
        </h1>
        {cs.tagline && (
          <p className="m-0 mt-3 font-serif-thin text-lg uppercase tracking-wider text-white/90 md:text-2xl">
            {cs.tagline}
          </p>
        )}
        <p className={`m-0 mb-8 mt-6 ${bodyCls}`}>{cs.intro}</p>

        {!cs.comingSoon && (
          <div className="mb-10 grid gap-5 rounded-2xl px-6 py-6 md:grid-cols-3" style={pillStyle}>
            {[
              ['Tools', cs.meta.tools],
              ['Roles', cs.meta.roles],
              ['Date Finished', cs.meta.date],
            ].map(([label, value]) => (
              <div key={label}>
                <h3 className="m-0 mb-2 text-[11px] font-normal uppercase tracking-[0.18em] text-[#C84B82]">
                  {label}
                </h3>
                <p className="m-0 font-syne text-[13px] leading-[1.5] text-[#E2DFD7]">{value}</p>
              </div>
            ))}
          </div>
        )}

        {cs.heroProblem && (
          <>
            <h2 className="m-0 mb-4 font-display text-2xl font-extrabold uppercase tracking-wide text-[#E2DFD7] md:text-3xl">
              {cs.heroProblem.title}
            </h2>
            <p className={`m-0 ${bodyCls}`}>{cs.heroProblem.text}</p>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------ navigation ------------------------------ */

function SideArrow({ side, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`fixed top-1/2 z-[1000] hidden -translate-y-1/2 cursor-pointer border-0 bg-transparent p-5 text-white/30 transition-all duration-300 hover:scale-125 hover:text-[#C84B82] min-[1350px]:block ${
        side === 'left' ? 'left-[2%]' : 'right-[2%]'
      }`}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points={side === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
      </svg>
    </button>
  );
}

// previous / next project at the bottom (also works on phones, where the side arrows are hidden)
function ProjectPager({ prev, next, go }) {
  if (!prev || !next) return null;
  const item = (slug, dir) => (
    <button
      type="button"
      onClick={() => go(slug)}
      className={`group flex cursor-pointer flex-col gap-1 border-0 bg-transparent p-0 ${
        dir === 'next' ? 'items-end text-right' : 'items-start text-left'
      }`}
    >
      <span className="font-syne text-[11px] uppercase tracking-[0.18em] text-[#C84B82]">
        {dir === 'next' ? 'Next project' : 'Previous project'}
      </span>
      <span className="font-serif-thin text-lg uppercase tracking-wider text-[#F1EFEA] transition-colors group-hover:text-[#C84B82] md:text-2xl">
        {caseStudies[slug].name}
      </span>
    </button>
  );
  return (
    <div className="mt-16 flex items-center justify-between gap-6 border-t border-white/15 pt-8">
      {item(prev, 'prev')}
      {item(next, 'next')}
    </div>
  );
}

/* ------------------------------ page ------------------------------ */

const gridBg = {
  backgroundColor: '#121212',
  backgroundImage:
    'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
  backgroundSize: '96px 96px',
};

export default function CaseStudyTemplate() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const cs = caseStudies[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const idx = CASE_STUDY_ORDER.indexOf(slug);
  const prev = idx >= 0 ? CASE_STUDY_ORDER[(idx - 1 + CASE_STUDY_ORDER.length) % CASE_STUDY_ORDER.length] : null;
  const next = idx >= 0 ? CASE_STUDY_ORDER[(idx + 1) % CASE_STUDY_ORDER.length] : null;

  const back = () => navigate('/#ui-ux-design');
  const go = (s) => navigate(`/work/${s}`);

  const BackButton = (
    <button
      type="button"
      onClick={back}
      className="inline-flex cursor-pointer items-center gap-2.5 rounded-full px-5 py-2 font-syne text-[13px] font-medium text-[#F1EFEA] transition-colors hover:border-[#C84B82] hover:bg-[#C84B82]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C84B82]"
      style={pillStyle}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to Portfolio
    </button>
  );

  if (!cs) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 text-[#E2DFD7]" style={gridBg}>
        <p className="m-0 font-serif-thin text-2xl uppercase tracking-wider">That case study doesn&rsquo;t exist.</p>
        {BackButton}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center px-[5%] pb-24 pt-10" style={gridBg}>
      <motion.div
        className="mb-10 w-full max-w-[1100px]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {BackButton}
      </motion.div>

      {prev && <SideArrow side="left" label="Previous case study" onClick={() => go(prev)} />}
      {next && <SideArrow side="right" label="Next case study" onClick={() => go(next)} />}

      {/* keyed by slug so the arrows replay the entrance */}
      <div key={slug} className="w-full max-w-[1100px]">
        <Hero cs={cs} />

        {cs.comingSoon ? (
          <p className={`mt-12 ${bodyCls}`}>The full case study for this project is coming soon.</p>
        ) : (
          <div className="mt-16 flex flex-col gap-14 md:gap-16">
            {cs.sections.map((s, i) => (
              <Reveal key={`${s.title ?? s.type}-${i}`} className="border-t border-white/15 pt-12">
                {renderSection(s)}
              </Reveal>
            ))}
          </div>
        )}

        <ProjectPager prev={prev} next={next} go={go} />
      </div>
    </div>
  );
}
