# njoku.dev

Michael Njoku’s personal site. It lists his projects (with a playable [Kilobyte](https://github.com/michaelnjoku347/KiloByte) demo at [`/kilobyte/`](https://njoku.dev/kilobyte/)), his experience, and a printable résumé.

You don’t need to know Astro to keep this up to date. Astro is the tool that turns the files in this repo into a website. Each page is a mix of HTML and a little JavaScript at the top; when you run a build, Astro writes plain HTML, CSS, and JS that Vercel hosts. There is no database. Changing a Markdown file and pushing to GitHub is enough for a new project to show up.

| Page | Path |
| --- | --- |
| Home | `/` |
| All projects | `/projects/` |
| One project | `/projects/your-file-name/` |
| Kilobyte case study | `/projects/kilobyte/` |
| Kilobyte live demo | `/kilobyte/` |
| Résumé (print or save as PDF) | `/resume/` |

## Run it on your computer

You need [Node.js](https://nodejs.org/) 22.19 or newer. In a terminal, from this folder:

```bash
npm install          # only needed the first time, or after package.json changes
npm run dev          # opens http://localhost:4321 — refresh the browser after you save
```

Leave that running while you edit. Other useful commands:

```bash
npm run build        # writes the finished site into dist/
npm run preview      # serves dist/ so you can click through it
npm run check        # type-checks the project
```

## Edit your profile, jobs, and skills

Open [`src/data/site.ts`](src/data/site.ts). Change the text between quotes and save. The home page and the résumé both read from this file.

## Add a project

1. Copy [`src/content/projects/_template.md`](src/content/projects/_template.md).
2. Rename the copy, for example `my-project.md`. That name becomes the address: `/projects/my-project/`.
3. Fill in the fields at the top. Only `title`, `summary`, and `year` are required.
4. Optional: put a screenshot in `src/content/projects/images/` and point `cover:` at it.
5. Optional: write more below the `---` line. That text becomes the project’s own page.

Set `featured: true` on the one you want as the big card. Set `draft: true` to hide a project from the live site while you work on it (`npm run dev` still shows drafts).

## Change the photo

Replace [`src/assets/michael.jpg`](src/assets/michael.jpg), then run `npm run images` to refresh the link-preview picture (`public/og.png`).

## Contact form (keeps your email off the site)

The site never prints your Gmail address. Visitors write through a form, and [Web3Forms](https://web3forms.com) forwards the message to you.

1. Open [web3forms.com](https://web3forms.com), enter the inbox you want mail to reach, and confirm the email they send you.
2. Copy the access key.
3. Either paste it in `src/data/site.ts` as `contactForm.accessKey`, or add a Vercel environment variable named `PUBLIC_WEB3FORMS_ACCESS_KEY`.
4. Redeploy. The Contact section becomes a form. Until a key is set, that section points people to LinkedIn instead.

The key is safe to publish. It can only send mail to the inbox you verified; it cannot read your mail.

## Update the Kilobyte demo

The demo is a prebuilt copy of Kilobyte in `public/kilobyte/`. After changing Kilobyte, rebuild it:

```bash
npm run kilobyte                            # latest main from GitHub
KILOBYTE_DIR=../KiloByte npm run kilobyte   # or a local checkout
```

The script applies [`scripts/kilobyte-subpath.patch`](scripts/kilobyte-subpath.patch) so Kilobyte’s service worker and game files work from `/kilobyte/` instead of the site root. Once Kilobyte reads `import.meta.env.BASE_URL` itself, the script skips the patch automatically. Commit the updated `public/kilobyte/` folder.

## Other scripts

| Command | What it does |
| --- | --- |
| `npm run smoke` | Opens the built site in Chrome and checks pages, links, the theme toggle, the command menu, and the Kilobyte demo. Screenshots go to `.smoke/`. Set `CHROME_PATH` if Chrome isn’t found. |
| `npm run images` | Regenerates `public/og.png` (link previews) and `public/apple-touch-icon.png` |

## Deploy on Vercel

1. Import this repository in Vercel. The Astro preset is detected automatically.
2. Under **Settings → Domains**, add `njoku.dev`, and optionally `www.njoku.dev` redirecting to it.
3. At your DNS provider, point `njoku.dev` to Vercel as shown on that page, either an `A` record or Vercel nameservers. Point `www` with a `CNAME` to `cname.vercel-dns.com`.
4. If visitors see a Vercel login page, turn off **Settings → Deployment Protection → Vercel Authentication** for production.
5. To turn on the contact form, add `PUBLIC_WEB3FORMS_ACCESS_KEY` under **Settings → Environment Variables**.

`vercel.json` turns on trailing-slash URLs, which the demo’s service worker scope relies on, and long-lived caching for hashed assets.
