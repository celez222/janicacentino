/**
 * Case study content for the UI/UX projects.
 * Put this file in:  src/data/caseStudiesData.js
 *
 * `name` + `tagline` are the big hero heading and the line under it (`title` is the full long title).
 * Every case study's `slug` matches the `slug` in src/data/uiuxProjects.js,
 * so the "View Project" button goes to /work/<slug>.
 *
 * ASSETS - copy the image folders from your OLD portfolio (assets/images/webNmob/*)
 * into src/assets/images/case-studies/, and the videos into src/assets/videos/
 * (create that folder). Keep every file and folder name exactly as it was:
 *
 *   src/assets/images/case-studies/ScreenMateUI/     Home Screen.png, homescreenActual.jpg,
 *                                               ShopCrying.jpg, Accesories.png
 *   src/assets/images/case-studies/TivesToolkitUI/   TT color palette 1.png, fontvibe.png, colormuse.png
 *   src/assets/images/case-studies/EcoQuestUI/       EcoQuest CP.png, toolbarEQ.png,
 *                                               HomeNProfEQ.png, QuestComp.png
 *   src/assets/images/case-studies/CosmicCUI/        colorPalette.png, RibbonetteStandard.png, gameTP.png,
 *                                               DesignTp.png, emphasis of design.png, hint.png,
 *                                               Navigation.png, resultsNimpact.png
 *   src/assets/images/case-studies/BantayPawsUI/  startup.webp, logo.webp, palette.webp, owner-home.webp,
 *                                               owner-sitter-profile.webp, owner-chat.webp,
 *                                               sitter-dashboard.webp, sitter-bookings.webp   (no video)
 *   src/assets/videos/                          ScreenMateDemo.mp4, TivesToolkit Demo.mp4,
 *                                               EcoQuestDemo.mp4, cosmicC demo.mp4
 *
 * VIDEOS ARE FORGIVING: the page finds a demo by its name only - capital letters, spaces
 * and the file type (.mp4 / .webm / .mov) don't matter, and the video can sit in any
 * folder inside src/. While you run `npm run dev`, a missing video shows a dashed
 * pink box on the page and a message in the browser console (F12) telling you exactly
 * which file it is looking for and which videos it can see. Visitors never see that box.
 *
 * A missing file never crashes the page - that image or video is just skipped.
 *
 * Block types used in `sections`:
 *   text   -> a full-width block (title, paragraphs, bullets, subsections, images)
 *   split  -> text blocks on one side, image(s) on the other (mediaSide: 'left' | 'right')
 *   inline -> small rows of text with an icon-sized image beside them
 * A paragraph can be a plain string, or { lead, text } to start with a bold lead-in.
 */

const images = import.meta.glob('../assets/images/case-studies/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

// Every video anywhere inside src/ (any folder, any capital letters)
const videos = import.meta.glob('../**/*.{mp4,MP4,Mp4,webm,WEBM,mov,MOV}', {
  eager: true,
  import: 'default',
});

// "TivesToolkit Demo.MP4"  ->  "tivestoolkitdemo"
const simplify = (name) =>
  name
    .split('/')
    .pop()
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const videosByName = {};
Object.entries(videos).forEach(([path, url]) => {
  videosByName[simplify(path)] = url;
});

const img = (path) => images[`../assets/images/case-studies/${path}`] ?? null;

const vid = (file) => {
  const url = videosByName[simplify(file)] ?? null;
  if (!url && import.meta.env.DEV) {
    const seen = Object.keys(videos).map((p) => p.split('/').pop());
    console.warn(
      `[case studies] Can't find the demo video "${file}". ` +
        (seen.length
          ? `Videos I can see: ${seen.join(', ')}`
          : 'I can not see ANY video - is the folder src/assets/videos created, with the videos inside it?')
    );
  }
  return url;
};

/* -------------------------------------------------------------------------- */
/*  SCREEN MATE                                                               */
/* -------------------------------------------------------------------------- */
const screenMate = {
  slug: 'screen-mate',
  name: 'Screen Mate',
  tagline: 'A Virtual Pet Companion for Gamified Productivity and Time Management',
  title: 'Screenmate: A Virtual Pet Companion for Gamified Productivity and Time Management',
  intro:
    'Screenmate is a gamified productivity app that transforms traditional task tracking into a high-stakes survival mechanic. It addresses disorganized routines by tying your real-world consistency directly to the health of a virtual pet.',
  meta: {
    tools: 'Flutter, Dart, Riverpod, Isar NoSQL, Figma',
    roles: 'Front-end Developer, UI/UX Designer',
    date: 'February 16, 2026',
  },
  video: { src: vid('ScreenMateDemo.mp4'), file: 'ScreenMateDemo.mp4', device: 'phone' },
  heroProblem: {
    title: 'The Main Problem',
    text:
      'Many students struggle with disorganized time allocation because they are constantly distracted by their screens. This constant phone use leads to "doom scrolling," causing them to ignore important offline tasks. Without a way to stay focused, students face unproductive days and the stagnation of their personal goals.',
  },
  sections: [
    {
      type: 'text',
      title: 'The Design Challenges',
      bullets: [
        { lead: 'Game-First Design:', text: "How can I create a productivity tool that looks and feels like an immersive game to capture the user's attention immediately?" },
        { lead: 'Emotional Motivation:', text: 'How can I use the pet\'s survival and "health" mechanics to make users feel responsible for their own real-life consistency?' },
        { lead: 'Strategic Color Palette:', text: 'How can I use a bold, high-contrast color scheme to keep the app exciting while signaling the difference between "work time" and "reward time"?' },
        { lead: 'Dynamic Engagement:', text: 'How do I design a reward system that keeps the app fresh and fun, rather than just a repetitive cycle of finishing tasks?' },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: {
        layout: 'pair',
        items: [
          { src: img('ScreenMateUI/Home Screen.png'), alt: 'Screen Mate home screen design' },
          { src: img('ScreenMateUI/homescreenActual.jpg'), alt: 'Screen Mate home screen as built' },
        ],
      },
      blocks: [
        {
          title: 'Nostalgic Aesthetic meets Modern UX',
          paragraphs: ['To lower the "entry barrier" of a serious productivity tool, I leaned into Nostalgic Gamification.'],
          bullets: [
            { lead: 'The Inspiration:', text: 'I drew visual cues from early 2000s virtual pet hits like Pou and Talking Tom, focusing on vibrant, high-energy colors that make "work" feel like "play."' },
            { lead: 'The Execution:', text: "I utilized heavy black borders (2.0 width) and hard drop shadows with zero blur. This technique, combined with a signature Soft Rose for the pet's name tag, creates a distinct depth-of-field effect that ensures the app feels like a premium 2026 tool rather than a toy." },
          ],
          swatches: { title: 'COLOR PALETTE', colors: ['#FFFFFF', '#FF7EB9', '#2CD3E1', '#C5FF41', '#1E1E1E'] },
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      media: {
        layout: 'pair',
        items: [
          { src: img('ScreenMateUI/ShopCrying.jpg'), alt: 'Screen Mate shop with a crying pet' },
          { src: img('ScreenMateUI/Accesories.png'), alt: 'Screen Mate accessories screen' },
        ],
      },
      blocks: [
        {
          title: 'The Navigation Color Strategy',
          paragraphs: ["I used a dual-tone palette to subconsciously guide the user's mental state:"],
          bullets: [
            { lead: 'Teal (Productivity Base):', text: 'Used for the Home Dashboard. Teal makes sense of calm and focus, providing a stable environment for deep work and task management.' },
            { lead: 'Pink (Creative Play):', text: 'When the user enters the Shop or Customization menus, the UI shifts to Pink. This signals a transition from "Work Mode" to an expressive, rewarding environment, preventing "dashboard fatigue."' },
          ],
        },
        {
          title: 'Designing for Emotional Motivation',
          paragraphs: ['We tapped into the "Pet Parent" psychology to drive user consistency.'],
          bullets: [
            { lead: 'The "Fur Baby" Effect:', text: "Knowing how deeply people care for their pets, we designed a Dynamic Sprite System. The pet's posture and expressions aren't static; they are directly tied to the user's real-life task completion." },
            { lead: 'The UI Hook:', text: 'If you neglect your tasks, your pet looks visibly sad or tired. This creates a "Two Birds, One Stone" UX: the user isn\'t just finishing a to-do list; they are "rescuing" their virtual companion.' },
          ],
        },
      ],
    },
    {
      type: 'text',
      title: 'The Reward Loop: Beyond the Health Bar',
      paragraphs: ['A game is only as good as its rewards. To prevent the "stagnant health" trap, I built an expandable Progression System.'],
      bullets: [
        { lead: 'Star Economy:', text: 'As users complete tasks, they earn "Stars"—a currency we integrated into the frontend to trigger immediate visual gratification.' },
        { lead: 'Environmental Customization:', text: "We designed the shop UI to allow users to spend their Stars on accessories and room upgrades. This creates a long-term goal: the more productive you are, the more unique your pet's world becomes." },
      ],
    },
    {
      type: 'text',
      title: 'Solution: Gamified Productivity',
      paragraphs: [
        "ScreenMate effectively addresses disorganized time allocation by transforming traditional task management into a high-stakes, consequence-driven survival game where a virtual companion's well-being is directly tied to user consistency. The outcome is a system of reinforced productivity where real-world discipline serves as the only shield for a digital life; users must complete goals to earn \"Stars\" for customization and health restoration, or face penalties like \"Carry-Over\" task debt, a 10% health deduction for inactivity, and the ultimate risk of \"Abandonment\" if the pet is neglected.",
      ],
    },
    {
      type: 'text',
      title: 'Conclusion',
      paragraphs: [
        'The process of designing and building the app was very fulfilling, yet challenging. The design was different from how I would often design an app; nevertheless, I tried to get out of my comfort zone and try something new. The design is pretty simple, but with vibrant colors, the app became alive. It seems more like a game rather than a productivity app, which was our goal.',
        "The process of creating the frontend was less challenging than I thought, as I had already considered how I would implement it while I was doing the design. As a designer and a frontend developer, it is important for me to understand how I will implement a design when I program it; that's why I knew the whole process of how I would do it. Since I have experience using Flutter from my previous projects, it was easier for me.",
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  TIVES TOOLKIT                                                             */
/* -------------------------------------------------------------------------- */
const tivesToolkit = {
  slug: 'tives-toolkit',
  name: 'Tives Toolkit',
  tagline: 'An AI-Driven Workspace for Automated Font and Color Discovery',
  title: 'Tives Toolkit: An AI-Driven Workspace for Automated Font and Color Discovery',
  intro:
    'Tives Toolkit is an AI-assisted design ecosystem built to streamline the brand ideation process. By leveraging a custom-trained model, the platform translates abstract user moods—like "Minimalist" or "calm"—into cohesive font pairings and four-color palettes, bridging the gap between semantic intent and visual execution.',
  meta: {
    tools: 'React, HTML, CSS, Node.js',
    roles: 'Full-Stack Developer',
    date: 'July 2025',
  },
  video: { src: vid('TivesToolkit Demo.mp4'), file: 'TivesToolkit Demo.mp4', device: 'laptop' },
  sections: [
    {
      type: 'text',
      title: 'The Main Problem',
      paragraphs: [
        'As a designer, I got tired of "tab-switching fatigue." Finding a good font is one task, but then you have to go to a different site to find a color palette that matches its personality. I wanted to automate this, but a simple search wasn\'t enough—I needed a system that actually learned which styles look good together. I built this tool to handle the "matching" logic for me so I could stay in the creative flow.',
      ],
    },
    {
      type: 'text',
      title: 'The UI/UX Thought Process',
      paragraphs: [
        'The core UX philosophy was born from "creative fatigue"—the exhaustion of searching through thousands of disconnected font and color libraries. The goal was to create a centralized, automated ecosystem that eliminates the need for context-switching between different web tools. By integrating AI-driven generation into a single interface, the workflow moves from manual searching to mood-based discovery, catering to the "lazy" (efficient) creative who wants immediate, high-quality results.',
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      mediaWidth: 350,
      media: {
        layout: 'single',
        items: [{ src: img('TivesToolkitUI/TT color palette 1.png'), alt: 'Tives Toolkit color palette', maxW: 320 }],
      },
      blocks: [
        {
          title: 'Visual Identity: Chic Modernism',
          paragraphs: [
            'To appeal to a creative audience, the UI adopts a minimalist-modern aesthetic with a dark-theme gradient foundation. This dark canvas ensures that the generated color palettes and typography pairings stand out without visual interference. The use of gradients adds depth and a "premium" feel, while the overall clean layout reflects the sophisticated tools within.',
          ],
        },
      ],
    },
    {
      type: 'text',
      title: 'Component Architecture & Hierarchy',
      paragraphs: ['The interface is split into two distinct yet seamless modules, each with a unique visual language to differentiate their functions:'],
      bullets: [
        { lead: 'FontVibe (Typography Pairing):', text: 'Utilizes a glassmorphism effect to create a layered, modern feel. The hierarchy is strictly enforced through scale—using large, bold title fonts contrasted against smaller body text—allowing users to instantly preview how the pairing handles different typographic weights.' },
        { lead: 'ColorMuse (Palette Generation):', text: 'Organized into a clean grid of boxes. Instead of just one option, it generates 8 distinct color palettes based on the user\'s mood prompt (e.g., "minimalist" or "calm"), providing variety while maintaining the user\'s specific aesthetic direction.' },
      ],
      images: [
        { src: img('TivesToolkitUI/fontvibe.png'), alt: 'FontVibe component UI' },
        { src: img('TivesToolkitUI/colormuse.png'), alt: 'ColorMuse component UI' },
      ],
    },
    {
      type: 'text',
      title: 'Seamless Navigation & Accessibility',
      paragraphs: [
        'The UX prioritizes "back-to-back" switching. By placing the navigation for both tools at the top of the site, the transition between font pairing and color selection is frictionless. This layout ensures that a designer can jump between choosing a typeface and a color scheme in seconds, fulfilling the project\'s primary goal of process automation and seamless creative flow.',
      ],
    },
    {
      type: 'text',
      big: true,
      title: 'The Learning Curve',
      subsections: [
        {
          title: 'From ML Theory to Full-Stack Reality',
          paragraphs: [
            'As a Computer Science student specializing in Machine Learning, my goal was to move beyond training static models and actually make them "live" on the web. This project forced me to step out of the lab and learn the architecture needed to connect a trained model to a functional React front-end. Through self-study and technical troubleshooting, I shifted from focusing only on model accuracy to mastering practical skills like state management and API responsiveness, ultimately turning abstract math into a usable tool.',
          ],
        },
        {
          title: 'Future Growth',
          paragraphs: [
            'Currently maintained as a personal productivity tool, the project serves as a "Proof of Concept" for future scalable applications. It stands as a testament to the power of a specialized CS background when applied to creative problem-solving, proving that even a "lazy" developer (like me) can build sophisticated systems to automate the tedious parts of the creative process.',
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  ECOQUEST                                                                  */
/* -------------------------------------------------------------------------- */
const ecoQuest = {
  slug: 'ecoquest',
  name: 'EcoQuest',
  tagline: 'A Gamified Mobile Application for Biodiversity Documentation and Climate Awareness in the Philippines',
  title: 'EcoQuest - A Gamified Mobile Application for Biodiversity Documentation and Climate Awareness in the Philippines',
  intro:
    'EcoQuest is a gamified mobile application developed for Android designed to promote biodiversity awareness and climate action in the Philippines. By combining artificial intelligence, gamification, and community features, it aims to transform environmental learning into an interactive and impactful experience.',
  meta: {
    tools: "Flutter, Dart, Firebase, Poorman's Rekognition, and Trained Model AI",
    roles: 'Front-end Developer, UI/UX Designer, and Project Manager',
    date: 'February 19, 2026',
  },
  video: { src: vid('EcoQuestDemo.mp4'), file: 'EcoQuestDemo.mp4', device: 'phone' },
  heroProblem: {
    title: 'The Main Problem',
    text:
      'Current environmental engagement among younger generations is declining due to a lack of interactive and accessible learning tools. This creates a significant gap between scientific biodiversity data and public interest, leaving many individuals disconnected from local conservation efforts.',
  },
  sections: [
    {
      type: 'text',
      big: true,
      title: 'The Design Thought Process',
      subsections: [
        {
          title: 'The Inspiration: A Real-Life Pokédex',
          paragraphs: [
            'The core idea for the app came from the Pokédex. I wanted to capture that same feeling of being an explorer on a journey, so I went with a retro-modern look. I used pixelated fonts and icons to give it that classic handheld game vibe, but mixed it with a clean, modern UI so it still feels smooth and easy to use.',
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      media: { layout: 'single', items: [{ src: img('EcoQuestUI/EcoQuest CP.png'), alt: 'EcoQuest color palette' }] },
      blocks: [
        {
          title: 'The Palette: Rooted in Nature',
          paragraphs: [
            'Since this is an app about biodiversity that actually gets people outside, I chose a color palette that reflects the environment. I used a mix of natural greens, blues, and browns to keep the design grounded in nature while users are out exploring.',
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: { layout: 'single', items: [{ src: img('EcoQuestUI/toolbarEQ.png'), alt: 'EcoQuest Pokeball navigation bar' }] },
      blocks: [
        {
          title: 'Navigation: The Pokeball Hub',
          paragraphs: [
            "The home page navigation bar is shaped like a Pokeball. It's the main hub that quickly connects you to everything you need the second you open the app: the camera for scanning, your collection of identified species, and the leaderboards to see how you rank.",
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      media: { layout: 'single', items: [{ src: img('EcoQuestUI/HomeNProfEQ.png'), alt: 'EcoQuest home and profile layout' }] },
      blocks: [
        {
          title: 'The Layout: Learning vs. Community',
          paragraphs: ['I split the app into two main sections:'],
          bullets: [
            { lead: 'Home:', text: 'This is the "learning" side where you spend your time discovering and identifying things.' },
            { lead: 'Profile:', text: "This is your personal space. It's where you can look through your gallery, check your achievements, and see your score. It also houses the community side where you can talk to other animal enthusiasts and share what you've found." },
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: { layout: 'single', items: [{ src: img('EcoQuestUI/QuestComp.png'), alt: 'EcoQuest Q quest menu' }] },
      blocks: [
        {
          title: 'The "Q" Menu',
          paragraphs: [
            'The logo itself is shaped like a "Q," but it\'s more than just a brand icon. I made it interactive—when you click the logo, it opens up a Quest menu that shows your daily tasks and challenges, keeping the "quest" aspect of the app front and center.',
          ],
        },
        {
          title: 'The Pivot: Balancing Retro and Usability',
          paragraphs: [
            'Originally, I wanted to go all-in on the retro aesthetic using a pixelated "paper" background for the quest menu to really lean into that old-school RPG feel. However, I realized that because it was an image-based asset, it ended up looking too pixelated and blurry on high-resolution screens and it wasn\'t very useful for the responsiveness of the screens. Aside from that I think we kept the design of the whole wireframe and integrated to the app.',
          ],
        },
      ],
    },
    {
      type: 'text',
      big: true,
      title: 'The Front-end Learning Curve',
      subsections: [
        {
          title: 'Flutter & Dart',
          paragraphs: [
            'As a first-time Flutter and Dart user, I adopted a "learn-as-I-go" approach, using YouTube and AI to translate my designs into code. I focused on mastering the widget system—nesting Rows and Columns for layouts and implementing specialized widgets for the camera and "Q" menu. My biggest milestone was learning state management to ensure the UI updated in real-time as users identified species or completed quests.',
          ],
        },
        {
          title: 'The Challenge of Responsiveness',
          paragraphs: [
            'Ensuring UI responsiveness across different devices was a major challenge, as I frequently encountered overlapping elements and overflow errors. To fix this, I moved away from fixed layouts and implemented scrollable components like SingleChildScrollView and ListView. This resolved the technical issues while making the app feel more natural when browsing long species descriptions or the gallery.',
          ],
        },
        {
          title: 'The Result of my Hardship... Phew',
          paragraphs: [
            'Against a tight two-month deadline, we successfully integrated every planned feature into the final build. As both the project manager and front-end developer, I am incredibly proud of what our team achieved. This was our first time training an object-identifying AI camera, implementing Firebase for real-time data, and building a full-scale mobile application from scratch. While many of these features initially felt beyond our capabilities, we pushed through our technical limits to transform a challenging concept into a fully functional reality.',
          ],
        },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  COSMIC CHRONICLES                                                         */
/* -------------------------------------------------------------------------- */
const cosmicChronicles = {
  slug: 'cosmic-chronicles',
  name: 'Cosmic Chronicles',
  tagline: 'Development of an Interactive Physics Game-Based Learning Tool for College Students',
  title: 'Cosmic Chronicles: Development of an Interactive Physics Game-Based Learning Tool for College Students',
  intro:
    'Cosmic Chronicles is a 2D educational adventure game developed with the Godot Engine that teaches core physics topics—Free Fall, Projectile Motion, and Collision—through a narrative following a character named Ribbonette. The app integrates hand-drawn visuals, interactive tutorials, and a progression-based system where players solve physics-based challenges and multiple-choice questions to advance the story and earn achievement badges.',
  meta: {
    tools: 'Godot, GDScript, Figma, SQLite',
    roles: 'Full-Stack Developer, UI/UX Designer',
    date: 'February, 2025',
  },
  video: { src: vid('cosmicC demo.mp4'), file: 'cosmicC demo.mp4', device: 'laptop' },
  heroExtraImage: { src: img('CosmicCUI/colorPalette.png'), alt: 'Cosmic Chronicles color palette' },
  sections: [
    {
      type: 'text',
      title: 'The Main Problem',
      paragraphs: [
        'Physics is a major academic challenge for Filipino college students because traditional teaching methods often fail to bridge the gap between abstract concepts and real-world application. This difficulty is compounded by limited access to resources, a lack of physical facilities, and a disconnect between instructional materials and student engagement.',
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      media: { layout: 'single', items: [{ src: img('CosmicCUI/RibbonetteStandard.png'), alt: 'Ribbonette character', maxW: 300, plain: true }] },
      blocks: [
        {
          title: 'The Story of Ribbonette',
          bulletStyle: 'acts',
          bullets: [
            { lead: 'Act I: The Arrival', text: "Ribbonette's galactic exploration takes a turn when she crash-lands on Earth; stranded and desperate, she meets a physics enthusiast who becomes her guide." },
            { lead: 'Act II: Projectile Motion (Level 1)', text: 'In a dense forest, Ribbonette finds her spaceship parts tangled in high vines. To retrieve them, she must use a bow and arrow to strike the vines, applying projectile physics to ensure the parts fall safely for recovery.' },
            { lead: 'Act III: Free Fall (Level 2)', text: 'The search leads to a scaffold where a curious cat begins pushing spaceship components off the edge. Ribbonette must calculate the velocity and timing of the falling objects to catch them before they hit the ground.' },
            { lead: 'Act IV: Collision (Level 3)', text: 'With her ship repaired, Ribbonette returns to space but encounters hostile aliens and dense asteroid fields. She must use laser navigation, being careful to target enemies rather than meteors, as hitting the latter causes a ricochet effect based on Newtonian collision mechanics.' },
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: { layout: 'single', items: [{ src: img('CosmicCUI/gameTP.png'), alt: 'Game design sketches' }] },
      blocks: [
        {
          title: 'Game Thought Process',
          paragraphs: [
            'The development team focused on the fundamentals of a college-level physics course, specifically selecting Free Fall, Projectile Motion, and Collision because they offer the most intuitive real-life applications for gameplay integration. The core objective was to move away from traditional, "boring" teaching methods by blending rigorous formulas with a fictional, high-stakes narrative.',
            "By casting the player as an alien curious about Earth's gravity, the team created a relatable \"outsider\" perspective that mirrors a student's own journey in mastering complex scientific concepts. This approach ensures that players aren't just memorizing variables but are applying them to solve immediate, story-driven problems.",
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      media: {
        layout: 'stack',
        items: [
          { src: img('CosmicCUI/DesignTp.png'), alt: 'Cosmic Chronicles title screen' },
          { src: img('CosmicCUI/emphasis of design.png'), alt: 'Stage-play aesthetic' },
        ],
      },
      blocks: [
        {
          title: 'Design Thought Process',
          paragraphs: [
            {
              lead: 'The visual identity of Cosmic Chronicles',
              text: 'merges terrestrial settings with a "galaxy cosmic" theme to reflect Ribbonette\'s origins and mission. While levels take place in familiar environments like forests and deserts to illustrate her Earth exploration, the UI and menus maintain a cosmic aesthetic to remind players of her alien identity. This environmental storytelling is unified by a cohesive color palette that blends natural earth tones with cosmic purples and blues, reinforcing the connection between the world she explores and her goal of returning to space.',
            },
            {
              lead: 'Stage-Play Aesthetic:',
              text: 'A unique "theatrical" art style was adopted to emphasize that the game is a narrated chronicle. Each level is framed by a border representing a stage, and Ribbonette is mounted on a stick, drawing direct inspiration from traditional cardboard puppetry and stage plays. This stylistic choice reinforces the storyboard nature of the educational journey.',
            },
          ],
        },
      ],
    },
    {
      type: 'inline',
      title: 'User Experience Thought Process',
      items: [
        {
          title: 'Narrative Scaffolding:',
          text: "To ensure players connect with the mission, a dedicated storyboard precedes every level. These segments act as a bridge, explaining Ribbonette's current situation while simultaneously introducing the physics concepts required for the upcoming challenges.",
        },
        {
          title: 'Contextual Learning Tools:',
          text: 'In levels 1 and 2, a "Hint Book" icon is prominently placed. This provides players with immediate access to relevant physics formulas, reducing frustration and supporting the "learning-by-doing" philosophy.',
          img: { src: img('CosmicCUI/hint.png'), alt: 'Hint book icon' },
          imgSide: 'left',
        },
        {
          title: 'Interface Navigation:',
          text: 'The "stage border" serves a dual functional purpose. It houses essential navigation tools, including a pause button and a level selector, allowing users to track their progress and manage their gameplay experience without breaking the immersion of the story.',
          img: { src: img('CosmicCUI/Navigation.png'), alt: 'Navigation bar', large: true },
          imgSide: 'right',
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: { layout: 'single', items: [{ src: img('CosmicCUI/resultsNimpact.png'), alt: 'Students playing the game' }] },
      blocks: [
        {
          title: 'Results and Impact',
          paragraphs: [
            "The game was showcased during a university department event, successfully attracting a diverse audience of students from various academic backgrounds. Practical testing demonstrated high engagement levels, as students actively participated in the interactive physics challenges. Although the project did not secure a formal award during the event, the underlying research and development were academically recognized, with the final paper earning a position as one of the highest-graded projects in the department. This highlights the tool's effectiveness in making complex physics concepts accessible and engaging within a collegiate environment.",
          ],
        },
      ],
    },
    {
      type: 'text',
      title: 'Learning Curve & Development Experience',
      paragraphs: [
        "The development of Cosmic Chronicles marked a significant technical milestone as the team's first venture into game development using the Godot Engine and GDScript. With a compressed two-month production timeline, the process required a rigorous self-taught approach, relying on technical documentation and community tutorials to master the engine's unique architecture.",
        'Beyond the technical hurdles, the project served as a catalyst for professional growth in several key areas:',
      ],
      bullets: [
        { lead: 'Rapid Upskilling:', text: 'Transitioning from zero knowledge to executing a functional, database-integrated game within eight weeks.' },
        { lead: 'Agile Time Management:', text: 'Successfully managing "hectic" development cycles and troubleshooting technical bugs under a strict deadline.' },
        { lead: 'Collaborative Synergy:', text: 'Strengthening team coordination and maintaining a unified vision between design and programming.' },
        { lead: 'Frontline User Engagement:', text: 'Gaining invaluable firsthand feedback during the university showcase, which allowed for real-time observation of user interaction and the successful execution of the final product.' },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  BANTAY PAWS                                                               */
/*  Written from the BantayPaws PH business plan + your notes. This one has   */
/*  no demo video - it uses the Figma screens in BantayPawsUI/.               */
/* -------------------------------------------------------------------------- */
const bantayPaws = {
  slug: 'bantay-paws',
  name: 'Bantay Paws',
  tagline: 'A Community-Based Pet Care Super-App for Pet Owners and Pet Sitters',
  title: 'BantayPaws PH: A Community-Based Pet Care Super-App for Pet Owners and Pet Sitters',
  intro:
    'BantayPaws PH is a community-based pet care super-app that brings finding, communicating with, and paying pet sitters into one streamlined platform. Functioning as a pet care network, similar to Fiverr or Airbnb, it lets pet owners find and book trusted local pet sitters, manage tasks, track location, chat, and handle transactions all within a single application.',
  meta: {
    tools: 'Figma',
    roles: 'UI/UX Designer (Wireframes & Prototype)',
    date: 'May 2026',
  },
  video: { src: null, device: 'phone' },
  heroExtraImage: { src: img('BantayPawsUI/startup.webp'), alt: 'BantayPaws welcome screen' },
  heroProblem: {
    title: 'The Main Problem',
    text:
      'Pet owners who need a sitter usually juggle several disconnected apps: Facebook groups to find someone, Messenger to talk, and GCash to pay. On top of that, there is little transparency while someone else is watching their pet, and commercial pet hotels can be expensive.',
  },
  sections: [
    {
      type: 'text',
      big: true,
      title: 'The Design Thought Process',
      subsections: [
        {
          title: 'Warm and Cozy',
          paragraphs: [
            'BantayPaws is made for everyday people: pet owners looking for someone they can trust, and neighbors, students, and pet lovers who want to sit for them. I wanted the app to feel warm and cozy, like a neighborhood you already know, instead of a cold booking tool.',
            'That is why the screens use a soft cream background instead of harsh white. It is easy on the eyes and feels like home.',
          ],
        },
        {
          title: 'Cute, Not Intimidating',
          paragraphs: [
            'Because this is a casual app for pet owners and pet sitters, the look had to be cute and non-intimidating. Rounded shapes, chunky friendly buttons, and a playful orange cat peeking in from the bottom of the welcome screen keep things light, so users can use the app comfortably from the very first tap.',
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: { layout: 'single', items: [{ src: img('BantayPawsUI/logo.webp'), alt: 'BantayPaws logo', maxW: 304, plain: true }] },
      blocks: [
        {
          title: 'Logo Symbolism',
          paragraphs: [
            'The paw shows that the app caters to furry friends. The pin locator, commonly seen in maps, makes the app\u2019s purpose of finding caretakers instantly recognizable. The pin also doubles as the letter \u201Ca\u201D in \u201CPaws.\u201D',
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      media: { layout: 'single', items: [{ src: img('BantayPawsUI/palette.webp'), alt: 'BantayPaws color palette', maxW: 96 }] },
      blocks: [
        {
          title: 'The Color Palette',
          paragraphs: ['The app\u2019s palette carries the logo\u2019s warm and safe feel into the interface.'],
          bullets: [
            { lead: 'Cream:', text: 'a cozy background that replaces harsh white and makes every screen feel like home.' },
            { lead: 'Dark green and teal:', text: 'used for the bottom menu and the \u201CBook\u201D buttons, so important actions stand out and signal security and professionalism.' },
            { lead: 'Soft orange:', text: 'a friendly color for text boxes and schedules, echoing the \u201CBantay\u201D in the logo.' },
            { lead: 'Light blue:', text: 'used in the chat so messages stay clear and easy to read.' },
          ],
        },
      ],
    },
    {
      type: 'text',
      title: 'Designing for Two Sides',
      paragraphs: [
        'BantayPaws is a two-sided marketplace, so the design had to work for both pet owners and pet sitters. Two personas guided the flows:',
      ],
      bullets: [
        {
          lead: 'Sarah, the Busy Fur-Parent (26):',
          text: 'tech-savvy and relies on cashless payments, but feels guilty leaving her dog during long office hours. She hates juggling three apps and wants transparency. The app answers with verified local reviews, in-app payments, and GPS and digital checklists for peace of mind.',
        },
        {
          lead: 'Leo, the Pet Sitter (20):',
          text: 'a college student who wants to earn extra allowance without a rigid job schedule. The app lets him accept short sitting requests during free hours, and the task checklist tells him exactly what the owner expects, so there are no misunderstandings.',
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'right',
      mediaWidth: 540,
      media: {
        layout: 'trio',
        items: [
          { src: img('BantayPawsUI/owner-home.webp'), alt: 'Pet owner home screen' },
          { src: img('BantayPawsUI/owner-sitter-profile.webp'), alt: 'Pet sitter profile with the Book button' },
          { src: img('BantayPawsUI/owner-chat.webp'), alt: 'Pet owner chat with checklist, location and pay' },
        ],
      },
      blocks: [
        {
          title: 'The Pet Owner Flow',
          paragraphs: ['Everything a pet owner needs happens in one place, from finding a sitter to paying.'],
          bullets: [
            { lead: 'Set up:', text: 'sign up, then add each pet with a photo, name, breed, gender, and age.' },
            { lead: 'Find:', text: 'the home screen lets owners pick which pet needs care, enter their exact location, and browse nearby sitters with ratings, distance, and hourly rates.' },
            { lead: 'Trust and book:', text: 'each sitter profile shows a map, photos of the sitter\u2019s environment, and reviews right above the \u201CBook!\u201D button.' },
            { lead: 'Chat and pay:', text: 'a built-in chat with a Checklist button, the sitter\u2019s location on a map, and Cancel and Pay buttons, all under the conversation.' },
          ],
        },
      ],
    },
    {
      type: 'split',
      mediaSide: 'left',
      media: {
        layout: 'pair',
        items: [
          { src: img('BantayPawsUI/sitter-dashboard.webp'), alt: 'Pet sitter dashboard and profile' },
          { src: img('BantayPawsUI/sitter-bookings.webp'), alt: 'Pet sitter bookings and revenue' },
        ],
      },
      blocks: [
        {
          title: 'The Pet Sitter Flow',
          paragraphs: ['Sitters get their own side of the app, built around trust and flexibility.'],
          bullets: [
            { lead: 'Verified sign-up:', text: 'sitters upload a government ID and its type, which supports the app\u2019s promise of trusted, verified locals.' },
            { lead: 'Dashboard:', text: 'a profile card with a verified badge and community rating, an \u201CAbout me\u201D note, weekday and weekend rates, booking details such as deposit and pick-up options, photos of the environment, and reviews.' },
            { lead: 'Bookings and revenue:', text: 'total and monthly revenue at the top, then booking requests that show the date, sitting time, number of pets, and each pet\u2019s name and size, with a \u201CTake booking\u201D button.' },
            { lead: 'Confirmed bookings:', text: 'accepted jobs sit in their own list so sitters can mark them as completed, with chat, the shared checklist, and an emergency vet contact to keep owners updated.' },
          ],
        },
      ],
    },
    {
      type: 'text',
      title: 'Key Features',
      paragraphs: ['The prototype maps out the app\u2019s core features:'],
      bullets: [
        { lead: 'Catalogue and Forums:', text: 'owners see available sitters near them, and both sides can post offers and service details.' },
        { lead: 'Booking System:', text: 'a minimum booking of 3 hours at a base rate of \u20B1200, with extra time added at an hourly rate of \u20B166.67.' },
        { lead: 'Task Management and Tracking:', text: 'owners assign tasks such as feeding, bathing, cleaning up, or walking, tracked in a shared checklist.' },
        { lead: 'Location Tracking:', text: 'built-in GPS shows where the pet and sitter are during walks.' },
        { lead: 'Emergency Vet Contact:', text: 'sitters can quickly contact a nearby veterinarian and notify the owner.' },
        { lead: 'Community Hub and Chat:', text: 'ratings, reviews, and a mini forum, plus real-time chat between owners and sitters.' },
        { lead: 'Transaction Records:', text: 'after each booking the owner is prompted to rate the sitter, with payment details securely logged.' },
      ],
    },
    {
      type: 'text',
      title: 'The Prototype',
      paragraphs: [
        'I designed the wireframes and built the interactive prototype in Figma. It is a high-fidelity mockup that shows the app\u2019s core user flows and interface without needing a full backend, a working proof of concept of how BantayPaws replaces the fragmented pet-care process with one super-app.',
        'BantayPaws PH started as a group business plan for the Entrepreneurial Mind course at National University \u2013 Dasmari\u00F1as, and the prototype is the product side of that plan.',
      ],
    },
  ],
};

export const caseStudies = {
  [screenMate.slug]: screenMate,
  [tivesToolkit.slug]: tivesToolkit,
  [ecoQuest.slug]: ecoQuest,
  [cosmicChronicles.slug]: cosmicChronicles,
  [bantayPaws.slug]: bantayPaws,
};

// Order of the left / right arrows (same circle as your old portfolio:
// Cosmic <-> Screen Mate <-> Bantay Paws <-> Tives <-> EcoQuest <-> Cosmic).
export const CASE_STUDY_ORDER = ['cosmic-chronicles', 'screen-mate', 'bantay-paws', 'tives-toolkit', 'ecoquest'];
