# Evolve Design Solutions: website refresh preview

A static design preview of a refreshed website for **Evolve Design Solutions Inc.**, the Ottawa product design consultancy of Aldo Balatti. It is built for client review only: every page carries `noindex, nofollow`, and nothing here replaces the live site at evolve-designsolutions.com.

All copy comes from the current site (harvested 2026-10-17). It has been tightened and corrected, but no new facts, clients, numbers, awards or testimonials have been added. Stale counts ("over 30 years", "33 years") are replaced with dates (since 1984, founded 2005). The brand mark is unchanged: the header uses the existing logo image, and the footer sets the company name in type.

Preview URL once published: https://the25thhour.github.io/evolve-design-preview/

## Pages

| Path | What it holds |
| --- | --- |
| `index.html` | Home: the headline, then all 43 products laid out as a contact sheet, grouped by sector. Then who Evolve is, the 4D process, the services index, Aldo, one testimonial and contact. |
| `work/index.html` | Index of all 43 projects with client and credit. Filter by sector and by who designed it (Evolve since 2005, or Aldo's earlier work at two firms). On desktop, a preview shows each project at native size. |
| `work/<slug>/index.html` | One shareable page per project: image at native size, description, client, sector, credit, awards and materials where the current site states them, more from the same sector, and previous/next links. |
| `capabilities/index.html` | Eight disciplines (project management, research, industrial, mechanical, product and plastics engineering, prototyping, manufacturing support), the 4D process in full, and how engagements work. |
| `about/index.html` | Aldo Balatti: bio, dated awards list, memberships and service, the practice (welcome, vision, mission) and all 15 testimonials, verbatim. |
| `contact/index.html` | Address, phone and email as real `tel:` and `mailto:` links, the business contact, and a map link. There is no form, because nothing here could deliver it. |

News is left out of the navigation: its last item is from August 2016, so it would make an active firm look dormant (see the checklist).

## How it is built

Plain static HTML and hand-written CSS, with one small script. No framework and no dependencies.

- `build.mjs` generates every page from `data/portfolio.json` and `data/site.json` (the harvested content) plus `data/content.mjs` (the editorial layer: cleaned titles, rewritten descriptions, services, the 4D process). The generated HTML is committed, because GitHub Pages serves the files as they are.
- `styles.css` holds the tokens (colour, type steps, grid) and every layout. `site.js` adds the menu, the scroll reveals, the era toggle on the home sheet, the work-index filters and preview, and the services note. Every page reads fully without the script.
- `assets/fonts/` holds Schibsted Grotesk (SIL Open Font License, `OFL.txt`), self-hosted as one variable woff2.
- All links and asset paths are relative, so the site works under `/evolve-design-preview/`. CSS and JS carry a cache-busting query (`?v=evolve-20261017`), and `.nojekyll` makes GitHub Pages serve the files untouched.
- `data/redirects.csv` maps every old WordPress URL to its new path, ready for redirects at launch.

To rebuild after editing content or templates (Node 18 or newer):

```bash
node build.mjs
```

To change copy, edit `data/content.mjs` (projects, services, process) or the page templates in `build.mjs`, then rebuild. When `styles.css` or `site.js` change, bump `VERSION` in `build.mjs` so browsers fetch the new files.

## Design direction

The design pass followed the taste-skill process: an inventory of the subject, the page argued as claims, three dealt directions, an idea sentence, then build, gate (inspect and lint) and two look-and-fix rounds on screenshots at 375, 768 and 1440 pixels.

**Direction: the contact sheet** (seed 1115838699). This was chosen over name-as-monument, pinned-poster and dense-tiles. Evolve's real strength is range and output: 43 products, over 700 molded parts, and two eras of work. Every portfolio image is a small render on white, about 498 pixels wide. The contact sheet is the one composition that shows many small images at their true size as a deliberate system, instead of stretching them into heroes they cannot carry.

**Idea sentence:** *On this page, Aldo Balatti's production record since 1984 (43 products, each rendered on white and tagged with who made it) becomes the contact sheet: the whole body of work laid out at once in sector runs, at true small size, with black tags for Evolve since 2005 and grey tags for his earlier work at two design firms.*

**The live thing:** the era toggle on the home sheet (All, Evolve, Earlier), which dims one body of work so the other can be read on its own. Each sector's cell also names the product under the pointer. On the work index, sector and era filters keep a live count.

- **Type:** Schibsted Grotesk, one family. Display weight 800, tracking -0.05em. Text is set at 400/600. There are five fluid steps plus one statement step.
- **Palette:** white ground (the renders' own white, so products sit on a matching ground), one grey surface (#f4f4f4), ink #111, soft ink #6b6b6b. The single accent is the logo's red-orange, darkened from #e33000 to #d42d00 so white text on it passes 5:1. It marks the primary button, the last stage of the process ("Deliver") and focus rings. Nothing else is tinted; the products carry the colour.
- **Form:** square corners throughout. There are no rules, shadows or gradients; surfaces are separated by tone. Images are never shown above their native size.
- **Motion:** headlines rise from a mask, the large renders open with a shutter, and the parts of each section enter in sequence. Controls give press and hover feedback. It all switches off under `prefers-reduced-motion`.

**Redraws, with reasons:**

- **Type.** Bricolage Grotesque was dealt first, but its own description ("headings look drawn rather than engineered") contradicts the brief's precise, engineered aesthetic. Schibsted Grotesk replaced it.
- **Palette colours.** The dealt proportions were kept, but the blue accent became the logo's red-orange, because the brand has its own colour.
- **Section: work.** "One strip per project" needs four to six images per project, and Evolve has one each. The home sheet already shows everything, and the work index uses the "quiet ledger with side preview".
- **Section: how-it-works.** The drag row needs six to nine photographed moments. "Lines that step across" fits the real four-phase 4D process.
- **Section: testimonial.** "Shallow portraits" needs photos of the speakers, which don't exist. "One long letter" carries Richard Peters' testimonial instead.

**Checks:** `inspect.mjs` passes with 0 FAIL on all six page types at 1440, 768 and 390. The warnings that remain are deliberate:

- `card-rows`: the contact sheet is an archive of identical frames by design.
- `no-footage`: the client has no footage, and the open collections could not be reached from the build machine.

`lint.mjs` reports 0 FAIL and 0 WARN. All 43 project titles fit two lines at 375, 390, 768 and 1440. Internal links were crawled with none broken, and no page scrolls sideways at 375. Screenshots used placeholder images of the correct sizes, so the real images still need a look in a browser.

## Pre-launch checklist for Evolve

1. **High-resolution originals.** Every portfolio image on the current site is about 498 pixels wide; nothing larger exists on the server. Supplying larger renders or photos (ideally 2000 pixels or more) of the featured projects would let the work be shown larger. A new portrait of Aldo would help too (the current one is 192x280).
2. **Vector logo.** Only a 187x60 PNG exists, which looks soft on high-density screens. Please send an SVG or EPS of the existing mark (the mark itself stays unchanged).
3. **Images are hotlinked.** Every image currently loads from the old WordPress uploads folder (`evolve-designsolutions.com/wp-content/uploads/...`). Before launch, copy them into this site's `assets/` so the new site does not depend on the old one. `build.mjs` keeps the image list in one place.
4. **SkyCase description.** On the live site, the Man-Portable SkyCase System page shows the Amisco Freestyle stools text by mistake. The preview shows its title and image with no description. Please supply a real description.
5. **Duplicate Smart Alert entry.** The live portfolio has two entries titled "Smart Alert Remote Control Alerting System". The preview calls the first "Smart Alert Remote Control" (it matches the May 2010 news item). The second describes a compact wireless handheld remote for hearing instruments, so the preview titles it "Wireless Handheld Remote Control". Please confirm both titles and the client of the second.
6. **News.** It is left out of the navigation because its last post is from August 2016. Options: retire it; keep a short, dated "Recognition and press" list on the About page (Canadian Plastics 2009, Design World 2009, DPN cover 2008); or restart it with current work.
7. **Contact form.** The preview links email and phone directly and has no form. If a form is wanted, it needs a backend (for example Formspree, Netlify Forms or the host's mail handler) and a privacy note.
8. **Domain and hosting.** The preview runs on GitHub Pages. For launch, choose a host for evolve-designsolutions.com, set up HTTPS, apply the redirects in `data/redirects.csv`, remove `noindex, nofollow`, and add real meta descriptions and Open Graph images.
9. **Alt text for photographs.** The service, welcome, vision and mission photographs could not be viewed while building. Service photos use their discipline name as alt text, and the About photos are treated as decorative. Please confirm what each shows, so the alt text can describe it.
10. **Edits to confirm.**
    - Project titles were cleaned. Typos fixed: "sytem", "Emergeency", "Teknion(Vertex", "Technologies(ACM", "Painting tray System", "Big-Book-Clip-Classroom".
    - Some long titles were shortened so they fit two lines on a phone: "Hearing Instrument Packaging", "Quantum Micro 321 Hearing Instrument", "Stubby Tubby Shallow Tubs", "Adjustable Book Ledge". The dropped words stay in each description.
    - "Evolve Italla" is kept in the MITO title, but the current site never explains it.
    - Sector groupings are editorial; the current site has no categories.
    - Where a dated News item covered a project, project pages add its facts (launch events, materials).
11. **Small facts to confirm.**
    - Aldo's post-nominals appear in two orders on the current site; the preview uses "D.I.D., IDSA, SPE, SME".
    - The awards list has 14 lines and 15 awards; "about 16" appears elsewhere.
    - Two testimonials carry undated durations ("over the last 24 years", "over 8 years"). They are quoted verbatim, so please confirm they are still wanted.
    - Membership grades (SPE silver, SME senior) are shown as on the current site.
12. **Favicon.** The preview uses a typeset red "e" as a placeholder favicon. Please replace it with one drawn from the real logo once the vector arrives.
