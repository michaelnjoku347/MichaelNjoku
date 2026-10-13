---
title: Kilobyte
summary: A browser game launcher. Press Play and it runs in this tab.
year: 2026
type: Personal project
featured: true
order: 1
cover: ./images/kilobyte/shelf.webp
coverAlt: Kilobyte’s Play screen, led by Cinder Field, a first-person WebGL2 match running in the tab at 60 fps, with Play this and Details buttons.
demo: /kilobyte/
demoLabel: Play the live demo
repo: https://github.com/michaelnjoku347/KiloByte
caseStudy: /projects/kilobyte/
tags: [React 19, TypeScript, Vite, WebGL2, WebAssembly, Emscripten, IndexedDB, Service Workers, GitHub Actions]
stats:
  - { value: '19', label: games in the house library }
  - { value: '3', label: ways to publish a game }
  - { value: '1', label: C++ game compiled to WebAssembly }
  - { value: '0 B', label: of a GitHub game on the server }
highlights:
  - 'Cinder Field, the lead game, is a WebGL2 match drawn in the tab. Versus bots works offline. Kiln Rally is C++ and SDL2 compiled to WebAssembly and played in the same frame.'
  - 'Three publishing paths: a public GitHub repo played through jsDelivr or GitHub Pages, a zip or folder kept in the visitor’s IndexedDB and served by a service worker, and a JSON cart run by a built-in canvas engine.'
  - 'A catalog ranked by star rating, with filters for genre and runtime (HTML, WASM, or cart). Optional cloud accounts and online lobbies need a free Supabase project; this demo does not include those keys.'
  - 'GitHub Actions lints with oxlint, runs Vitest, builds the WebAssembly game with Emscripten, and builds the site on every push.'
---

The shelf opens on Cinder Field, a first-person WebGL2 match. Behind it are HTML games, Kiln Rally (C++ compiled to WebAssembly), and tiny JSON carts. Publish by uploading a build, connecting a GitHub repo, or prompting a cart. This copy ships without a cloud account, so play stays in the browser.
