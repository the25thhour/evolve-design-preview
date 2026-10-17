#!/usr/bin/env node
// Evolve Design Solutions, design preview. Static site generator, zero dependencies (Node 18+).
//
//   node build.mjs
//
// Reads data/portfolio.json and data/site.json (content harvested from the live site) and the
// editorial layer in data/content.mjs, then writes every page as plain HTML:
//   index.html, work/index.html, work/<slug>/index.html (one per project), capabilities/index.html,
//   about/index.html, contact/index.html, review/index.html (notes for the client), data/redirects.csv
// All links and asset paths are relative, so the site works under any sub-path (GitHub Pages).
// Every page reads fully without JavaScript: motion is added on top, never needed to see content.
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './data/content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const VERSION = 'evolve-20261017e';
const YEAR = new Date().getFullYear();
const REVIEW = true; // the preview bar and the notes page; set false (and delete review/) at launch
const portfolio = Object.values(JSON.parse(readFileSync(join(ROOT, 'data/portfolio.json'), 'utf8')));
const site = JSON.parse(readFileSync(join(ROOT, 'data/site.json'), 'utf8'));

const UP = 'https://www.evolve-designsolutions.com/wp-content/uploads/';
const LOGO = { src: UP + '2017/09/evolve_logo.png', w: 187, h: 60 };
const HEADSHOT = { src: UP + '2016/02/Our_team_aldo_Balatti.jpg', w: 192, h: 280 };
const PHONE = { href: 'tel:+16134829626', label: '+1 613 482 9626' };
const EMAIL = { href: 'mailto:info@evolve-designsolutions.com?subject=Project%20enquiry', label: 'info@evolve-designsolutions.com' };
const ADDRESS = ['6999 Donwel Drive', 'Ottawa, Ontario K4P 1M7', 'Canada'];
const MAPS = 'https://www.google.com/maps/search/?api=1&query=6999%20Donwel%20Drive%2C%20Ottawa%2C%20ON%20K4P%201M7';

// The process and craft images (About and Services pages of the current site). Alt text written from
// the images themselves, viewed in a browser on 2026-10-17; the Services ones share the alt in content.mjs.
const svcImage = (key) => C.services.find((s) => s.key === key).image;
const CRAFT = {
  sketch: { src: UP + '2016/02/Vision_business.jpg', w: 1224, h: 868, alt: 'Pencil sketch sheet of handheld remote concepts in front, side and back views, with notes on soft-touch keys, an LED and the battery bay', cap: 'Define: pencil ideation of handheld concepts' },
  marker: { src: UP + '2016/02/personal_welcome.jpg', w: 1224, h: 868, alt: 'Marker rendering of a blue handheld device with a chrome bezel, handwritten design notes and four colour options', cap: 'Define: a marker rendering with design notes' },
  exploded: { ...svcImage('mechanical-design'), cap: 'Design: a 3D CAD assembly, exploded' },
  fea: { ...svcImage('product-engineering'), cap: 'Deliver: finite element stress analysis' },
  fill: { ...svcImage('plastics-engineering'), cap: 'Deliver: mold filling analysis' },
  tool: { ...svcImage('manufacturing-support'), cap: 'Deliver: a molded part on the mold core' },
  mission: { src: UP + '2016/02/Mission_statement.jpg', w: 1600, h: 1134, alt: 'Inside of a dark grey molded round part, with concentric rings at its base and ribs around its wall' },
  concept: { src: UP + '2017/09/slider2.png', w: 3000, h: 1245, alt: 'Concept renders of three portable electronic devices in white and grey with red accent lines' },
};

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? (Array.isArray(vals[i]) ? vals[i].join('') : vals[i] ?? '') : ''), '');
function img(im, { alt = im.alt ?? '', cls = '', lazy = true, priority = false } = {}) {
  return `<img${cls ? ` class="${cls}"` : ''} src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(alt)}"${lazy && !priority ? ' loading="lazy"' : ''}${priority ? ' fetchpriority="high"' : ''} decoding="async">`;
}
function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const words = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
// Meta descriptions stay under about 155 characters, cut at a sentence end where one is close enough.
const trimDesc = (d, max = 155) => {
  if (d.length <= max) return d;
  const stop = d.lastIndexOf('. ', max - 1);
  return stop >= 80 ? d.slice(0, stop + 1) : d.slice(0, d.lastIndexOf(' ', max - 1)) + '…';
};

// ---------- projects ----------
const projects = portfolio
  .sort((a, b) => a.index_order - b.index_order)
  .map((p) => {
    const o = C.projects[p.slug];
    if (!o) throw new Error('No editorial entry for ' + p.slug);
    const sector = C.sectors.find((s) => s.match === p.sector);
    if (!sector) throw new Error('Unknown sector ' + p.sector);
    const era = p.work_by.startsWith('Evolve') ? 'evolve' : 'earlier';
    const early = era === 'earlier' ? C.earlierCredit[p.credit] : null;
    if (era === 'earlier' && !early) throw new Error('No earlier-credit mapping for ' + p.credit);
    if (!o.alt) throw new Error('No alt text for ' + p.slug);
    return {
      ...o, old: p.slug, oldUrl: p.url, order: p.index_order, sector, era, sourceTitle: p.title,
      firm: early?.firm ?? null,
      credit: o.credit ?? early?.credit ?? p.credit,
      client: o.client ?? null,
      image: { ...p.images[0], alt: o.alt },
      render: C.heroRenders[p.slug] ?? null,
      eraLabel: era === 'evolve' ? 'Evolve Design Solutions' : `Aldo Balatti at ${early.firm}`,
    };
  });
const rank = (p) => { const i = C.leadOrder.indexOf(p.old); if (i < 0) throw new Error('Not in leadOrder: ' + p.old); return i; };
const bySector = C.sectors.map((s) => ({ ...s, list: projects.filter((p) => p.sector.key === s.key).sort((a, b) => rank(a) - rank(b)) }));
const ordered = bySector.flatMap((s) => s.list); // reading order used for prev / next
const count = { all: projects.length, evolve: projects.filter((p) => p.era === 'evolve').length, earlier: projects.filter((p) => p.era === 'earlier').length };
const bySlug = (old) => projects.find((p) => p.old === old);

// ---------- testimonials, awards, press ----------
const testimonials = site.testimonials.map((t) => ({
  name: t.name, post: t.post_nominals, role: t.title, org: t.company,
  quote: t.quote.replace(/^\s*“\s*|\s*”\s*$/g, '').trim(),
}));
const awards = [
  [2011, '2nd place, Javelin/SolidWorks “Cool” Design Contest', 'Yuleys protective footwear', 'yuleys-protective-footwear'],
  [2005, 'National Post Design Exchange (DX), Bronze Award', 'Black & Decker portable paint station', 'workmate-portable-paint-station-black-decker'],
  [2005, 'IDEA Business Week, Silver Award', 'UFO GlowBuoy floating pool light'],
  [2005, 'Good Design Award', 'UFO GlowBuoy floating pool light'],
  [2004, 'National Post Design Exchange (DX), Silver Award', 'UFO GlowBuoy floating pool light'],
  [2004, 'National Post Design Exchange (DX), Bronze Award', 'Black & Decker 360 Bullseye laser level'],
  [2004, 'IDEA Business Week, Bronze Award', 'Black & Decker 360 laser level'],
  [2003, 'National Post Design Exchange (DX), Bronze Award', 'Black & Decker Workmate 375', 'workmate-375-black-decker'],
  [2002, 'Modern Plastics Innovation Design', 'IAP ClearVision shield support system'],
  [2000, 'IDEA Business Week, Gold Award', 'Sportscope Flex-Fit bicycle helmet'],
  [1997, 'I.D. Magazine Annual Design Review, Excellence Award', 'Disposable cutlery set', 'disposable-cutlery-set-industries-sansfacon'],
  [1992, '1st Prize of Excellence, Montreal Kitchen & Bathroom Expo', 'Ultra shower'],
  [1991, 'Two SPI Awards of Excellence, Business Equipment & Innovation', 'Dharma chair', 'office-seating-bouty-dharma-teknionvertex-composites'],
  [1987, 'I.D. Magazine Annual Design Review, Honorable Mention', 'Swivel adjustable putter'],
].map(([year, award, what, old]) => ({ year, award, what, slug: old ? bySlug(old).slug : null }));
// Recognition and press, each from a dated News item on the current site.
const press = [
  [2009, 'Canadian Plastics', 'Evolve was one of three firms featured as experts in “Designing for Success”, an article on product design (May/June issue).'],
  [2009, 'Design World', '“Multi-Jet Modeling Helps Rush New Design to Market”, on Evolve’s smart remote control program for Unitron Hearing (March issue).'],
  [2008, 'DPN (Design Product News)', 'Cover story “Hearing Aid Remote Removes Stigma”, on Evolve’s smart remote control program for Unitron Hearing (November/December issue).'],
  [2008, 'Javelin Technologies', 'Evolve was selected as one of the SolidWorks customer success stories in “Javelin Customer Successes”.'],
  [2006, 'Consumer Electronics Association', 'A product Evolve helped develop was named a 2007 Design and Engineering Award Honoree, CES Innovations.'],
  [2006, 'Javelin Technologies', 'Customer Appreciation Award to Aldo Balatti, as the first buyer and user of SolidWorks 3D CAD software in Canada, in 1995.'],
];

// ---------- shared parts ----------
const NAV = [['work', 'Work'], ['capabilities', 'Capabilities'], ['about', 'About'], ['contact', 'Contact']];
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23ffffff'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-weight='700' font-size='52' fill='%23d42d00'%3Ee%3C/text%3E%3C/svg%3E";

function header(r, current) {
  return html`<a class="skip-link" href="#main">Skip to content</a>
<header class="site-top">
  ${REVIEW ? `<div class="review-bar"><p>Preview for review <span aria-hidden="true">·</span> <a href="${r}review/"${current === 'review' ? ' aria-current="page"' : ''}>Notes for Aldo</a></p></div>` : ''}
  <div class="site-header">
    <a class="brand" href="${r || './'}"${current === 'home' ? ' aria-current="page"' : ''}><img src="${LOGO.src}" width="${LOGO.w}" height="${LOGO.h}" alt="Evolve Design Solutions, home"></a>
    <nav class="site-nav" aria-label="Main">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list">Menu</button>
      <ul class="nav-list" id="nav-list">
        ${NAV.map(([key, label]) => `<li><a href="${r}${key}/"${current === key ? ' aria-current="page"' : ''}>${label}</a></li>`)}
      </ul>
    </nav>
  </div>
</header>`;
}

function footer(r) {
  return html`<footer class="site-footer">
  <div class="tiles">
    <div class="tile tile-statement">
      <p>Evolve Design Solutions Inc. is a product design consultancy with manufacturing and plastics expertise, in Ottawa since 2005.</p>
      <p class="tile-small">Member of SPE, SME and IDSA. Supporter of the Designers Accord.<br>© ${YEAR} Evolve Design Solutions Inc.</p>
    </div>
    <nav class="tile tile-nav" aria-label="Footer">
      <ul>
        <li><a href="${r || './'}">Home</a></li>
        ${NAV.map(([key, label]) => `<li><a href="${r}${key}/">${label}</a></li>`)}
      </ul>
    </nav>
    <div class="tile tile-place">
      <p>${ADDRESS.join('<br>')}</p>
      <p><a class="tap" href="${MAPS}" rel="noopener">Open in Maps</a></p>
    </div>
    <div class="tile tile-cta">
      <p class="tile-cta-title"><a href="${r}contact/">Discuss a project<svg class="cta-arrow" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false"><path d="M8 40 L40 8 M16 8 H40 V32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square"/></svg></a></p>
      <p><a class="tap tile-email" href="${EMAIL.href}">${EMAIL.label}</a><br><a class="tap" href="${PHONE.href}">${PHONE.label}</a></p>
    </div>
  </div>
</footer>`;
}

function page({ depth = 0, current, title, description, body, bodyClass = '' }) {
  const r = '../'.repeat(depth);
  return html`<!doctype html>
<html lang="en-CA">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content="${esc(trimDesc(description))}">
  <title>${esc(title)}</title>
  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <link rel="preload" href="${r}assets/fonts/schibsted-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${r}styles.css?v=${VERSION}">
  <script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.evolveReady)document.documentElement.classList.remove('js')},3000)</script>
  <script src="${r}site.js?v=${VERSION}" defer></script>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(r, current)}
<main id="main">
${body}
</main>
${footer(r)}
</body>
</html>
`;
}

// A frame on the contact sheet: the picture at or below its native size on white, with a tag fused to
// its foot. Black tag: Evolve, since 2005. Grey tag: Aldo Balatti's earlier work at GID Design or DW.
// The link's name is the project, its client and its era, in text, so the era is never colour alone.
function frame(p, r, { i = 0, k = 0, eager = false } = {}) {
  const name = [p.name, p.client, p.eraLabel].filter(Boolean).join('. ') + '.';
  return `<a class="frame frame-${p.era}${k >= 2 ? ' frame-extra' : ''}" href="${r}work/${p.slug}/" data-era="${p.era}" data-run="${p.sector.key}" data-name="${esc(p.name)}" data-desc="${esc((p.client ? p.client + '. ' : '') + p.eraLabel + '.')}" data-develop style="--i:${i}">`
    + `<span class="frame-pic">${img(p.image, { alt: '', lazy: !eager })}</span>`
    + `<span class="tag" aria-hidden="true">${esc(p.short)}</span><span class="visually-hidden">${esc(name)}</span></a>`;
}
// The two large renders that exist interrupt the sheet at full width, with their caption in the
// render's own white ground.
function bigFrame(p, r, { eager = false } = {}) {
  return `<a class="frame frame-big frame-${p.era}" href="${r}work/${p.slug}/" data-era="${p.era}" data-run="${p.sector.key}" data-name="${esc(p.name)}" data-desc="${esc((p.client ? p.client + '. ' : '') + p.eraLabel + '.')}">`
    + `<span class="frame-pic" data-develop>${img(p.render, { lazy: !eager, priority: eager })}</span>`
    + `<span class="big-cap"><span class="big-name">${esc(p.name)}</span><span class="big-desc">${esc(p.description)}</span><span class="big-era tag-${p.era}">${esc(p.client ? p.client + '. ' + p.eraLabel : p.eraLabel)}</span></span></a>`;
}
function runCell(s, r) {
  return `<div class="run-cell" id="run-${s.key}"><h3 class="run-title">${esc(s.label)}</h3>`
    + `<p class="run-note" data-default="${esc(plural(s.list.length, 'project', 'projects'))}">${esc(plural(s.list.length, 'project', 'projects'))}</p>`
    + (s.list.filter((p) => !p.render).length > 2 ? `<a class="run-all" href="${r}work/#${s.key}">All ${s.list.length}<span class="visually-hidden"> ${esc(s.label.toLowerCase())}</span></a>` : '')
    + `</div>`;
}
function sheet(list, r, { from = 0 } = {}) {
  return list.map((p, n) => frame(p, r, { i: n % 4, eager: from + n < 4 })).join('');
}

function contactBand(r) {
  return html`<section class="contact-band section" aria-labelledby="cb-q">
  <p class="cb-sentence">Creating your next product, or revamping a product line? We welcome the conversation.</p>
  <figure class="cb-photo">${img(HEADSHOT, { alt: 'Black and white portrait of Aldo Balatti' })}</figure>
  <div class="cb-links">
    <h2 class="cb-q" id="cb-q">Have an idea for a new project?</h2>
    <p class="cb-list"><a href="${EMAIL.href}">${EMAIL.label}</a><a href="${PHONE.href}">${PHONE.label}</a></p>
    <p class="cb-where">Aldo Balatti, Ottawa, Ontario. Fee-for-service proposals or design services retainers.</p>
  </div>
</section>`;
}

// ---------- home ----------
function home() {
  const r = '';
  let seen = 0;
  const runs = bySector.map((s) => {
    let k = 0;
    const parts = s.list.map((p) => {
      if (p.render) { seen++; return bigFrame(p, r, { eager: seen === 1 }); }
      const f = frame(p, r, { i: k % 4, k, eager: seen < 3 });
      k++; seen++; return f;
    });
    return runCell(s, r) + parts.join('');
  }).join('\n');
  const peters = testimonials.find((t) => t.name === C.homeLetter);
  const sentences = peters.quote.split(/(?<=\.)\s+/);
  const craft = ['sketch', 'marker', 'exploded', 'fea', 'fill', 'tool'];
  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <h1 class="display hero-title" id="hero-title">Concept to production</h1>
  <div class="hero-band">
    <p class="band-lead">Evolve Design Solutions is the product design and engineering consultancy of Aldo Balatti, D.I.D., industrial designer since 1984.</p>
    <p class="band-extra">Industrial and mechanical design, product and plastics engineering, prototyping and manufacturing support, from first research to the production launch.</p>
    <p class="band-extra">Over 700 injection-molded parts engineered. Aldo has worked with Black&nbsp;&amp;&nbsp;Decker, Motorola, Nortel Networks, General Motors and Electrolux.</p>
    <div class="band-action"><a class="button" href="contact/">Discuss a project</a><a class="text-link" href="${PHONE.href}">${PHONE.label}</a></div>
  </div>
</section>

<section class="sheet-section" aria-labelledby="sheet-title">
  <div class="sheet-bar">
    <h2 class="sheet-title" id="sheet-title">All ${count.all} projects, by sector</h2>
    <p class="sheet-key"><span class="key-item"><span class="key key-evolve" aria-hidden="true"></span>Evolve, since 2005</span> <span class="key-item"><span class="key key-earlier" aria-hidden="true"></span>Aldo’s earlier work at GID Design and DW</span></p>
    <div class="era-toggle" role="group" aria-label="Show work by era" data-era-toggle hidden>
      <button type="button" data-era="all" aria-pressed="true">All ${count.all}</button>
      <button type="button" data-era="evolve" aria-pressed="false">Evolve ${count.evolve}</button>
      <button type="button" data-era="earlier" aria-pressed="false">Earlier ${count.earlier}</button>
    </div>
    <p class="visually-hidden" aria-live="polite" data-era-status></p>
  </div>
  <div class="sheet" data-sheet>
${runs}
  </div>
  <p class="sheet-more"><a class="text-link" href="work/">The work index, with clients and filters</a></p>
</section>

<section class="intro section" aria-labelledby="intro-title">
  <h2 class="visually-hidden" id="intro-title">About Evolve</h2>
  <p class="intro-lead">Evolve is a product design consultancy with manufacturing and plastics expertise. We take a product from first research through engineering and tooling to its production launch, so the design intent survives into the finished product.</p>
  <div class="intro-cols">
    <p><strong>Aldo Balatti, D.I.D.</strong> Industrial Design Diploma, Georgian College, 1984. Fifteen years at two design firms, where he led the plastic applications department as Design Engineering Director, then founded Evolve in 2005.</p>
    <p><strong>Plastics first.</strong> Over 700 injection-molded parts engineered. Material and process selection, mold filling, warping and cooling analysis and tooling reviews, with computer-aided engineering that reduces prototyping, tooling and testing costs.</p>
    <p><strong>Many industries.</strong> Electronics, appliances, telecom, consumer, medical, sporting goods and industrial products. Aldo has worked with Black&nbsp;&amp;&nbsp;Decker, Nortel Networks, Motorola, General Motors, Electrolux, Canada Post, MDS&nbsp;Nordion, Hydro-Quebec, C-MAC and CCM.</p>
    <p><strong>How we work.</strong> A proven, phased development process, on a fee-for-service proposal or a design services retainer, drawing on strategic partners and a database of domestic and worldwide tooling and production vendors.</p>
  </div>
</section>

<section class="process section" aria-labelledby="process-title">
  <h2 class="visually-hidden" id="process-title">The 4D process</h2>
  <ol class="stairs">
    ${C.phases.map((ph, n) => `<li class="stair" style="--step:${n}"><p class="stair-line">${esc(ph.line)}</p><p class="stair-text">${esc(ph.summary)}</p></li>`)}
  </ol>
  <div class="craft">
    ${craft.map((key, n) => { const c = CRAFT[key]; return `<figure class="craft-item craft-${key}"><span class="craft-pic" data-develop style="--i:${n < 2 ? n : n - 2}">${img(c)}</span><figcaption>${esc(c.cap)}</figcaption></figure>`; })}
  </div>
  <p class="process-more"><a class="text-link" href="capabilities/#process">The 4D process in full</a></p>
</section>

<section class="services-index section" aria-labelledby="services-title">
  <h2 class="section-head" id="services-title">What we do</h2>
  <ul class="svc-grid">
    ${C.services.map((g) => `<li class="svc-item"><h3 class="svc-name"><a href="capabilities/#${g.key}">${esc(g.name)}</a></h3><p class="svc-sum">${esc(g.summary)}</p></li>`)}
  </ul>
  <p class="svc-more"><a class="text-link" href="capabilities/">All capabilities</a></p>
</section>

<section class="about-cap section" aria-labelledby="aldo-title">
  <h2 class="visually-hidden" id="aldo-title">Aldo Balatti</h2>
  <ul class="cap-facts">
    <li>Ottawa, Ontario</li>
    <li>Industrial designer since 1984</li>
    <li>Evolve founded 2005</li>
  </ul>
  <div class="cap-text">
    <p class="cap-p">${img(HEADSHOT, { alt: 'Portrait of Aldo Balatti', cls: 'cap-portrait' })}<strong>Aldo Balatti</strong> is an award-winning industrial designer and plastic applications specialist. He has carried products from concept to production since 1984, holds utility and design patents, and has lectured on rapid prototyping and rapid tooling at Carleton University.</p>
    <p class="cap-p cap-soft">His designs have received IDEA, Good Design and National Post Design Exchange awards. <a href="about/">More about Aldo</a></p>
  </div>
</section>

<section class="letter section" aria-labelledby="letter-title">
  <h2 class="visually-hidden" id="letter-title">From a client</h2>
  <figure class="letter-fig">
    <blockquote class="letter-body">
      <p class="letter-open">${esc(sentences[0])}</p>
      <p>${esc(sentences.slice(1, 4).join(' '))}</p>
      <p>${esc(sentences.slice(4).join(' '))}</p>
    </blockquote>
    <figcaption class="letter-sign"><span class="letter-name">${esc(peters.name)}</span><span>${esc(peters.role)}</span><span>${esc(peters.org)}</span></figcaption>
  </figure>
  <p class="letter-more"><a class="text-link" href="about/#testimonials">All ${testimonials.length} testimonials</a></p>
</section>

${contactBand(r)}`;
  return page({
    depth: 0, current: 'home',
    title: 'Evolve Design Solutions | Product design and engineering, Ottawa',
    description: 'Ottawa product design and engineering consultancy of Aldo Balatti: industrial design, plastics engineering and prototyping, from concept to production.',
    body, bodyClass: 'page-home',
  });
}

// ---------- work index ----------
function workIndex() {
  const r = '../';
  const first = ordered[0];
  const renders = projects.filter((p) => p.render);
  const body = html`
<section class="page-hero work-hero" aria-labelledby="work-title">
  <h1 class="display page-title" id="work-title">${cap(words(count.all))} products</h1>
  <div class="page-intro">
    <p class="lead">A record of products designed and engineered for electronics, appliances, telecom, consumer, medical, sporting goods and industrial clients.</p>
    <p>${count.evolve} are Evolve projects since 2005, including collaborations and concept work. The other ${count.earlier} are Aldo Balatti’s earlier work at GID Design and DW. Each page carries its exact credit.</p>
  </div>
</section>

<div class="render-band">
  ${renders.map((p) => `<a class="render frame-${p.era}" href="${p.slug}/"><span class="frame-pic" data-develop>${img(p.render)}</span><span class="tag">${esc(p.name)}</span></a>`)}
</div>

<section class="ledger-section" aria-labelledby="ledger-title">
  <h2 class="visually-hidden" id="ledger-title">Project index</h2>
  <div class="ledger-layout" data-ledger>
    <div class="ledger-rail">
      <div class="filters" data-filters hidden>
        <p class="filter-label" id="f-sector">Sector</p>
        <ul class="filter-list" aria-labelledby="f-sector">
          <li><button type="button" data-sector="all" aria-pressed="true">All sectors <span>${count.all}</span></button></li>
          ${bySector.map((s) => `<li><button type="button" data-sector="${s.key}" aria-pressed="false">${esc(s.label)} <span>${s.list.length}</span></button></li>`)}
        </ul>
        <p class="filter-label" id="f-era">Who designed it</p>
        <ul class="filter-list" aria-labelledby="f-era">
          <li><button type="button" data-era="all" aria-pressed="true">Everyone <span>${count.all}</span></button></li>
          <li><button type="button" data-era="evolve" aria-pressed="false">Evolve, since 2005 <span>${count.evolve}</span></button></li>
          <li><button type="button" data-era="earlier" aria-pressed="false">Aldo, at earlier firms <span>${count.earlier}</span></button></li>
        </ul>
        <div class="filter-selects">
          <label>Sector<select data-sector-select><option value="all">All sectors (${count.all})</option>${bySector.map((s) => `<option value="${s.key}">${esc(s.label)} (${s.list.length})</option>`).join('')}</select></label>
          <label>Who designed it<select data-era-select><option value="all">Everyone (${count.all})</option><option value="evolve">Evolve, since 2005 (${count.evolve})</option><option value="earlier">Aldo, at earlier firms (${count.earlier})</option></select></label>
        </div>
        <p class="filter-count" aria-live="polite" data-count>Showing all ${count.all} projects</p>
      </div>
    </div>
    <div class="ledger">
      <p class="ledger-empty" data-empty hidden>No projects match both filters. <button type="button" class="text-button" data-reset>Show all projects</button></p>
      ${bySector.map((s) => html`<div class="ledger-group" id="${s.key}" data-group="${s.key}">
        <h3 class="ledger-head">${esc(s.label)}</h3>
        <ul class="ledger-rows">
          ${s.list.map((p, n) => `<li class="ledger-row" data-sector="${s.key}" data-era="${p.era}"><a href="${p.slug}/" data-src="${esc(p.image.src)}" data-w="${p.image.w}" data-h="${p.image.h}" data-tag="${esc(p.eraLabel)}" data-era="${p.era}"><span class="row-thumb" data-develop>${img(p.image, { alt: '' })}</span><span class="row-name">${esc(p.name)}</span><span class="row-client">${esc(p.client ?? '')}</span><span class="row-era">${p.era === 'evolve' ? 'Evolve' : 'Aldo at ' + esc(p.firm)}</span></a></li>`)}
        </ul>
      </div>`)}
    </div>
    <div class="ledger-preview" aria-hidden="true">
      <figure class="preview-frame frame-${first.era}" data-preview>
        <span class="frame-pic">${img(first.image, { alt: '' })}</span>
        <figcaption class="tag" data-preview-tag>${esc(first.eraLabel)}</figcaption>
      </figure>
    </div>
  </div>
</section>

${contactBand(r)}`;
  return page({
    depth: 1, current: 'work',
    title: 'Work | Evolve Design Solutions',
    description: `An index of ${count.all} products designed and engineered by Evolve Design Solutions and by Aldo Balatti, filterable by sector.`,
    body,
  });
}

// ---------- project page ----------
function projectPage(p) {
  const r = '../../';
  const at = ordered.indexOf(p);
  const prev = ordered[(at - 1 + ordered.length) % ordered.length];
  const next = ordered[(at + 1) % ordered.length];
  const run = bySector.find((s) => s.key === p.sector.key).list.filter((x) => x !== p);
  // one lead project from each of the other sectors, as a cross-section of the portfolio
  const others = bySector.filter((s) => s.key !== p.sector.key).map((s) => s.list[0]);
  const facts = [
    p.client && ['Client', esc(p.client)],
    ['Sector', `<a href="../#${p.sector.key}">${esc(p.sector.label)}</a>`],
    ['Credit', esc(p.credit)],
    p.materials && ['Materials', esc(p.materials)],
    p.launch && [p.launch[0], esc(p.launch[1])],
    ...(p.awards ?? []).map((a) => ['Award', esc(a)]),
  ].filter(Boolean);
  const body = html`
<article class="project" aria-labelledby="project-title">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="../">Work</a> <span aria-hidden="true">/</span> <a href="../#${p.sector.key}">${esc(p.sector.label)}</a></nav>
  <h1 class="project-title" id="project-title">${esc(p.name)}</h1>
  ${p.render ? `<figure class="project-render"><span class="frame-pic">${img(p.render, { lazy: false, priority: true })}</span></figure>` : ''}
  <div class="project-body">
    <figure class="project-frame frame-${p.era}">
      <span class="frame-pic">${img(p.image, { lazy: !!p.render, priority: !p.render })}</span>
      <figcaption class="tag">${esc(p.eraLabel)}</figcaption>
    </figure>
    <div class="project-text">
      ${p.description ? `<p class="lead">${esc(p.description)}</p>` : `<p class="lead pending">Description to come. The current site shows another project’s text here, so it is left out until Evolve supplies the right one.</p>`}
      ${(p.details ?? []).map((d) => `<p>${esc(d)}</p>`)}
      <dl class="facts">
        ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)}
      </dl>
    </div>
  </div>
</article>

${run.length ? `<section class="more-run" aria-labelledby="more-title">
  <h2 class="section-head" id="more-title">More ${esc(p.sector.label.toLowerCase())}</h2>
  <div class="sheet sheet-small">
    ${sheet(run, r)}
  </div>
</section>` : ''}

<section class="more-run" aria-labelledby="other-title">
  <h2 class="section-head" id="other-title">Other sectors</h2>
  <div class="sheet sheet-small">
    ${sheet(others, r)}
  </div>
</section>

<nav class="pager" aria-label="More projects">
  <a class="pager-link" href="../${prev.slug}/" rel="prev"><span class="pager-dir">Previous</span><span class="pager-name">${esc(prev.name)}</span></a>
  <a class="pager-link pager-next" href="../${next.slug}/" rel="next"><span class="pager-dir">Next</span><span class="pager-name">${esc(next.name)}</span></a>
</nav>

${contactBand(r)}`;
  return page({
    depth: 2, current: 'work',
    title: `${p.name} | Evolve Design Solutions`,
    // short descriptions get the client and credit, so no meta description is a fragment
    description: p.description && p.description.length >= 100 ? p.description : [p.description ?? p.name + '.', p.client && `Client: ${p.client}.`, p.credit + '.'].filter(Boolean).join(' '),
    body,
  });
}

// ---------- capabilities ----------
function capabilities() {
  const r = '../';
  const body = html`
<section class="page-hero" aria-labelledby="cap-title">
  <h1 class="display page-title" id="cap-title">Capabilities</h1>
  <div class="page-intro">
    <p class="lead">We believe a great product is an accomplishment, achieved through strategic partnerships with clients and suppliers.</p>
    <p>Each project starts with your vision and the design challenges you face. We bring creative thinking, technical expertise, the ability to combine form with function, and the resources of strategic partners who are as committed to your product as we are.</p>
  </div>
</section>
<figure class="wide-figure">
  <span class="frame-pic">${img(CRAFT.concept, { lazy: false, priority: true })}</span>
</figure>

<section class="disciplines" aria-labelledby="disc-title">
  <h2 class="section-head" id="disc-title">${cap(words(C.services.length))} disciplines, one team</h2>
  ${C.services.map((g) => html`<article class="discipline" id="${g.key}" aria-labelledby="d-${g.key}">
    <div class="disc-head">
      <h3 class="disc-name" id="d-${g.key}">${esc(g.name)}</h3>
      <figure class="disc-pic" data-develop>${img(g.image)}</figure>
    </div>
    <div class="disc-body">${g.body.map((b) => `<p>${esc(b)}</p>`)}</div>
    <ul class="disc-items">${g.items.map((it) => `<li>${esc(it)}</li>`)}</ul>
  </article>`)}
</section>

<section class="phases section" id="process" aria-labelledby="phases-title">
  <div class="phases-head">
    <h2 class="head" id="phases-title">The 4D process</h2>
    <p class="lead">Four stages that take an idea to a successful launch, with less time, less risk and less cost: we discover, define, design and deliver.</p>
  </div>
  <ol class="phase-cols">
    ${C.phases.map((ph) => html`<li class="phase">
      <h3 class="phase-name">${ph.verb}</h3>
      <p class="phase-goal">${esc(ph.goal)}</p>
      <ul class="phase-tasks">${ph.tasks.map((t) => `<li>${esc(t)}</li>`)}</ul>
    </li>`)}
  </ol>
</section>

<section class="terms section" aria-labelledby="terms-title">
  <h2 class="head" id="terms-title">How we work together</h2>
  <div class="terms-text">
    <p class="lead">Our goal is a long-term working relationship. We follow a proven, phased development process and usually work on a fee-for-service proposal or a design services retainer.</p>
    <p>We look for programs that make a difference to your bottom line, and we are open to partnering with companies and individuals to share in the risks, rewards and success of the work.</p>
  </div>
</section>

${contactBand(r)}`;
  return page({
    depth: 1, current: 'capabilities',
    title: 'Capabilities | Evolve Design Solutions',
    description: 'Industrial and mechanical design, product and plastics engineering, prototyping and manufacturing support, run on the 4D process.',
    body,
  });
}

// ---------- about ----------
function about() {
  const r = '../';
  const strips = {
    awards: { src: UP + '2016/02/awards_image.jpg', w: 490, h: 150 },
    members: { src: UP + '2016/02/Aboutus_professional_memberships.jpg', w: 560, h: 90 },
    solidworks: { src: UP + '2016/02/SolidWorks-Dual-Banners-Image.jpg', w: 400, h: 83 },
  };
  const earlier = ordered.filter((p) => p.era === 'earlier');
  const body = html`
<section class="page-hero about-hero" aria-labelledby="about-title">
  <h1 class="display page-title" id="about-title">Aldo Balatti</h1>
  <figure class="about-portrait">${img(HEADSHOT, { alt: 'Black and white portrait of Aldo Balatti', lazy: false, priority: true })}</figure>
  <div class="about-hero-text">
    <p class="lead">D.I.D., IDSA, SPE, SME. Principal and founder of Evolve Design Solutions, Design Engineering Director and plastic applications specialist.</p>
    <p>Aldo is an award-winning senior product designer. Since 1984 he has worked on a wide range of new product programs, mostly from concept through to production.</p>
  </div>
</section>

<section class="bio section" aria-labelledby="bio-title">
  <h2 class="head" id="bio-title">Since 1984</h2>
  <div class="bio-text">
    <p>Aldo received an Industrial Design Diploma and scholarships from Georgian College in Barrie, Ontario, in 1984. Before founding Evolve Design Solutions Inc. in 2005, he spent 15 years as a product development consultant at two major design firms, where he led the plastic applications department and held the title of Design Engineering Director.</p>
    <p>He has worked with Black &amp; Decker, Nortel Networks, Motorola, General Motors, Electrolux, Canada Post, MDS Nordion, Hydro-Quebec, C-MAC and CCM, among many others.</p>
    <p>His experience covers 3D CAD modelling, mold filling analysis and simulation, the development of injection-molded components and the selection of plastic materials. He is an advocate of design for manufacture and assembly (DFMA), concurrent engineering, rapid prototyping and rapid tooling, and holds many utility and design patents.</p>
  </div>
</section>

<section class="earlier-work" aria-labelledby="earlier-title">
  <div class="earlier-head">
    <h2 class="section-head" id="earlier-title">Before Evolve</h2>
    <p>Products Aldo developed at GID Design and DW, credited as on the current site.</p>
  </div>
  <div class="sheet sheet-small">
    ${sheet(earlier, r)}
  </div>
</section>

<section class="awards section" id="awards" aria-labelledby="awards-title">
  <div class="awards-head">
    <h2 class="head" id="awards-title">Awards</h2>
    <p>Aldo’s designs have been recognized with patents and awards, including the Industrial Design Excellence Awards (IDEA) sponsored by Business Week, the Good Design Award, the I.D. Magazine Annual Design Review, the National Post Design Exchange Awards, the Modern Plastics Innovation Design Award and SPI Awards of Excellence.</p>
    <figure class="logo-strip">${img(strips.awards, { alt: 'Logos of the IDSA IDEA awards, Modern Plastics, I.D. Magazine, the Good Design Award, the National Post Design Exchange and SPI' })}</figure>
  </div>
  <table class="awards-table">
    <caption class="visually-hidden">Awards, most recent first</caption>
    <thead class="visually-hidden"><tr><th scope="col">Year</th><th scope="col">Award</th><th scope="col">Design</th></tr></thead>
    <tbody>
      ${awards.map((a) => `<tr><td class="aw-year">${a.year}</td><td class="aw-name">${esc(a.award)}</td><td class="aw-what">${a.slug ? `<a href="../work/${a.slug}/">${esc(a.what)}</a>` : esc(a.what)}</td></tr>`)}
    </tbody>
  </table>
</section>

<section class="press section" id="press" aria-labelledby="press-title">
  <h2 class="head" id="press-title">Recognition and press</h2>
  <ul class="press-list">
    ${press.map(([y, who, what]) => `<li><span class="press-year">${y}</span><span class="press-who">${esc(who)}</span><span class="press-what">${esc(what)}</span></li>`)}
  </ul>
</section>

<section class="service-record section" aria-labelledby="record-title">
  <h2 class="head" id="record-title">Memberships and service</h2>
  <ul class="record-list">
    <li><strong>Society of Plastics Engineers (SPE).</strong> Silver member. Elected an honorary member of the board of directors of the SPE Product Design and Development (PD3) division.</li>
    <li><strong>Society of Manufacturing Engineers (SME).</strong> Senior member. Member of the Injection Molding and Design for Plastics technical groups since 2003; Chair of the Injection Molding Technical Group and member of the Engineering Materials and Applications steering committee, 2005 to 2006. He led the creation of SME’s Plastics Industry Solution Center, and of the Production Ready Mold Matrix, a joint project of William J. Tobin and the Injection Molding Technical Group.</li>
    <li><strong>Industrial Designers Society of America (IDSA).</strong> Professional member.</li>
    <li><strong>Moldflow IMUG.</strong> Appointed to the board of the International Moldflow User Group.</li>
    <li><strong>Teaching and media.</strong> Guest lecturer on rapid prototyping and rapid tooling at Carleton University in Ottawa, guest speaker on the Discovery Channel, and author and presenter of many papers.</li>
    <li><strong>Designers Accord.</strong> Evolve supports the coalition of design firms promoting positive environmental and social impact through their work.</li>
  </ul>
  <div class="badges">
    ${img(strips.members, { alt: 'Logos of SPE, SME, IDSA and the Designers Accord' })}
    ${img(strips.solidworks, { alt: 'SolidWorks Certified Professional and Manufacturing Network Partner badges' })}
  </div>
</section>

<section class="practice section" aria-labelledby="practice-title">
  <figure class="practice-pic" data-develop>${img(CRAFT.mission)}</figure>
  <div class="practice-text">
    <h2 class="head" id="practice-title">The practice</h2>
    <div class="practice-item">
      <h3>Mission</h3>
      <p>To help clients build and keep a competitive advantage through the quick introduction of innovative, attractive and cost-effective products, with less time, less risk and less cost, as consumer, environmental and manufacturing advocates.</p>
    </div>
    <div class="practice-item">
      <h3>Vision and business practices</h3>
      <p>We aim for long-term working relationships, a proven phased development process, and programs that make a difference to your bottom line. We listen, collaborate and create.</p>
    </div>
    <div class="practice-item">
      <h3>A personal welcome</h3>
      <p>Creating a great product is an accomplishment achieved by clients and suppliers working together as strategic business partners. If you are looking for a partner who shares your passion for excellence, we welcome the opportunity to speak with you.</p>
    </div>
  </div>
</section>

<section class="testimonials section" id="testimonials" aria-labelledby="t-title">
  <div class="t-head">
    <h2 class="head" id="t-title">In their words</h2>
    <p>${testimonials.length} testimonials from clients, suppliers and colleagues.</p>
  </div>
  <div class="t-wall">
    ${testimonials.map((t) => `<figure class="t-item"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption><span class="t-name">${esc(t.name)}${t.post ? `, ${esc(t.post)}` : ''}</span><span class="t-role">${esc(t.role)}, ${esc(t.org)}</span></figcaption></figure>`)}
  </div>
</section>

${contactBand(r)}`;
  return page({
    depth: 1, current: 'about',
    title: 'Aldo Balatti | About Evolve Design Solutions',
    description: 'Aldo Balatti, D.I.D., IDSA, SPE, SME: industrial designer since 1984 and founder of Evolve Design Solutions, with awards, press and testimonials.',
    body,
  });
}

// ---------- contact ----------
function contact() {
  const r = '../';
  const selected = bySector.map((s) => s.list.find((p) => p.era === 'evolve')).filter(Boolean);
  const body = html`
<section class="page-hero contact-hero" aria-labelledby="contact-title">
  <h1 class="display page-title" id="contact-title">Let’s talk</h1>
  <div class="page-intro">
    <p class="lead">Creating your next product or revamping a current line? We can help with the issues of product development under tight budgets and timelines.</p>
    <p>We welcome the opportunity to learn about your business and your product development needs, and to suggest how we can help.</p>
  </div>
</section>

<section class="contact-facts" aria-labelledby="reach-title">
  <h2 class="visually-hidden" id="reach-title">How to reach us</h2>
  <ul class="reach">
    <li><span class="reach-label">Write</span><a class="reach-big" href="${EMAIL.href}">info@<wbr>evolve-designsolutions.com</a></li>
    <li><span class="reach-label">Call</span><a class="reach-big" href="${PHONE.href}">${PHONE.label}</a></li>
  </ul>
  <div class="contact-grid">
    <div class="contact-cell">
      <h3 class="cell-title">Visit</h3>
      <p>Evolve Design Solutions Inc.<br>${ADDRESS.join('<br>')}</p>
      <p><a class="text-link" href="${MAPS}" rel="noopener">Open in Maps</a></p>
    </div>
    <div class="contact-cell">
      <h3 class="cell-title">Business contact</h3>
      <p>Aldo Balatti, D.I.D., IDSA, SPE, SME<br>Design Engineering Director<br>Plastic Applications Specialist</p>
    </div>
    <div class="contact-cell">
      <h3 class="cell-title">What helps us reply</h3>
      <p>Your name, your company and a few lines about the product or idea.</p>
    </div>
    <figure class="contact-portrait">${img(HEADSHOT, { alt: 'Black and white portrait of Aldo Balatti' })}</figure>
  </div>
</section>

<section class="contact-work section" aria-labelledby="cw-title">
  <h2 class="section-head" id="cw-title">One Evolve project from each sector</h2>
  <div class="sheet sheet-small">
    ${sheet(selected, r)}
  </div>
</section>`;
  return page({
    depth: 1, current: 'contact',
    title: 'Contact | Evolve Design Solutions',
    description: 'Contact Evolve Design Solutions in Ottawa: 6999 Donwel Drive, +1 613 482 9626, info@evolve-designsolutions.com.',
    body,
  });
}

// ---------- notes for the client (preview only) ----------
function review() {
  const r = '../';
  const renders = C.needsRender.map(bySlug);
  const sc = bySlug('smart-alert-remote-control-alerting-system');
  const sky = bySlug('man-portable-skycase-system');
  const collab = projects.filter((p) => p.era === 'evolve' && /collaboration|Conceptual/i.test(p.credit));
  // Every title that differs from the current site, generated from the data so the list is complete.
  const titleChanges = [...projects].sort((x, y) => x.order - y.order)
    .filter((p) => p.sourceTitle !== p.name)
    .map((p) => [p.sourceTitle, p.name + (p.client && p.sourceTitle.includes('–') ? ` (client line: ${p.client})` : '')]);
  const body = html`
<section class="page-hero review-hero" aria-labelledby="review-title">
  <h1 class="display page-title" id="review-title">Notes for Aldo</h1>
  <div class="page-intro">
    <p class="lead">This is a design preview of a refreshed Evolve website. Everything on it comes from your current site, rewritten for clarity.</p>
    <p>A few things only you can answer or supply. Each one is below, in plain terms. The preview is hidden from search engines, and this page and the bar at the top of every page go away at launch.</p>
  </div>
</section>

<section class="notes section" aria-labelledby="need-title">
  <h2 class="head" id="need-title">What we need from you</h2>
  <ol class="note-list">
    <li><h3>Larger images</h3><p>Every portfolio image on the current site is about 500 pixels wide, the largest size the server holds. Larger renders or photographs (2000 pixels wide or more) would let the work be shown at full size. Most useful first: a single clean render, on white, for each project now shown as a collage or a photograph.</p>
      <div class="sheet sheet-small note-sheet">${sheet(renders, r)}</div></li>
    <li><h3>A vector logo</h3><p>Only a small image of the logo exists (187 by 60 pixels), so it looks soft on sharp screens. An SVG, EPS or PDF of the current mark would fix that, and would give the site a proper browser icon (the preview uses a plain red “e” for now). The mark itself stays exactly as it is.</p></li>
    <li><h3>A recent portrait</h3><p>The current portrait is 192 by 280 pixels. A newer, larger photograph would let it be shown properly on the About and Contact pages.</p></li>
    <li><h3>A description for the SkyCase</h3><p>On the current site, the <a href="../work/${sky.slug}/">Man-Portable SkyCase System</a> page shows the text of the Amisco Freestyle stools by mistake, so the preview shows its picture with no description. A line or two about what it is and what Evolve did would complete it. Is it the man-portable energy system battery pack from your April 2012 news item (for solar and wind power, tested from -10ºC to +50ºC)? If so, we can use that text.</p></li>
  </ol>
</section>

<section class="notes section" aria-labelledby="ask-title">
  <h2 class="head" id="ask-title">Questions about the work</h2>
  <ol class="note-list">
    <li><h3>Is this the Unitron Smart Control remote?</h3><p>The current site lists two projects called “Smart Alert Remote Control Alerting System”. The second one’s picture shows a remote printed “smart control”, and its text describes a compact wireless remote for hearing instruments. The preview calls it <a href="../work/${sc.slug}/">Smart Control Remote</a>, with no client. Is it the Unitron smart remote control featured in DPN (November 2008) and Design World (March 2009)? If so, we will name Unitron and mention both articles.</p></li>
    <li><h3>Your work before Evolve</h3><p>${count.earlier} projects are credited to you at GID Design or DW, before you founded Evolve. The preview keeps them, marked with a grey tag (“Aldo Balatti at GID Design”, “Aldo Balatti at DW”) and listed separately on About. Do you want them shown, and are those labels right? What is DW’s full name? The Workmate 375 credit also names Camalor Mfg.: should that stay?</p></li>
    <li><h3>Collaborations and concept work</h3><p>${collab.length} Evolve projects are credited as collaborations or concept work (${collab.map((p) => esc(p.name)).join(', ')}). They are grouped with Evolve, and each page shows its exact credit. Is that how you want them presented?</p></li>
    <li><h3>The nine sectors</h3><p>The current site has no categories, so the preview groups the work into nine sectors of our own (hearing instruments, power and batteries, and so on). Would you name or group any of them differently?</p></li>
    <li><h3>“Evolve Italla”</h3><p>The MITO office seating title includes “Evolve Italla”, which the current site does not explain. What does it refer to, and should it stay in the title?</p></li>
    <li><h3>Process images</h3><p>The sketches, marker rendering, exploded view, stress plot, mold filling simulation and molded part from your About and Services pages now appear on the home page as examples of the process, each captioned with the 4D stage it illustrates. Are you happy for them to be shown that way, and are the stages right? Two others need a word from you: the close-up of a round grey part on About (what is it?), and the concept renders of three portable devices at the top of Capabilities (which project, and whose work?).</p></li>
    <li><h3>Testimonials</h3><p>All 15 are quoted exactly as on your current site. Two mention durations that have since grown (“over the last 24 years”, “over 8 years”). Keep them as written, or would you like to ask the authors for an update?</p></li>
    <li><h3>Credentials</h3><p>The preview uses “D.I.D., IDSA, SPE, SME” (your current site uses two different orders). Are your SPE silver and SME senior memberships still current?</p></li>
  </ol>
</section>

<section class="notes section" aria-labelledby="decide-title">
  <h2 class="head" id="decide-title">Decisions for the new site</h2>
  <ol class="note-list">
    <li><h3>News</h3><p>The last news post on the current site is from August 2016, so the preview leaves News out of the menu, where it would make Evolve look inactive. The most useful items (the DPN cover story, Design World, Canadian Plastics, the CES honoree) are kept as a dated list on About. Would you rather retire News, keep that list, or restart it with current projects?</p></li>
    <li><h3>A contact form</h3><p>The preview links your email and phone directly and has no form. If you would like a form, it needs a service to deliver the messages (several simple ones exist) and a short privacy note.</p></li>
    <li><h3>Domain, hosting and launch</h3><p>At launch the site moves to evolve-designsolutions.com: the images are copied off the old WordPress site, old page addresses are redirected to the new ones, and the site is opened to search engines. Who should we coordinate with for the domain and hosting?</p></li>
  </ol>
</section>

<section class="notes section" aria-labelledby="edits-title">
  <h2 class="head" id="edits-title">Edits to confirm</h2>
  <div class="edits">
    <p>Copy was tightened and typos fixed, but every claim comes from your current site. Counts that go stale (“over 30 years”) became dates (since 1984, founded 2005). Spelling follows Canadian use (colour, centre), with “mold” as the industry term. These ${titleChanges.length} project titles differ from the current site; where a client name was part of the title, it now sits in the page’s client line instead.</p>
    <table class="edits-table">
      <caption class="visually-hidden">Project title changes</caption>
      <thead><tr><th scope="col">Current site</th><th scope="col">Preview</th></tr></thead>
      <tbody>${titleChanges.map(([a, b]) => `<tr><td>${esc(a)}</td><td>${esc(b)}</td></tr>`).join('')}</tbody>
    </table>
  </div>
</section>`;
  return page({
    depth: 1, current: 'review',
    title: 'Notes for Aldo | Evolve Design Solutions preview',
    description: 'Open questions and requests for Aldo Balatti about the Evolve Design Solutions website preview.',
    body,
  });
}

// ---------- write ----------
rmSync(join(ROOT, 'work'), { recursive: true, force: true });
write('index.html', home());
write('work/index.html', workIndex());
for (const p of projects) write(`work/${p.slug}/index.html`, projectPage(p));
write('capabilities/index.html', capabilities());
write('about/index.html', about());
write('contact/index.html', contact());
if (REVIEW) write('review/index.html', review()); else rmSync(join(ROOT, 'review'), { recursive: true, force: true });
write('data/redirects.csv', 'old_url,new_path\n' + [
  ['https://www.evolve-designsolutions.com/', ''],
  ['https://www.evolve-designsolutions.com/our-portfolio/', 'work/'],
  ['https://www.evolve-designsolutions.com/services/', 'capabilities/'],
  ['https://www.evolve-designsolutions.com/4d-process/', 'capabilities/#process'],
  ['https://www.evolve-designsolutions.com/about-us/', 'about/'],
  ['https://www.evolve-designsolutions.com/contact-us/', 'contact/'],
  ['https://www.evolve-designsolutions.com/news/', 'about/#press'],
  ...projects.map((p) => [p.oldUrl, `work/${p.slug}/`]),
].map((row) => row.join(',')).join('\n') + '\n');
console.log(`Built ${projects.length} project pages + ${REVIEW ? 7 : 6} pages (${count.evolve} Evolve, ${count.earlier} earlier).`);
