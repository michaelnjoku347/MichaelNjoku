---
title: njoku.dev
summary: This portfolio, rebuilt from scratch with Astro.
year: 2026
type: Personal project
order: 2
demo: https://njoku.dev
repo: https://github.com/michaelnjoku347/MichaelNjoku
tags: [Astro, TypeScript, CSS, Vercel]
highlights:
  - Static Astro site with light and dark themes, a command menu, and a printable résumé.
  - Projects are Markdown files, so adding one never means touching the page code.
---

Version one of my site was hand-written HTML and CSS, shipped with the Vercel CLI. Version two is a static [Astro](https://astro.build) site that I can keep adding to.

## What’s inside

- **Projects as Markdown.** Every project, including this one, is a small Markdown file. The home page, the project pages, and my résumé all read from those files.
- **Light and dark themes** that follow your system setting, with a toggle in the header.
- **A command menu.** Press Ctrl K (⌘ K on a Mac) to jump anywhere on the site.
- **A printable résumé** at [/resume/](/resume/) that drops the site chrome when you print or save it as a PDF.
- **A live Kilobyte demo.** The site ships a playable build of [Kilobyte](/projects/kilobyte/) at [/kilobyte/](/kilobyte/).

## What I learned

Moving from hand-written pages to components meant I could change the design once and have every page follow. Keeping content in separate files also makes the site easy to grow: a new project is one new file.
