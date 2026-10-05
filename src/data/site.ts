/**
 * Your profile, experience, education, and skills.
 *
 * Edit the text between the quotes and save; the home page and the résumé
 * both update. Projects live in their own files in src/content/projects/
 * (see the README for how to add one).
 */

export const profile = {
  name: 'Michael Njoku',
  firstName: 'Michael',
  title: 'Computer Science Student & Developer',
  location: 'Freeport, NY',
  timeZone: 'America/New_York',
  site: 'https://njoku.dev',
  status: 'Open to internships & entry-level roles',
  /** The paragraph under your name on the home page. */
  intro:
    'I study Computer Science at Farmingdale State College. I love expressing my ideas in code, building alongside other developers, and teaching what I know. This is where I keep everything I make.',
  /** The summary at the top of the résumé page. */
  summary:
    'Computer Science student at Farmingdale State College (Class of 2029) who loves expressing ideas in code, building alongside other developers, and teaching what I know. Currently interning at Venture Starters and building Kilobyte, a browser-game catalog.',
  about: [
    'I’m Michael, a Computer Science student at Farmingdale State College (Class of 2029) from Freeport, NY. I like understanding how things work all the way down, so my interests run from Java, Python, and Lua to digital circuits and PC diagnostics.',
    'Right now I’m interning with Venture Starters, analyzing live startup pitches and learning how early-stage teams form, iterate, and scale toward funding. On campus I’m part of the Artificial Intelligence Club and the Cyber Security Club.',
    'My latest project is Kilobyte, a browser-game catalog anyone can publish to without the site ever hosting the files. I learn best by building, so there’s always another project on the way.',
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

/**
 * The contact form keeps your email address off the site. Messages are sent
 * through Web3Forms (https://web3forms.com), which forwards them to your inbox.
 *
 * To turn it on: enter your email at https://web3forms.com, confirm the message
 * they send you, and paste the access key below (or set PUBLIC_WEB3FORMS_ACCESS_KEY
 * on Vercel). The key is safe to publish: it can only send messages to you.
 * Until a key is added, the Contact section points visitors to LinkedIn instead.
 */
const web3formsKey = '';

export const contactForm = {
  accessKey: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY || web3formsKey,
};

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

/** Newest first. Set `current: true` on the job you have now. */
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
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const;
