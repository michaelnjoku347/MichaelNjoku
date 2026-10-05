/**
 * Everything the site says lives here. Edit this file to update njoku.dev —
 * the home page, the Kilobyte case study, and the printable résumé all read from it.
 */

export const profile = {
  name: 'Michael Njoku',
  firstName: 'Michael',
  title: 'Computer Science Student & Developer',
  location: 'Freeport, NY',
  timeZone: 'America/New_York',
  email: 'michaeln2029@gmail.com',
  site: 'https://njoku.dev',
  status: 'Open to internships & entry-level roles',
  headline: 'I build where hardware meets software.',
  intro:
    'I’m a Computer Science student at Farmingdale State College who loves working with both hardware and software. I’m a big fan of creativity, I love expressing my ideas in code, and I enjoy building alongside other developers—and teaching what I know.',
  about: [
    'I’m Michael—a Computer Science student at Farmingdale State College (Class of 2029) based in Freeport, NY. I’m happiest when a project touches both sides of the machine: digital circuits and PC diagnostics on one end, Java, Python, and Lua on the other.',
    'Right now I’m interning with Venture Starters, analyzing live startup pitches and learning how early-stage teams form, iterate, and scale toward funding. On campus I’m part of the Artificial Intelligence Club and the Cyber Security Club.',
    'My latest build is Kilobyte, a browser-game catalog that lets anyone publish a game without the site ever hosting the files. I learn by shipping, one commit at a time.',
  ],
  motto: 'Rome wasn’t built in a day.',
  spokenLanguages: ['English', 'Spanish (conversational)'],
  links: {
    github: 'https://github.com/michaelnjoku347',
    githubHandle: 'michaelnjoku347',
    linkedin: 'https://www.linkedin.com/in/michael-njoku-718666376/',
    source: 'https://github.com/michaelnjoku347/MichaelNjoku',
  },
} as const;

export const education = {
  school: 'Farmingdale State College',
  location: 'Farmingdale, NY',
  degree: 'Bachelor of Science in Computer Science',
  shortDegree: 'B.S. Computer Science',
  started: '2025-08-25',
  graduates: '2029-05-15',
  graduationLabel: 'Expected May 2029',
  coursework: [
    'Computer Programming I & II',
    'Computer Architecture & Organization',
    'Digital Circuit Design',
    'Data Management',
    'Data Structures & Algorithms I',
  ],
  clubs: ['Artificial Intelligence Club', 'Cyber Security Club'],
} as const;

export type Experience = {
  company: string;
  role: string;
  location: string;
  start: string;
  end: string;
  current?: boolean;
  summary: string;
  highlights: string[];
};

export const experience: Experience[] = [
  {
    company: 'Venture Starters',
    role: 'Intern',
    location: 'Remote',
    start: 'May 2026',
    end: 'Present',
    current: true,
    summary:
      'A global startup-ecosystem platform connecting founders, investors, and aspiring professionals.',
    highlights: [
      'Analyze startup pitches in real time, evaluating business models, value propositions, and investor criteria.',
      'Gain applied insight into how early-stage teams form, iterate, and scale toward funding.',
      'Build a working understanding of venture-capital evaluation standards and startup lifecycle stages.',
      'Sharpen critical thinking and business analysis through consistent exposure to live investor Q&A.',
    ],
  },
  {
    company: 'Burlington',
    role: 'Sales Associate',
    location: 'Freeport, NY',
    start: 'Sept 2025',
    end: 'May 2026',
    summary: 'Customer-facing retail in a high-traffic store.',
    highlights: [
      'Delivered consistent customer service, building strong communication and problem-solving skills.',
      'Managed opening and closing cash procedures and operated POS systems with accuracy under pressure.',
      'Learned new systems and store processes quickly, adapting to a fast-paced environment.',
      'Resolved customer issues alongside teammates during peak hours and seasonal rushes.',
    ],
  },
  {
    company: 'Medgar Evers Summer Youth Employment Program (SYEP)',
    role: 'Team Lead',
    location: 'Remote',
    start: 'Summer 2022',
    end: 'Summer 2022',
    summary: 'Led a peer team through a fully remote summer program.',
    highlights: [
      'Led a team of peers, coordinating task assignments and making sure daily goals were met.',
      'Collaborated on group projects and presented outcomes to a panel, incorporating structured feedback.',
      'Adapted coordination and communication strategies to a fully remote, virtual work environment.',
    ],
  },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  kind: string;
  summary: string;
  highlights?: string[];
  stack: string[];
  stats?: { value: string; label: string }[];
  links: { repo?: string; live?: string; caseStudy?: string };
};

export const featuredProject: Project = {
  slug: 'kilobyte',
  name: 'Kilobyte',
  tagline: 'A browser-game catalog that never hosts the games.',
  year: '2026',
  kind: 'Personal project',
  summary:
    'Pick a title, press Play, or publish your own—by connecting a GitHub repo, uploading a build that stays in your browser, or minting a tiny JSON cart. The site only stores the catalog, so hosting costs stay at a static frontend.',
  highlights: [
    'Three publishing paths: public GitHub repos played through jsDelivr or GitHub Pages, zip/HTML uploads kept in the creator’s IndexedDB and served by a service worker, and JSON “carts” run by a built-in canvas engine.',
    'Fully static—no server, no database, no paid AI proxy. Optional Gemini and GitHub tokens never leave the visitor’s browser.',
    'A catalog ranked by five-star ratings, with genre filters, keyboard search (Ctrl/⌘ K or /), saves, light and dark appearances, and an optional on-device profile.',
    'Vitest unit tests, a Puppeteer smoke test, oxlint, and a GitHub Actions pipeline that lints, tests, and builds every push.',
  ],
  stack: [
    'React 19',
    'TypeScript',
    'Vite',
    'IndexedDB',
    'Service Workers',
    'Canvas API',
    'GitHub REST API',
    'Gemini API',
    'Vitest',
    'Puppeteer',
    'GitHub Actions',
  ],
  stats: [
    { value: '15', label: 'games in the house library' },
    { value: '3', label: 'ways to publish a game' },
    { value: '0 B', label: 'of game files on the server' },
    { value: '640 B', label: 'smallest playable cart' },
  ],
  links: {
    live: '/kilobyte/',
    repo: 'https://github.com/michaelnjoku347/KiloByte',
    caseStudy: '/projects/kilobyte/',
  },
};

export const projects: Project[] = [
  {
    slug: 'njoku-dev',
    name: 'njoku.dev',
    tagline: 'This portfolio, rebuilt from scratch.',
    year: '2026',
    kind: 'Personal project',
    summary:
      'Version one was hand-written HTML/CSS shipped with the Vercel CLI. Version two is a static Astro + TypeScript site with light and dark themes, a command menu, scroll-driven motion, and a printable résumé—all generated from a single content file.',
    stack: ['Astro', 'TypeScript', 'CSS', 'Vercel'],
    links: {
      repo: 'https://github.com/michaelnjoku347/MichaelNjoku',
      live: 'https://njoku.dev',
    },
  },
  {
    slug: 'practice',
    name: 'Python & Java practice',
    tagline: 'Fundamentals beyond the syllabus.',
    year: 'Ongoing',
    kind: 'Independent study',
    summary:
      'Small projects in Python and Java that push my programming fundamentals past coursework, documented on GitHub as I go.',
    stack: ['Python', 'Java', 'IntelliJ IDEA', 'Git'],
    links: { repo: 'https://github.com/michaelnjoku347' },
  },
];

export type SkillGroup = {
  title: string;
  icon: 'code' | 'wrench' | 'database' | 'cpu' | 'users' | 'globe';
  items: string[];
};

export const skills: SkillGroup[] = [
  {
    title: 'Languages',
    icon: 'code',
    items: ['Java', 'Python', 'Lua', 'JavaScript', 'HTML', 'Visual Basic'],
  },
  {
    title: 'Tools & engines',
    icon: 'wrench',
    items: ['Git', 'IntelliJ IDEA', 'NetBeans', 'Godot Engine', 'Microsoft Office'],
  },
  {
    title: 'Systems & data',
    icon: 'database',
    items: ['MySQL', 'Windows 10/11', 'macOS'],
  },
  {
    title: 'Hardware & networking',
    icon: 'cpu',
    items: ['Networking fundamentals', 'Hardware troubleshooting', 'PC diagnostics'],
  },
  {
    title: 'Working with people',
    icon: 'users',
    items: [
      'Communication',
      'Collaboration',
      'Problem solving',
      'Attention to detail',
      'Critical thinking',
      'Adaptability',
    ],
  },
  {
    title: 'Spoken languages',
    icon: 'globe',
    items: ['English', 'Spanish (conversational)'],
  },
];

/** The eight "pins" on the hero chip, counter-clockwise from pin 1 like a real DIP package. */
export const chipPins = ['Java', 'Python', 'Lua', 'JavaScript', 'Git', 'Godot', 'MySQL', 'HTML'] as const;

export const askMeAbout = [
  'My website',
  'My GitHub',
  'My first programming language',
  'My proficiency in languages',
  'My favorite software',
  'Whatever piques your interest',
] as const;

export const interests = [
  'I love dealing with both hardware and software.',
  'I’m a big fan of creativity and love to express my ideas in code.',
  'I very much love working with other developers and teaching what I know.',
] as const;

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;
