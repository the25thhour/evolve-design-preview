# Evolve Design Solutions: website refresh preview

A static design preview of a refreshed website for **Evolve Design Solutions Inc.**, the Ottawa product design consultancy of Aldo Balatti. It is built for client review only: every page carries `noindex, nofollow`, and nothing here replaces the live site at evolve-designsolutions.com.

All copy comes from the current site (harvested 2026-10-17). It has been tightened and corrected, but no new facts, clients, numbers, awards or testimonials have been added. Stale counts ("over 30 years", "33 years") are replaced with dates (since 1984, founded 2005). The brand mark is unchanged: the header uses the existing logo image, and the footer sets the company name in type.

Preview URL once published: https://the25thhour.github.io/evolve-design-preview/

## Pages

| Path | What it holds |
| --- | --- |
| `index.html` | Home: the headline, then all 43 products laid out as a contact sheet, one row label per sector. Then who Evolve is, the 4D process with Aldo's sketches, renderings and analysis images, the eight disciplines, Aldo, one testimonial and contact. |
| `work/index.html` | Index of all 43 projects with client and credit. Filter by sector and by who designed it (Evolve since 2005, or Aldo's earlier work at two firms). On desktop, a preview shows each project at native size. |
| `work/<slug>/index.html` | One shareable page per project: image at native size, description, client, sector, credit, awards and materials where the current site states them, more from the same sector, and previous/next links. |
| `capabilities/index.html` | Eight disciplines (project management, research, industrial, mechanical, product and plastics engineering, prototyping, manufacturing support), the 4D process in full, and how engagements work. |
| `about/index.html` | Aldo Balatti: bio, earlier work, dated awards list, recognition and press, memberships and service, the practice (mission, vision, welcome) and all 15 testimonials, verbatim. |
| `contact/index.html` | Address, phone and email as real `tel:` and `mailto:` links, the business contact, and a map link. There is no form, because nothing here could deliver it. |
| `review/index.html` | Notes for Aldo (preview only, `noindex`, not in the menu): what we need from him, questions only he can answer, decisions for launch, and every title change. Every page carries a slim "Preview for review · Notes for Aldo" bar that links to it. |

News is left out of the navigation: its last item is from August 2016, so it would make an active firm look dormant. Its strongest items are kept as a dated "Recognition and press" list on About.

**Removing the review layer at launch:** set `REVIEW = false` in `build.mjs` and rebuild. That drops the bar from every page and deletes `review/`.

## How it is built

Plain static HTML and hand-written CSS, with one small script. No framework and no dependencies.

- `build.mjs` generates every page from `data/portfolio.json` and `data/site.json` (the harvested content) plus `data/content.mjs` (the editorial layer: cleaned titles, rewritten descriptions, alt text, services, the 4D process). The generated HTML is committed, because GitHub Pages serves the files as they are.
- `styles.css` holds the tokens (colour, type steps, grid) and every layout. `site.js` adds the phone menu, the picture motion, the era toggle on the home sheet, and the work-index filters and preview.
- `assets/fonts/` holds Schibsted Grotesk (SIL Open Font License, `OFL.txt`), self-hosted as one variable woff2.
- All links and asset paths are relative, so the site works under `/evolve-design-preview/`. CSS and JS carry a cache-busting query (`?v=` plus `VERSION` in `build.mjs`), and `.nojekyll` makes GitHub Pages serve the files untouched.
- `data/redirects.csv` maps every old WordPress URL to its new path, ready for redirects at launch. The second "Smart Alert" entry's old URL (`/portfolio/smart-alert-remote-control-alerting-system/`) maps to `work/smart-control-remote/`.

To rebuild after editing content or templates (Node 18 or newer):

```bash
node build.mjs
```

To change copy, edit `data/content.mjs` (projects, services, process) or the page templates in `build.mjs`, then rebuild. When `styles.css` or `site.js` change, bump `VERSION` in `build.mjs` so browsers fetch the new files.

### Visibility rule

No content depends on JavaScript or scrolling to be visible. Every element is in its final state in the HTML and CSS. The script only adds a class to a picture that started off screen when it scrolls into view, and that class plays a short CSS animation from a desaturated or slightly enlarged state back to the final one. Nothing is ever set to transparent, clipped or moved off screen, the first screen never animates, and the animation exists only under `prefers-reduced-motion: no-preference`. With JavaScript off, in print, in a background tab or with reduced motion, every page shows everything. The phone menu is the one script-dependent control: the `js` class that collapses it is removed again after three seconds if `site.js` never runs.

## Design direction

The design pass followed the taste-skill process: an inventory of the subject, the page argued as claims, three dealt directions, an idea sentence, then build, gate (inspect and lint) and look-and-fix rounds on screenshots at 375, 768 and 1440 pixels. An independent review then followed, and its findings were fixed and checked in a real browser with the client's own images.

**Direction: the contact sheet** (seed 1115838699). This was chosen over name-as-monument, pinned-poster and dense-tiles. Evolve's real strength is range and output: 43 products, over 700 molded parts, and two eras of work. Every portfolio image is a small render on white, about 498 pixels wide. The contact sheet is the one composition that shows many small images as a deliberate system, instead of stretching them into heroes they cannot carry.

**Idea sentence:** *On this page, Aldo Balatti's production record since 1984 (43 products, each rendered on white and tagged with who made it) becomes the contact sheet: the whole body of work laid out at once in sector runs, with black tags for Evolve since 2005 and grey tags for his earlier work at two design firms.*

**The live thing:** the era toggle on the home sheet (All, Evolve, Earlier), which dims one body of work so the other can be read on its own. Each sector's label also names the product under the pointer. On the work index, sector and era filters keep a live count.

- **Sheet:** four columns at 1200 pixels and wider (about 340 pixels per frame at 1440), three below that, two on tablets and phones. Every sector starts its own row under a full-width label. Frames never show an image above its native 498 pixels. The two 3000-pixel renders (Smart Alert, i-Pack) break the grid at full width, with the caption in its own three columns so it never covers the product.
- **Type:** Schibsted Grotesk, one family. Display weight 800, tracking -0.05em. Text is set at 400/600. There are five fluid steps plus one statement step.
- **Palette:** white ground (the renders' own white, so products sit on a matching ground), one grey surface (#f4f4f4), ink #111, soft ink #6b6b6b. The single accent is the logo's red-orange, darkened from #e33000 to #d42d00 so white text on it passes 5:1. It marks the primary button, the last stage of the process ("Deliver") and focus rings. Nothing else is tinted; the products carry the colour.
- **Form:** square corners throughout. There are no rules, shadows or gradients; surfaces are separated by tone.
- **Motion:** on pictures only, like prints coming up in the tray. On the sheet and the work index the products' colour comes up from grey as each row arrives (the products carry the colour, so the colour is what arrives). The two large renders carry the signature move: a slow settle from close in as the colour comes up. Process and discipline images settle without the colour change, since most are drawings. Text never moves. Controls give press and hover feedback.
- **Process images:** Aldo's own concept sketches, marker rendering, exploded assembly, stress analysis, mold filling analysis and a molded part on the mold core (1224 pixels wide, from the About and Services pages) sit under the 4D process on Home, each captioned with the stage it illustrates. Their alt text was written from the images themselves.

**Redraws, with reasons:**

- **Type.** Bricolage Grotesque was dealt first, but its own description ("headings look drawn rather than engineered") contradicts the brief's precise, engineered aesthetic. Schibsted Grotesk replaced it.
- **Palette colours.** The dealt proportions were kept, but the blue accent became the logo's red-orange, because the brand has its own colour.
- **Section: work.** "One strip per project" needs four to six images per project, and Evolve has one each. The home sheet already shows everything, and the work index uses the "quiet ledger with side preview".
- **Section: how-it-works.** The drag row needs six to nine photographed moments. "Lines that step across" fits the real four-phase 4D process, and the craft images under it prove it.
- **Section: testimonial.** "Shallow portraits" needs photos of the speakers, which don't exist. "One long letter" carries Richard Peters' testimonial instead.

**Checks (2026-10-17):** `inspect.mjs` reports 0 FAIL on every page type (home, work index, two project pages, capabilities, about, contact, review) at 1440, 768 and 375. The warnings that remain are deliberate: `no-footage` (the client has no footage), `still-page` "little motion" on the shorter pages (motion is kept to pictures, by design), `card-rows` on project pages (the sheet of related projects), and `grey-body` on the SkyCase page, whose only text is the pending-description note. `lint.mjs` reports 0 FAIL and 0 WARN. A headless-Chromium check measures every text element and image on each page type, without scrolling, with JavaScript off, on, in a background tab, with reduced motion and in print: none is transparent, hidden, clipped, filtered or moved. The home page prints to PDF with all of its sections and pictures. Internal links were crawled with none broken, and no page scrolls sideways at 375. The real images were checked in a browser at 1440 and 375.

## Pre-launch checklist for Evolve

The open questions for Aldo are on the Notes for Aldo page (`review/index.html`), phrased for him. This list is the same ground, for whoever builds the launch.

1. **High-resolution originals.** Every portfolio image on the current site is about 498 pixels wide; nothing larger exists on the server. Larger renders or photos (ideally 2000 pixels or more) would let the work be shown larger, starting with the 16 projects now shown as collages or photographs. A new portrait of Aldo would help too (the current one is 192x280).
2. **Vector logo and favicon.** Only a 187x60 PNG exists, which looks soft on high-density screens. An SVG or EPS of the existing mark (the mark itself stays unchanged) would also give a real favicon; the preview uses a typeset red "e" as a placeholder.
3. **Images are hotlinked.** Every image currently loads from the old WordPress uploads folder (`evolve-designsolutions.com/wp-content/uploads/...`). Before launch, copy them into this site's `assets/` so the new site does not depend on the old one, and export the 3000-pixel renders and the 1224-pixel process images at 800, 1600 and 2400 widths with `srcset`. `build.mjs` keeps the image list in one place.
4. **SkyCase description.** On the live site, the Man-Portable SkyCase System page shows the Amisco Freestyle stools text by mistake, so the preview shows its title and image with a "description to come" note. The April 17, 2012 News item (a man-portable energy system battery pack) may describe it; Aldo is asked to confirm.
5. **Entry 27, "Smart Control Remote".** The live portfolio has two entries titled "Smart Alert Remote Control Alerting System". The first is the Smart Alert remote (May 2010 News). The second's image shows a remote printed "smart control" and its text describes a compact wireless remote for hearing instruments, so the preview titles it "Smart Control Remote", with no client or date. If Aldo confirms it is the Unitron smart remote control from the DPN (November 2008) and Design World (March 2009) stories, name Unitron and add both.
6. **Earlier work.** Eleven projects are credited to Aldo at GID (GID Design) or DW, before Evolve. Aldo is asked whether to show them, whether the labels are right, and what DW stands for.
7. **News.** Options: retire it; keep the dated "Recognition and press" list on About (as the preview does); or restart it with current work.
8. **Contact form.** The preview links email and phone directly and has no form. If a form is wanted, it needs a backend (for example Formspree, Netlify Forms or the host's mail handler) and a privacy note.
9. **Domain and hosting.** The preview runs on GitHub Pages. For launch, choose a host for evolve-designsolutions.com, set up HTTPS, apply the redirects in `data/redirects.csv`, set `REVIEW = false`, remove `noindex, nofollow`, and add Open Graph images.
10. **Edits to confirm.** The Notes page lists all 31 project titles that differ from the current site, generated from the data. Sector groupings are editorial; the current site has no categories. "Evolve Italla" is kept in the MITO title, but the current site never explains it. Where a dated News item covered a project, project pages add its facts (launch events, materials).
11. **Small facts to confirm.** Aldo's post-nominals appear in two orders on the current site; the preview uses "D.I.D., IDSA, SPE, SME". The awards list has 14 lines and 15 awards; "about 16" appears elsewhere. Two testimonials carry undated durations ("over the last 24 years", "over 8 years"); they are quoted verbatim. Membership grades (SPE silver, SME senior) are shown as on the current site.
12. **Photographs to identify.** The close-up on About (the inside of a dark grey molded round part) and the concept renders of three portable devices at the top of Capabilities are not tied to a project on the current site; their alt text describes what they show.
