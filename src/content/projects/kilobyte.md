---
title: Kilobyte
summary: A browser-game catalog that never hosts the games.
year: 2026
type: Personal project
featured: true
order: 1
cover: ./images/kilobyte/search.webp
coverAlt: Kilobyte’s Find a game screen, a grid of colorful game covers such as Dock Ledger, 2048, Void Line, and Star Nibbler, each with a star rating and Play and Save buttons.
demo: /kilobyte/
demoLabel: Play the live demo
repo: https://github.com/michaelnjoku347/KiloByte
caseStudy: /projects/kilobyte/
tags: [React 19, TypeScript, Vite, IndexedDB, Service Workers, Canvas API, GitHub REST API, Gemini API, Vitest, Puppeteer, GitHub Actions]
stats:
  - { value: '15', label: games in the house library }
  - { value: '3', label: ways to publish a game }
  - { value: '0 B', label: of game files on the server }
  - { value: '640 B', label: smallest playable cart }
highlights:
  - 'Three publishing paths: public GitHub repos played through jsDelivr or GitHub Pages, zip/HTML uploads kept in the creator’s IndexedDB and served by a service worker, and JSON “carts” run by a built-in canvas engine.'
  - Fully static, with no server, no database, and no paid AI proxy. Optional Gemini and GitHub tokens never leave the visitor’s browser.
  - A catalog ranked by five-star ratings, with genre filters, keyboard search (Ctrl/⌘ K or /), saves, light and dark appearances, and an optional on-device profile.
  - Vitest unit tests, a Puppeteer smoke test, oxlint, and a GitHub Actions pipeline that lints, tests, and builds every push.
---

Pick a title, press Play, or publish your own by connecting a GitHub repo, uploading a build that stays in your browser, or minting a tiny JSON cart. The site only stores the catalog, so hosting costs stay at a static frontend.
