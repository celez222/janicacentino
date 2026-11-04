/**
 * Content for the "ABOUT ME" folder.
 * Put this file in:  src/data/aboutTabs.js
 *
 * ORDER MATTERS: it is the order of the tab numbers (01, 02, 03, ...).
 * The folder is drawn with room for up to 6 paper tabs (MAX_TABS in
 * AboutSection.jsx) - this file uses all 6.
 *
 * Every tab has:
 *   id      -> unique, no spaces
 *   number  -> the small number shown on the tab ("01")
 *   label   -> the word shown on the tab ("Profile")
 *   title   -> [plain part, pink part] - the big heading inside the paper
 *   type    -> picks the layout used inside the paper:
 *              'profile'  -> portrait + intro + highlight pills
 *              'timeline' -> vertical list of items (Education, Experience, ...)
 *              'skills'   -> grouped skill pills
 *
 * 'profile'  also uses:  eyebrow, paragraphs[], highlights[]
 * 'timeline' also uses:  items[] of { title, place, period, note?, bullets?[] }
 * 'skills'   also uses:  groups[] of { name, items[] }
 *
 * Written from your resume (Janica_Centino_Resume__A_.pdf).
 * (The portrait on the Profile paper is src/assets/images/hero/halftone-me.webp)
 */

export const aboutTabs = [
  {
    id: 'profile',
    number: '01',
    label: 'Profile',
    type: 'profile',
    title: ['Hi, I’m ', 'Janica.'],
    eyebrow: 'UI/UX Designer | Graphic Designer',
    paragraphs: [
      'I’m a BS Computer Science (Machine Learning) student at National University – Dasmariñas, combining engineering precision, QA discipline, and UI/UX expertise.',
      'I test production systems, manage creative strategy, and design scalable assets — translating complex backend data into intuitive, stable digital products using Figma, React, Flutter, and SQL.',
    ],
    highlights: ['UI/UX Design', 'Graphic Design', 'Front-end Development', 'QA & Testing'],
  },
  {
    id: 'education',
    number: '02',
    label: 'Education',
    type: 'timeline',
    title: ['Where I ', 'learned.'],
    items: [
      {
        title: 'BS Computer Science (Machine Learning)',
        place: 'National University – Dasmariñas',
        period: '2023 – 2027',
        note: 'Dean’s lister.',
      },
    ],
  },
  {
    id: 'experience',
    number: '03',
    label: 'Experience',
    type: 'timeline',
    title: ['What I’ve ', 'done.'],
    items: [
      {
        title: 'QA & System Validation',
        place: 'Freelancer',
        period: 'Jul 2026 – Feb 2027',
        bullets: [
          'Executed end-to-end system testing and documented user workflows across production platforms while auditing AWS database connectivity and missing dependencies to ensure software stability.',
        ],
      },
      {
        title: 'UI/UX Designer Trainee',
        place: 'Edufied Pte Ltd (Singapore)',
        period: 'Apr 2026 – Jul 2026',
        bullets: [
          'Optimized UI components to maintain consistent design standards and user experience.',
          'Structured design files to ensure seamless developer hand-offs.',
          'Collaborated in agile teams to rapidly iterate on dashboards and digital assets.',
        ],
      },
      {
        title: 'Print & Technical Associate (Seasonal)',
        place: 'JanTri16 Printing Services',
        period: '2023 – 2025',
        bullets: [
          'Designed and deployed custom script solutions and layout automation programs to optimize the print pipeline, consistently accelerating production throughout and enforcing strict visual asset compliance.',
        ],
      },
    ],
  },
  {
    id: 'leadership',
    number: '04',
    label: 'Leadership',
    type: 'timeline',
    title: ['How I ', 'led.'],
    items: [
      {
        title: 'Chief Creative Officer',
        place: 'Junior Blockchain Education Consortium of the Philippines – NU Dasmariñas',
        period: '2026',
        bullets: [
          'Spearheaded the organization’s overall creative strategy and visual identity.',
          'Managed the creative department workflow to ensure timely project delivery.',
        ],
      },
      {
        title: 'Director, Visual Design',
        place: 'Junior Blockchain Education Consortium of the Philippines – NU Dasmariñas',
        period: '2025 – 2026',
        bullets: [
          'Led visual branding for organizational events and campaigns.',
          'Assigned and supervised creative tasks across associates, and designed publication materials aligned with brand standards.',
        ],
      },
      {
        title: 'Layout Designer',
        place: 'Symphony – NU Dasmariñas',
        period: '2025',
        bullets: [
          'Designed event posters, promotional graphics, official merchandise, and digital assets.',
          'Ensured cohesive branding across organizational materials.',
        ],
      },
    ],
  },
  {
    id: 'skills',
    number: '05',
    label: 'Skills',
    type: 'skills',
    title: ['What I ', 'do.'],
    groups: [
      {
        name: 'Design',
        items: ['UI/UX Design', 'Graphic Design', 'Visual Branding', 'Layout Design'],
      },
      {
        name: 'Design Tools',
        items: ['Figma', 'Adobe Illustrator', 'Canva'],
      },
      {
        name: 'Web & Mobile Dev',
        items: ['Python', 'HTML', 'CSS', 'JavaScript', 'Java', 'React', 'Flutter', 'Dart'],
      },
      {
        name: 'Databases',
        items: ['SQLite', 'MySQL'],
      },
    ],
  },
  {
    id: 'certificates',
    number: '06',
    label: 'Certificates',
    type: 'timeline',
    title: ['What I’ve ', 'earned.'],
    items: [
      {
        title: 'Digital Poster Champion',
        place: 'SECA CS and IT Day 2025 – National University Dasmariñas',
        period: '2025',
      },
      {
        title: 'Specialist Database',
        place: 'Certiport IT',
        period: '2025',
      },
    ],
  },
];