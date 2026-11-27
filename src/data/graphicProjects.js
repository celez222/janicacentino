/**
 * Graphic design projects.
 *
 * ORDER MATTERS: this is the left-to-right order of the fan
 * (the card at START_INDEX in GraphicSection.jsx starts in the center).
 *
 * Images go in:  src/assets/images/graphics/
 *   file     -> thumbnail shown on the fanned card
 *   fullFile -> (optional) bigger image shown in the pop-up.
 *               If you leave it out, the thumbnail is used for both.
 *   gallery  -> (optional) a list of { label, file } for a STACKED project.
 *               Clicking the card opens the pop-up on the FIRST image with a
 *               "click the design to see N more" notification. Clicking the
 *               design (or the notification) makes the other designs appear
 *               so the visitor can switch between them. When a gallery is set,
 *               fullFile is not needed.
 *   transparent -> (optional) true when the thumbnail has a transparent
 *               background (glow in the project's colors). The card then has
 *               no box shadow, so no dark rectangle shows behind it.
 *
 * Details shown around the pop-up:
 *   title, category, description -> frosted panel on the left
 *   year                         -> small frosted chip, bottom right
 *   tools                        -> "Made with" badge, top right
 *                                   ('canva' | 'photoshop' | 'illustrator' | 'figma',
 *                                    or any other text for a plain label)
 *
 * The descriptions and years below are PLACEHOLDERS - replace them with yours.
 * Missing images won't crash anything - the card shows a colored
 * placeholder with the project title until you add the file.
 */

const images = import.meta.glob('../assets/images/graphics/*.{webp,png,jpg,jpeg}', {
  eager: true,
  import: 'default',
});

const resolve = (file) =>
  file ? images[`../assets/images/graphics/${file}`] ?? null : null;

const projects = [
  {
    id: 'web-blueprint',
    title: 'The Modern Web Development Blueprint',
    category: 'Event poster',
    year: '2026',
    description:
      'Promo poster for a web development crash course, with a glossy 3D laptop and neon type.',
    tools: ['illustrator'],
    file: 'web-blueprint.webp',
    fullFile: 'web-blueprint-full.webp',
    accent: '#3b1a66',
  },
  {
    id: 'campus-tour',
    title: 'Campus Tour',
    category: 'Social media post',
    year: '2025',
    description:
      'Announcement visual for the TrustWallet campus tour at National University Dasmariñas.',
    tools: ['figma'],
    file: 'campus-tour.webp',
    fullFile: 'campus-tour-full.webp',
    accent: '#7b6cff',
  },
  {
    id: 'audition-light',
    title: 'Audition (Light)',
    category: 'Event poster',
    year: '2025',
    description:
      'Light-theme audition poster with a halftone photo of two guitarists and colorful outlined lettering.',
    tools: ['figma'],
    file: 'audition-light.webp',
    fullFile: 'audition-light-full.webp',
    accent: '#d8d8d8',
  },
  {
    id: 'back-in-stock',
    title: 'Back in Stock',
    category: 'Product post',
    year: '2025',
    description:
      'Restock announcement with a film-strip photo collage and a product details block.',
    tools: ['canva'],
    file: 'back-in-stock.webp',
    fullFile: 'back-in-stock-full.webp',
    accent: '#3a2c24',
  },
  {
    // STACKED project: 3 designs for the same cafe behind one card.
    id: 'dragon-brew',
    title: 'Dragon Brew Café Bistro',
    category: 'Proposed brand identity & menus',
    year: '2026',
    description:
      'Proposed designs for Dragon Brew Café Bistro: a brand identity board with logo lockups, color palette and type pairing, plus a drinks menu and a food menu. These are concept designs, not an official client project.',
    tools: ['figma'],
    transparent: true,
    file: 'dragon-brew.webp',
    gallery: [
      { label: 'Branding', file: 'dragon-brew-branding-full.webp' },
      { label: 'Drinks menu', file: 'dragon-brew-drinks-full.webp' },
      { label: 'Food menu', file: 'dragon-brew-food-full.webp' },
    ],
    accent: '#213b33',
  },
  {
    id: 'cafe-xandra',
    title: 'Café Xandra × Takoyakipeds',
    category: 'Proposed promo poster',
    year: '2026',
    description:
      'Proposed "We are open everyday" poster for the Café Xandra x Takoyakipeds food truck, with a hand-drawn octopus mascot and a warm red, blue and yellow palette. This is a concept design, not an official client project.',
    tools: ['figma'],
    transparent: true,
    file: 'cafe-xandra.webp',
    fullFile: 'cafe-xandra-full.webp',
    accent: '#8f0008',
  },
  {
    id: 'audition',
    title: 'NUD Symphony Audition',
    category: 'Event poster',
    year: '2025',
    description:
      'Open call for singers and instrumentalists, with the schedule and room details up front.',
    tools: ['figma'],
    file: 'audition.webp',
    fullFile: 'audition-full.webp',
    accent: '#4b3a8c',
  },
  {
    id: 'new-collection',
    title: 'New Collection',
    category: 'Fashion post',
    year: '2025',
    description:
      'Editorial new-collection announcement in a soft cream palette with serif type.',
    tools: ['canva'],
    file: 'new-collection.webp',
    fullFile: 'new-collection-full.webp',
    accent: '#d9d3c4',
  },
  {
    id: 'general-assembly',
    title: 'General Assembly',
    category: 'Event poster',
    year: '2026',
    description:
      'Chrome-style typographic poster for an organization general assembly.',
    tools: ['illustrator'],
    file: 'general-assembly.webp',
    fullFile: 'general-assembly-full.webp',
    accent: '#241447',
  },
];

export const graphicProjects = projects.map((p) => {
  const src = resolve(p.file);

  // stacked project: resolve every image in the gallery, the pop-up opens on the first one
  const gallery = p.gallery
    ? p.gallery.map((g) => ({ ...g, src: resolve(g.file) }))
    : undefined;

  const full = gallery?.[0]?.src ?? resolve(p.fullFile) ?? src;
  return { ...p, src, full, gallery };
});
