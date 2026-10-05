// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Latin-only files keep each family to a single preloaded request.
const LATIN =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';

/**
 * @param {string} name
 * @param {string} cssVariable
 * @param {string} file
 * @param {string} weight
 * @param {string[]} fallbacks
 */
const localFont = (name, cssVariable, file, weight, fallbacks) => ({
  provider: fontProviders.local(),
  name,
  cssVariable,
  fallbacks,
  options: {
    variants: /** @type {[{ src: [string]; weight: string; style: 'normal'; unicodeRange: [string] }]} */ ([
      { src: [file], weight, style: 'normal', unicodeRange: [LATIN] },
    ]),
  },
});

export default defineConfig({
  site: 'https://njoku.dev',
  // Matches vercel.json; the Kilobyte demo's service worker is scoped to "/kilobyte/" with the slash.
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // The demo is a prebuilt app in public/, so Astro does not know about it.
      customPages: ['https://njoku.dev/kilobyte/'],
      filter: (page) => !page.includes('/404'),
    }),
  ],
  prefetch: {
    defaultStrategy: 'hover',
  },
  fonts: [
    localFont(
      'Bricolage Grotesque',
      '--font-display',
      '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2',
      '200 800',
      ['ui-sans-serif', 'system-ui', 'sans-serif'],
    ),
    localFont(
      'Inter',
      '--font-body',
      '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
      '100 900',
      ['ui-sans-serif', 'system-ui', 'sans-serif'],
    ),
    localFont(
      'JetBrains Mono',
      '--font-mono',
      '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
      '100 800',
      ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
    ),
  ],
});
