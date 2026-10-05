---
# HOW TO ADD A PROJECT
# 1. Copy this file and rename the copy, for example my-project.md.
#    The file name becomes the web address: /projects/my-project/
# 2. Fill in the fields below. Only title, summary, and year are required,
#    so delete any line you don't need.
# Files that start with an underscore (like this one) are ignored.

title: My Project
summary: One sentence about what it does. This shows on the project card.
year: 2026
type: Class project            # Personal project, Hackathon, Internship...
tags: [Python, Flask, SQLite]

# A screenshot for the card. Put the image in src/content/projects/images/.
# No screenshot? Delete these two lines and the card gets a colorful cover.
cover: ./images/my-project.png
coverAlt: What the screenshot shows, for people using screen readers.

demo: https://my-project.example.com   # live site or demo
demoLabel: Try it live                 # text on the demo button
repo: https://github.com/michaelnjoku347/my-project   # source code

featured: false   # true shows it as a big card at the top of Projects
order: 10         # lower numbers show first
draft: false      # true hides it from the live site (npm run dev still shows it)

# Bullet points for the résumé page.
highlights:
  - What you built, and what it does.
  - Something you learned or are proud of.
---

Anything you write below the dashed line becomes the project's own page at
/projects/my-project/. Leave it empty if the card is enough.

## You can use Markdown

- Lists, **bold**, and [links](https://example.com).
- Images: ![What the image shows](./images/my-project-2.png)
