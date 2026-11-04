/**
 * UI/UX projects for the collage.
 * Put this file in:  src/data/uiuxProjects.js
 *
 * The collage is laid out on a 1147 x 744 "stage" (measured from your mockup).
 * The stage scales to fit the screen, so the WHOLE collage - including the
 * titles and text at the bottom - is visible at once (see FIT_TO_SCREEN in
 * UiUxSection.jsx). Every position below is in stage pixels, so you can nudge
 * things with simple numbers:
 *
 *   box(x, y, width, height)  -> a panel
 *   pos(x, y)                 -> a title label
 *
 * Hover text (the description + "View Project" button) is placed with:
 *   x, y   top-left corner of the text block (or, with anchor:'bottom', the
 *          y of its BOTTOM edge - handy when the block grows upward)
 *   w      width of the text block
 *   align  'left' or 'right'
 *
 * Images go in:  src/assets/images/ui-ux/
 *   file      -> the screen (grayscale, full color on hover)
 *   hoverFile -> (optional) a different preview that fades in on hover
 *
 * `slug` is the case study page (/work/:slug) - the full write-ups live in
 * src/data/caseStudiesData.js.
 * Missing images won't crash anything - a colored placeholder is shown
 * (gray until you hover, so you can see the effect right away).
 */

export const STAGE = { w: 1147, h: 744 };

const box = (x, y, w, h) => ({
  l: (x / STAGE.w) * 100,
  t: (y / STAGE.h) * 100,
  w: (w / STAGE.w) * 100,
  h: (h / STAGE.h) * 100,
});
const pos = (x, y) => ({ l: (x / STAGE.w) * 100, t: (y / STAGE.h) * 100 });

const info = ({ x, y, w, align = 'left', anchor = 'top' }) => ({
  l: (x / STAGE.w) * 100,
  w: (w / STAGE.w) * 100,
  align,
  // top-anchored: distance from the stage top. bottom-anchored: distance from the stage bottom.
  ...(anchor === 'bottom'
    ? { b: ((STAGE.h - y) / STAGE.h) * 100 }
    : { t: (y / STAGE.h) * 100 }),
});

// "UI/UX DESIGN" title block
export const HEADING = box(295, 8, 453, 100);

const images = import.meta.glob('../assets/images/ui-ux/*.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
});
const resolve = (file) =>
  file ? images[`../assets/images/ui-ux/${file}`] ?? null : null;

const projects = [
  {
    id: 'screen-mate',
    slug: 'screen-mate',
    title: 'Screen Mate',
    file: 'screen-mate.webp',
    hoverFile: null,
    accent: '#f2b8c6',
    panel: box(35, 0, 253, 434),
    label: { ...pos(5, 5), vertical: true },
    text:
      'Screenmate is a gamified productivity and time management app that transforms traditional task tracking into a high-stakes survival mechanic. Built with the Flutter framework, it addresses disorganized routines by tying your real-world consistency directly to the health of a virtual pet companion.',
    info: info({ x: 297, y: 128, w: 388 }),
  },
  {
    id: 'bantay-paws',
    slug: 'bantay-paws',
    title: 'Bantay Paws',
    file: 'bantay-paws.webp',
    hoverFile: null,
    accent: '#e0722f',
    panel: box(755, 0, 223, 385),
    label: { ...pos(985, 240), vertical: true },
    // wording from the BantayPaws PH business plan
    text:
      'BantayPaws PH was chosen to eliminate the hassle for pet owners who currently use multiple platforms for finding, communicating with, and paying pet sitters, by consolidating these necessities into one streamlined super-app.',
    info: info({ x: 988, y: 8, w: 147 }),
  },
  {
    id: 'ecoquest',
    slug: 'ecoquest',
    title: 'EcoQuest',
    file: 'ecoquest.webp',
    hoverFile: null,
    accent: '#2f8f9d',
    // runs to the bottom edge of the section, like your mockup
    panel: box(482, 299, 259, 445),
    label: { ...pos(482, 270), vertical: false },
    text:
      'EcoQuest is a gamified mobile application for biodiversity documentation and climate awareness in the Philippines. It engages users to explore and document local wildlife through AI-powered species recognition.',
    // right edge of the text lines up with the right edge of the EcoQuest panel (741)
    info: info({ x: 356, y: 157, w: 385, align: 'right' }),
  },
  {
    id: 'cosmic-chronicles',
    slug: 'cosmic-chronicles',
    title: 'Cosmic Chronicles',
    file: 'cosmic-chronicles.webp',
    hoverFile: null,
    accent: '#5b3fd1',
    panel: box(0, 451, 465, 233),
    bleed: 'left', // keeps going to the left edge of the screen
    label: { ...pos(4, 688), vertical: false },
    text:
      'Cosmic Chronicles is an interactive 2D educational game developed to teach core physics concepts to college students. It combines storytelling, hand-drawn visuals, and gamified challenges to make complex subjects like Free Fall and Projectile Motion highly engaging.',
    // bottom edge sits level with the bottom of the Screen Mate panel (y 432)
    info: info({ x: 301, y: 432, w: 166, anchor: 'bottom' }),
  },
  {
    id: 'tives-toolkit',
    slug: 'tives-toolkit',
    title: 'Tives Toolkit',
    file: 'tives-toolkit.webp',
    hoverFile: null,
    accent: '#7a3fd1',
    panel: box(755, 403, 440, 250), // wider than the stage on purpose: runs off the right edge
    bleed: 'right', // keeps going to the right edge of the screen
    label: { ...pos(757, 660), vertical: false },
    buttonBeside: true, // "View Project" sits next to the title instead of under the text
    hoverShift: 7,      // panel + title lift this many stage px on hover (as in your mockup)
    // The start of this sentence is hidden behind the dock in your mockup - edit if needed
    text:
      'A full-stack web application that leverages Artificial Intelligence to generate highly customized font and color palette recommendations for digital creators and web designers.',
    info: info({ x: 755, y: 687, w: 360 }),
  },
];

export const uiuxProjects = projects.map((p) => ({
  ...p,
  src: resolve(p.file),
  hoverSrc: resolve(p.hoverFile),
}));