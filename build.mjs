#!/usr/bin/env node
// Evolve Design Solutions, design preview. Static site generator, zero dependencies (Node 18+).
//
//   node build.mjs
//
// Reads data/portfolio.json and data/site.json (content harvested from the live site) and the
// editorial layer in data/content.mjs, then writes every page as plain HTML:
//   index.html, work/index.html, work/<slug>/index.html (one per project),
//   capabilities/index.html, about/index.html, contact/index.html, data/redirects.csv
// All links and asset paths are relative, so the site works under any sub-path (GitHub Pages).
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './data/content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const VERSION = 'evolve-20261017';
const portfolio = Object.values(JSON.parse(readFileSync(join(ROOT, 'data/portfolio.json'), 'utf8')));
const site = JSON.parse(readFileSync(join(ROOT, 'data/site.json'), 'utf8'));

const UP = 'https://www.evolve-designsolutions.com/wp-content/uploads/';
const LOGO = { src: UP + '2017/09/evolve_logo.png', w: 187, h: 60 };
const HEADSHOT = { src: UP + '2016/02/Our_team_aldo_Balatti.jpg', w: 192, h: 280 };
const PHONE = { href: 'tel:+16134829626', label: '+1 613 482 9626' };
const EMAIL = { href: 'mailto:info@evolve-designsolutions.com?subject=Project%20enquiry', label: 'info@evolve-designsolutions.com' };
const ADDRESS = ['6999 Donwel Drive', 'Ottawa, Ontario K4P 1M7', 'Canada'];
const MAPS = 'https://www.google.com/maps/search/?api=1&query=6999%20Donwel%20Drive%2C%20Ottawa%2C%20ON%20K4P%201M7';

// ---------- helpers ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const html = (strings, ...vals) => strings.reduce((out, s, i) => out + s + (i < vals.length ? (Array.isArray(vals[i]) ? vals[i].join('') : vals[i] ?? '') : ''), '');
function img(im, { alt = im.alt ?? '', cls = '', lazy = true, priority = false, sizes = '' } = {}) {
  return `<img${cls ? ` class="${cls}"` : ''} src="${esc(im.src)}" width="${im.w}" height="${im.h}" alt="${esc(alt)}"${lazy && !priority ? ' loading="lazy"' : ''}${priority ? ' fetchpriority="high"' : ''} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;
}
function write(rel, content) {
  const file = join(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content);
}

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
    const image = { ...p.images[0], alt: o.name };
    return {
      ...o, old: p.slug, oldUrl: p.url, order: p.index_order, sector, era,
      firm: early?.firm ?? null,
      credit: o.credit ?? early?.credit ?? p.credit,
      client: o.client ?? null,
      image, render: C.heroRenders[p.slug] ?? null,
      tagLabel: era === 'evolve' ? 'Evolve Design Solutions' : `Aldo Balatti at ${early.firm}`,
    };
  });
const bySector = C.sectors.map((s) => {
  const list = projects.filter((p) => p.sector.key === s.key);
  // the project with a large render leads its run
  list.sort((a, b) => (b.render ? 1 : 0) - (a.render ? 1 : 0) || a.order - b.order);
  return { ...s, list };
});
const ordered = bySector.flatMap((s) => s.list); // reading order used for prev / next
const count = { all: projects.length, evolve: projects.filter((p) => p.era === 'evolve').length, earlier: projects.filter((p) => p.era === 'earlier').length };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// ---------- testimonials, awards ----------
const testimonials = site.testimonials.map((t) => ({
  name: t.name,
  post: t.post_nominals,
  role: t.title,
  org: t.company,
  quote: t.quote.replace(/^\s*“\s*|\s*”\s*$/g, '').trim(),
}));
const slugFor = (old) => projects.find((p) => p.old === old)?.slug;
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
].map(([year, award, what, old]) => ({ year, award, what, slug: old ? slugFor(old) : null }));

// ---------- shared parts ----------
const NAV = [
  ['work', 'Work'],
  ['capabilities', 'Capabilities'],
  ['about', 'About'],
  ['contact', 'Contact'],
];
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23ffffff'/%3E%3Ctext x='32' y='47' text-anchor='middle' font-family='Arial,Helvetica,sans-serif' font-weight='700' font-size='52' fill='%23d42d00'%3Ee%3C/text%3E%3C/svg%3E";

function header(r, current) {
  return html`<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <a class="brand" href="${r || './'}"${current === 'home' ? ' aria-current="page"' : ''}><img src="${LOGO.src}" width="${LOGO.w}" height="${LOGO.h}" alt="Evolve Design Solutions, home"></a>
  <nav class="site-nav" aria-label="Main">
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-list">Menu</button>
    <ul class="nav-list" id="nav-list">
      ${NAV.map(([key, label]) => `<li><a href="${r}${key}/"${current === key ? ' aria-current="page"' : ''}>${label}</a></li>`)}
    </ul>
  </nav>
</header>`;
}

function footer(r) {
  return html`<footer class="site-footer">
  <div class="tiles">
    <div class="tile tile-statement" data-reveal style="--i:0">
      <p>Evolve Design Solutions Inc. is a product design consultancy with manufacturing and plastics expertise, in Ottawa since 2005.</p>
      <p class="tile-small">Member of SPE, SME and IDSA. Supporter of the Designers Accord.<br>© 2026 Evolve Design Solutions Inc.</p>
    </div>
    <nav class="tile tile-nav" aria-label="Footer" data-reveal style="--i:1">
      <ul>
        <li><a href="${r || './'}">Home</a></li>
        ${NAV.map(([key, label]) => `<li><a href="${r}${key}/">${label}</a></li>`)}
      </ul>
    </nav>
    <div class="tile tile-place" data-reveal style="--i:2">
      <p>${ADDRESS.join('<br>')}</p>
      <p><a href="${MAPS}" rel="noopener">Open in Maps</a></p>
    </div>
    <div class="tile tile-mail" data-reveal style="--i:3">
      <p class="tile-label">Write or call</p>
      <p><a class="tile-email" href="${EMAIL.href}">${EMAIL.label}</a><br><a href="${PHONE.href}">${PHONE.label}</a></p>
    </div>
    <div class="tile tile-name" data-reveal style="--i:4"><p class="footer-name">Evolve Design Solutions</p></div>
    <a class="tile tile-cta" href="${r}contact/" data-reveal style="--i:5">
      <span>Discuss a project</span>
      <svg class="cta-arrow" viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" focusable="false"><path d="M8 40 L40 8 M16 8 H40 V32" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="square"/></svg>
    </a>
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
  <meta name="description" content="${esc(description)}">
  <title>${esc(title)}</title>
  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <link rel="preload" href="${r}assets/fonts/schibsted-grotesk-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${r}styles.css?v=${VERSION}">
  <script>document.documentElement.classList.add('js');setTimeout(function(){if(!window.evolveReady)document.documentElement.classList.remove('js')},2500)</script>
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

// A frame on the contact sheet: the picture at or below its native size on white, with a tag fused
// to its foot. Black tag: Evolve, since 2005. Grey tag: Aldo Balatti's earlier work at another firm.
function frame(p, r, { big = false, i = 0, eager = false } = {}) {
  const im = big && p.render ? p.render : p.image;
  const alt = big && p.render ? p.render.alt : p.name;
  const desc = p.client ? `${p.client}. ${p.tagLabel}.` : `${p.tagLabel}.`;
  return `<a class="frame frame-${p.era}${big ? ' frame-big' : ''}" href="${r}work/${p.slug}/" data-era="${p.era}" data-run="${p.sector.key}" data-name="${esc(p.name)}" data-desc="${esc(desc)}" data-reveal style="--i:${i}">`
    + `<span class="frame-pic${big ? ' shutter' : ''}">${img(im, { alt, lazy: !(big || eager), priority: big && eager })}</span>`
    + `<span class="tag" aria-hidden="true">${esc(p.short)}</span></a>`;
}

function runCell(s) {
  return `<div class="run-cell" data-run="${s.key}" data-reveal><h3 class="run-title">${esc(s.label)}</h3>`
    + `<p class="run-note" data-default="${esc(plural(s.list.length, 'project', 'projects'))}">${esc(plural(s.list.length, 'project', 'projects'))}</p></div>`;
}

function contactBand(r, { sentence = 'Creating your next product, or revamping a product line? We welcome the conversation.' } = {}) {
  return html`<section class="contact-band section" aria-labelledby="cb-q">
  <p class="cb-sentence" data-reveal>${sentence}</p>
  <figure class="cb-photo" data-reveal style="--i:1">${img({ src: HEADSHOT.src, w: HEADSHOT.w, h: HEADSHOT.h }, { alt: 'Aldo Balatti, principal and founder of Evolve Design Solutions' })}</figure>
  <div class="cb-links" data-reveal style="--i:2">
    <h2 class="cb-q" id="cb-q">Have an idea for a new project?</h2>
    <p class="cb-list"><a href="${EMAIL.href}">${EMAIL.label}</a><a href="${PHONE.href}">${PHONE.label}</a></p>
    <p class="cb-where">Aldo Balatti, ${ADDRESS[1].replace(' K4P 1M7', '')}. Fee-for-service proposals or design services retainers.</p>
  </div>
</section>`;
}

// ---------- home ----------
function home() {
  const r = '';
  let i = 0;
  let n = 0;
  const cells = bySector.map((s) => runCell(s) + s.list.map((p) => frame(p, r, { big: !!p.render, i: (i++ % 6), eager: n++ < 7 })).join('')).join('\n');
  const groups = C.services;
  const cols = [
    ['industrial-design', 'mechanical-design', 'project-management'],
    ['product-engineering', 'plastics-engineering'],
    ['prototyping', 'manufacturing-support', 'research'],
  ];
  const peters = testimonials.find((t) => t.name === C.homeLetter);
  const sentences = peters.quote.split(/(?<=\.)\s+/);
  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <h1 class="display hero-title" id="hero-title"><span class="mask"><span class="rise">Concept to production</span></span></h1>
  <div class="hero-band">
    <p class="band-lead" data-reveal style="--i:1">Evolve Design Solutions is the product design and engineering consultancy of Aldo Balatti, D.I.D., industrial designer since 1984.</p>
    <p class="band-extra" data-reveal style="--i:2">Industrial and mechanical design, product and plastics engineering, prototyping and manufacturing support, from first research to the production launch.</p>
    <p class="band-extra" data-reveal style="--i:3">Over 700 injection-molded parts engineered. Aldo has worked with Black&nbsp;&amp;&nbsp;Decker, Motorola, Nortel Networks, General Motors and Electrolux.</p>
    <div class="band-action" data-reveal style="--i:4"><a class="button" href="contact/">Discuss a project</a><a class="text-link" href="${PHONE.href}">${PHONE.label}</a></div>
  </div>
</section>

<section class="sheet-section" aria-labelledby="sheet-title">
  <div class="sheet-bar">
    <h2 class="sheet-title" id="sheet-title">All ${count.all} projects, by sector</h2>
    <p class="sheet-key"><span class="key key-evolve" aria-hidden="true"></span>Evolve, since 2005 <span class="key key-earlier" aria-hidden="true"></span>Aldo Balatti’s earlier work at two design firms</p>
    <div class="era-toggle" role="group" aria-label="Show work by era" data-era-toggle>
      <button type="button" data-era="all" aria-pressed="true">All ${count.all}</button>
      <button type="button" data-era="evolve" aria-pressed="false">Evolve ${count.evolve}</button>
      <button type="button" data-era="earlier" aria-pressed="false">Earlier ${count.earlier}</button>
    </div>
    <p class="visually-hidden" aria-live="polite" data-era-status></p>
  </div>
  <div class="sheet" data-sheet>
${cells}
  </div>
  <p class="sheet-more"><a class="text-link" href="work/">The work index, with clients and filters</a></p>
</section>

<section class="intro section" aria-labelledby="intro-title">
  <h2 class="visually-hidden" id="intro-title">About Evolve</h2>
  <p class="intro-lead" data-reveal>Evolve is a product design consultancy with manufacturing and plastics expertise. We take a product from first research through engineering and tooling to its production launch, so the design intent survives into the finished product.</p>
  <div class="intro-cols">
    <p data-reveal style="--i:0"><strong>Aldo Balatti, D.I.D.</strong> Industrial Design Diploma, Georgian College, 1984. Fifteen years at two design firms, where he led the plastic applications department as Design Engineering Director, then founded Evolve in 2005.</p>
    <p data-reveal style="--i:1"><strong>Plastics first.</strong> Over 700 injection-molded parts engineered. Material and process selection, mold filling, warping and cooling analysis, tooling reviews and vendor sourcing at home and offshore, which reduces prototyping, tooling and testing costs.</p>
    <p data-reveal style="--i:2"><strong>Many industries.</strong> Electronics, appliances, telecom, consumer, medical, sporting goods and industrial products. Aldo has worked with Black&nbsp;&amp;&nbsp;Decker, Nortel Networks, Motorola, General Motors, Electrolux, Canada Post, MDS&nbsp;Nordion, Hydro-Quebec, C-MAC and CCM.</p>
    <p data-reveal style="--i:3"><strong>How we work.</strong> A proven, phased development process, on a fee-for-service proposal or a design services retainer. We draw on strategic partners and a database of tooling and production vendors in Canada and worldwide.</p>
  </div>
</section>

<section class="process section" aria-labelledby="process-title">
  <h2 class="visually-hidden" id="process-title">The 4D process</h2>
  <ol class="stairs">
    ${C.phases.map((ph, n) => `<li class="stair" style="--step:${n}" data-reveal><p class="stair-line">${esc(ph.line)}</p><p class="stair-text">${esc(ph.summary)}</p></li>`)}
  </ol>
  <p class="process-more" data-reveal><a class="text-link" href="capabilities/#process">The 4D process in full</a></p>
</section>

<section class="services-index section" aria-labelledby="services-title" data-services>
  <h2 class="section-head" id="services-title">What we do</h2>
  <div class="svc-grid">
    ${cols.map((keys, n) => `<div class="svc-col">${keys.map((k) => { const g = groups.find((x) => x.key === k); return `<div class="svc-group" data-summary="${esc(g.summary)}" data-name="${esc(g.name)}" data-reveal style="--i:${n}"><h3 class="svc-name"><a href="capabilities/#${g.key}">${esc(g.name)}</a></h3><ul class="svc-items">${g.items.map((it) => `<li>${esc(it)}</li>`).join('')}</ul><p class="svc-sum">${esc(g.summary)}</p></div>`; }).join('')}</div>`)}
    <p class="svc-note" aria-live="polite" data-svc-note><span class="svc-note-name">Every discipline, one team.</span> <span class="svc-note-text">From research to the production launch: the disciplines Evolve covers in-house or manages with its strategic partners.</span></p>
  </div>
</section>

<section class="about-cap section" aria-labelledby="aldo-title">
  <h2 class="visually-hidden" id="aldo-title">Aldo Balatti</h2>
  <ul class="cap-facts" data-reveal>
    <li>Ottawa, Ontario</li>
    <li>Industrial designer since 1984</li>
    <li>Evolve founded 2005</li>
  </ul>
  <div class="cap-text">
    <p class="cap-p" data-reveal>${img(HEADSHOT, { alt: 'Portrait of Aldo Balatti', cls: 'cap-portrait' })}<strong>Aldo Balatti</strong> is an award-winning industrial designer and plastic applications specialist. He has carried products from concept to production since 1984, holds utility and design patents, and has lectured on rapid prototyping and rapid tooling at Carleton University.</p>
    <p class="cap-p cap-soft" data-reveal style="--i:1">His work has received IDEA, Good Design and National Post Design Exchange awards. <a href="about/">More about Aldo</a></p>
  </div>
</section>

<section class="letter section" aria-labelledby="letter-title">
  <h2 class="visually-hidden" id="letter-title">From a client</h2>
  <figure class="letter-fig">
    <blockquote class="letter-body">
      <p class="letter-open" data-reveal>${esc(sentences[0])}</p>
      <p data-reveal style="--i:1">${esc(sentences.slice(1, 4).join(' '))}</p>
      <p data-reveal style="--i:2">${esc(sentences.slice(4).join(' '))}</p>
    </blockquote>
    <figcaption class="letter-sign" data-reveal style="--i:3"><span class="letter-name">${esc(peters.name)}</span><span>${esc(peters.role)}</span><span>${esc(peters.org)}</span></figcaption>
  </figure>
  <p class="letter-more" data-reveal style="--i:4"><a class="text-link" href="about/#testimonials">All ${testimonials.length} testimonials</a></p>
</section>

${contactBand(r)}`;
  return page({
    depth: 0, current: 'home',
    title: 'Evolve Design Solutions | Product design and engineering, Ottawa',
    description: 'Evolve Design Solutions is the Ottawa product design and engineering consultancy of Aldo Balatti: industrial design, plastics engineering, prototyping and manufacturing support, from concept to production.',
    body, bodyClass: 'page-home',
  });
}

// ---------- work index ----------
function workIndex() {
  const r = '../';
  const first = ordered[0];
  const body = html`
<section class="page-hero work-hero" aria-labelledby="work-title">
  <h1 class="display page-title" id="work-title"><span class="mask"><span class="rise">Forty-three products</span></span></h1>
  <div class="page-intro">
    <p class="lead" data-reveal style="--i:1">A record of products designed and engineered for electronics, appliances, telecom, consumer, medical, sporting goods and industrial clients.</p>
    <p data-reveal style="--i:2">${count.evolve} were designed at Evolve since 2005. The other ${count.earlier} are Aldo Balatti’s earlier work at two design firms, credited on each page.</p>
  </div>
</section>

<div class="render-band" aria-label="Three large renders from the portfolio">
  ${(() => {
    const sa = projects.find((x) => x.old === 'smart-alert-remote-control-alerting-sytem');
    const ip = projects.find((x) => x.old === 'pack-mobile-rechargeable-battery');
    const concept = { src: UP + '2017/09/slider2.png', w: 3000, h: 1245 };
    return [
      `<a class="frame frame-evolve render" href="${sa.slug}/" data-reveal style="--i:0"><span class="frame-pic">${img(sa.render, { alt: sa.render.alt, lazy: false })}</span><span class="tag">${esc(sa.name)}</span></a>`,
      `<figure class="frame frame-evolve render" data-reveal style="--i:1"><span class="frame-pic">${img(concept, { alt: 'Concept renders of three portable electronic devices in white and grey with red accent lines', lazy: false })}</span><figcaption class="tag">Concept renders, portable electronics</figcaption></figure>`,
      `<a class="frame frame-evolve render" href="${ip.slug}/" data-reveal style="--i:2"><span class="frame-pic">${img(ip.render, { alt: ip.render.alt, lazy: false })}</span><span class="tag">${esc(ip.name)}</span></a>`,
    ].join('\n  ');
  })()}
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
          <li><button type="button" data-era="earlier" aria-pressed="false">Aldo, earlier firms <span>${count.earlier}</span></button></li>
        </ul>
        <div class="filter-selects">
          <label>Sector<select data-sector-select><option value="all">All sectors (${count.all})</option>${bySector.map((s) => `<option value="${s.key}">${esc(s.label)} (${s.list.length})</option>`).join('')}</select></label>
          <label>Who designed it<select data-era-select><option value="all">Everyone (${count.all})</option><option value="evolve">Evolve, since 2005 (${count.evolve})</option><option value="earlier">Aldo, earlier firms (${count.earlier})</option></select></label>
        </div>
        <p class="filter-count" aria-live="polite" data-count>Showing all ${count.all} projects</p>
      </div>
    </div>
    <div class="ledger">
      ${bySector.map((s) => html`<div class="ledger-group" id="${s.key}" data-group="${s.key}">
        <h3 class="ledger-head">${esc(s.label)}</h3>
        <ul class="ledger-rows">
          ${s.list.map((p, n) => `<li class="ledger-row" data-sector="${s.key}" data-era="${p.era}" data-reveal style="--i:${n % 6}"><a href="${p.slug}/" data-src="${esc(p.image.src)}" data-w="${p.image.w}" data-h="${p.image.h}" data-alt="${esc(p.name)}" data-tag="${esc(p.tagLabel)}" data-era="${p.era}"><span class="row-thumb">${img(p.image, { alt: '' })}</span><span class="row-name">${esc(p.name)}</span><span class="row-client">${esc(p.client ?? '')}</span><span class="row-era">${p.era === 'evolve' ? 'Evolve' : esc(p.firm.split(' ')[0])}</span></a></li>`)}
        </ul>
      </div>`)}
    </div>
    <div class="ledger-preview" aria-hidden="true">
      <figure class="preview-frame frame-${first.era}" data-preview>
        <span class="frame-pic">${img(first.image, { alt: '', lazy: false })}</span>
        <figcaption class="tag" data-preview-tag>${esc(first.tagLabel)}</figcaption>
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
  const facts = [
    p.client && ['Client', esc(p.client)],
    ['Sector', `<a href="../#${p.sector.key}">${esc(p.sector.label)}</a>`],
    ['Credit', esc(p.credit)],
    p.materials && ['Materials', esc(p.materials)],
    p.launched && ['Launched', esc(p.launched)],
    ...(p.awards ?? []).map((a) => ['Award', esc(a)]),
  ].filter(Boolean);
  const body = html`
<article class="project" aria-labelledby="project-title">
  <nav class="crumbs" aria-label="Breadcrumb"><a href="../">Work</a> <span aria-hidden="true">/</span> <a href="../#${p.sector.key}">${esc(p.sector.label)}</a></nav>
  <h1 class="project-title" id="project-title"><span class="mask"><span class="rise">${esc(p.name)}</span></span></h1>
  <div class="project-body">
    <figure class="project-frame frame-${p.era}" data-reveal>
      <span class="frame-pic shutter">${img(p.image, { lazy: false, priority: true })}</span>
      <figcaption class="tag">${esc(p.tagLabel)}</figcaption>
    </figure>
    <div class="project-text">
      ${p.description ? `<p class="lead" data-reveal style="--i:1">${esc(p.description)}</p>` : ''}
      ${(p.details ?? []).map((d, n) => `<p data-reveal style="--i:${n + 2}">${esc(d)}</p>`)}
      <dl class="facts" data-reveal style="--i:4">
        ${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)}
      </dl>
    </div>
  </div>
</article>

${run.length ? html`<section class="more-run" aria-labelledby="more-title">
  <h2 class="section-head" id="more-title">More ${esc(p.sector.label.toLowerCase())}</h2>
  <div class="sheet sheet-small">
    ${run.map((x, n) => frame(x, r, { i: n % 6 }))}
  </div>
</section>` : ''}

<nav class="pager" aria-label="More projects">
  <a class="pager-link" href="../${prev.slug}/" rel="prev"><span class="pager-dir">Previous</span><span class="pager-name">${esc(prev.name)}</span></a>
  <a class="pager-link pager-next" href="../${next.slug}/" rel="next"><span class="pager-dir">Next</span><span class="pager-name">${esc(next.name)}</span></a>
</nav>

${contactBand(r)}`;
  const desc = p.description ?? `${p.name}, ${p.credit.toLowerCase()}.`;
  return page({
    depth: 2, current: 'work',
    title: `${p.name} | Evolve Design Solutions`,
    description: desc.length > 158 ? desc.slice(0, desc.lastIndexOf(' ', 155)) + '…' : desc,
    body,
  });
}

// ---------- capabilities ----------
function capabilities() {
  const r = '../';
  const concept = { src: UP + '2017/09/slider2.png', w: 3000, h: 1245 };
  const body = html`
<section class="page-hero" aria-labelledby="cap-title">
  <h1 class="display page-title" id="cap-title"><span class="mask"><span class="rise">Capabilities</span></span></h1>
  <div class="page-intro">
    <p class="lead" data-reveal style="--i:1">We believe a great product is an accomplishment, achieved through strategic partnerships with clients and suppliers.</p>
    <p data-reveal style="--i:2">Each project starts with your vision and the design challenges you face. We bring creative thinking, technical expertise, the ability to combine form with function, and the resources of strategic partners who are as committed to your product as we are.</p>
  </div>
</section>
<figure class="wide-figure" data-reveal>
  <span class="frame-pic shutter">${img(concept, { alt: 'Concept renders of three portable electronic devices in white and grey with red accent lines', lazy: false, priority: true })}</span>
</figure>

<section class="disciplines" aria-labelledby="disc-title">
  <h2 class="section-head" id="disc-title">Eight disciplines, one team</h2>
  ${C.services.map((g, n) => html`<article class="discipline" id="${g.key}" aria-labelledby="d-${g.key}">
    <div class="disc-head" data-reveal>
      <h3 class="disc-name" id="d-${g.key}">${esc(g.name)}</h3>
      <figure class="disc-pic">${img(g.image, { alt: g.image.alt })}</figure>
    </div>
    <div class="disc-body" data-reveal style="--i:1">${g.body.map((b) => `<p>${esc(b)}</p>`)}</div>
    <ul class="disc-items" data-reveal style="--i:2">${g.items.map((it) => `<li>${esc(it)}</li>`)}</ul>
  </article>`)}
</section>

<section class="phases section" id="process" aria-labelledby="phases-title">
  <div class="phases-head">
    <h2 class="head" id="phases-title" data-reveal>The 4D process</h2>
    <p class="lead" data-reveal style="--i:1">Four stages that take an idea to a successful launch, with less time, less risk and less cost: we discover, define, design and deliver.</p>
  </div>
  <ol class="phase-cols">
    ${C.phases.map((ph, n) => html`<li class="phase" data-reveal style="--i:${n}">
      <h3 class="phase-name">${ph.verb}</h3>
      <p class="phase-goal">${esc(ph.goal)}</p>
      <ul class="phase-tasks">${ph.tasks.map((t) => `<li>${esc(t)}</li>`)}</ul>
    </li>`)}
  </ol>
</section>

<section class="terms section" aria-labelledby="terms-title">
  <h2 class="head" id="terms-title" data-reveal>How we work together</h2>
  <div class="terms-text">
    <p class="lead" data-reveal style="--i:1">Our goal is a long-term working relationship. We follow a proven, phased development process and usually work on a fee-for-service proposal or a design services retainer.</p>
    <p data-reveal style="--i:2">We look for programs that make a difference to your bottom line, and we are open to partnering with companies and individuals to share in the risks, rewards and success of the work.</p>
  </div>
</section>

${contactBand(r)}`;
  return page({
    depth: 1, current: 'capabilities',
    title: 'Capabilities | Evolve Design Solutions',
    description: 'Industrial design, mechanical design, product and plastics engineering, prototyping, manufacturing support, project management and research, and the 4D process: discover, define, design, deliver.',
    body,
  });
}

// ---------- about ----------
function about() {
  const r = '../';
  const photos = {
    welcome: { src: UP + '2016/02/personal_welcome.jpg', w: 1224, h: 868 },
    vision: { src: UP + '2016/02/Vision_business.jpg', w: 1224, h: 868 },
    mission: { src: UP + '2016/02/Mission_statement.jpg', w: 1600, h: 1134 },
    awards: { src: UP + '2016/02/awards_image.jpg', w: 490, h: 150 },
    members: { src: UP + '2016/02/Aboutus_professional_memberships.jpg', w: 560, h: 90 },
    solidworks: { src: UP + '2016/02/SolidWorks-Dual-Banners-Image.jpg', w: 400, h: 83 },
  };
  const body = html`
<section class="page-hero about-hero" aria-labelledby="about-title">
  <h1 class="display page-title" id="about-title"><span class="mask"><span class="rise">Aldo Balatti</span></span></h1>
  <div class="about-hero-grid">
    <figure class="about-portrait" data-reveal>${img(HEADSHOT, { alt: 'Black and white portrait of Aldo Balatti', lazy: false, priority: true })}</figure>
    <div class="about-hero-text">
      <p class="lead" data-reveal style="--i:1">D.I.D., IDSA, SPE, SME. Principal and founder of Evolve Design Solutions, Design Engineering Director and plastic applications specialist.</p>
      <p data-reveal style="--i:2">Aldo is an award-winning senior product designer. Since 1984 he has worked on a wide range of new product programs, mostly from concept through to production.</p>
    </div>
  </div>
</section>

<section class="bio section" aria-labelledby="bio-title">
  <h2 class="head" id="bio-title" data-reveal>Since 1984</h2>
  <div class="bio-text">
    <p data-reveal>Aldo received an Industrial Design Diploma and scholarships from Georgian College in Barrie, Ontario, in 1984. Before founding Evolve Design Solutions Inc. in 2005, he spent 15 years as a product development consultant at two major design firms, where he led the plastic applications department and held the title of Design Engineering Director.</p>
    <p data-reveal>He has worked with Black &amp; Decker, Nortel Networks, Motorola, General Motors, Electrolux, Canada Post, MDS Nordion, Hydro-Quebec, C-MAC and CCM, among many others.</p>
    <p data-reveal>His experience covers 3D CAD modelling, mold filling analysis and simulation, the development of injection-molded components and the selection of plastic materials. He is an advocate of design for manufacture and assembly (DFMA), concurrent engineering, rapid prototyping and rapid tooling, and holds many utility and design patents.</p>
    <p data-reveal>In 2006 Javelin Technologies, the SolidWorks reseller, presented him with a Customer Appreciation Award as the first buyer and user of SolidWorks 3D CAD software in Canada, in 1995.</p>
  </div>
</section>

<section class="awards section" id="awards" aria-labelledby="awards-title">
  <div class="awards-head">
    <h2 class="head" id="awards-title" data-reveal>Awards</h2>
    <p data-reveal style="--i:1">Aldo’s designs have been recognized with patents and awards, including the Industrial Design Excellence Awards (IDEA) sponsored by Business Week, the Good Design Award, the I.D. Magazine Annual Design Review, the National Post Design Exchange Awards, the Modern Plastics Innovation Design Award and SPI Awards of Excellence.</p>
    <figure class="logo-strip" data-reveal style="--i:2">${img(photos.awards, { alt: 'Logos of the IDSA IDEA awards, Modern Plastics, I.D. Magazine, the Good Design Award, the National Post Design Exchange and SPI' })}</figure>
  </div>
  <table class="awards-table">
    <caption class="visually-hidden">Awards, most recent first</caption>
    <thead class="visually-hidden"><tr><th scope="col">Year</th><th scope="col">Award</th><th scope="col">Design</th></tr></thead>
    <tbody>
      ${awards.map((a, n) => `<tr data-reveal style="--i:${n % 6}"><td class="aw-year">${a.year}</td><td class="aw-name">${esc(a.award)}</td><td class="aw-what">${a.slug ? `<a href="../work/${a.slug}/">${esc(a.what)}</a>` : esc(a.what)}</td></tr>`)}
    </tbody>
  </table>
</section>

<section class="service-record section" aria-labelledby="record-title">
  <h2 class="head" id="record-title" data-reveal>Memberships and service</h2>
  <ul class="record-list">
    <li data-reveal><strong>Society of Plastics Engineers (SPE).</strong> Silver member. Elected an honorary member of the board of directors of the SPE Product Design and Development (PD3) division.</li>
    <li data-reveal style="--i:1"><strong>Society of Manufacturing Engineers (SME).</strong> Senior member. Member of the Injection Molding and Design for Plastics technical groups since 2003; Chair of the Injection Molding Technical Group and member of the Engineering Materials and Applications steering committee, 2005 to 2006. He led the creation of SME’s Plastics Industry Solution Center, and of the Production Ready Mold Matrix with the Injection Molding Technical Group.</li>
    <li data-reveal style="--i:2"><strong>Industrial Designers Society of America (IDSA).</strong> Professional member.</li>
    <li data-reveal style="--i:3"><strong>Moldflow IMUG.</strong> Appointed to the board of the International Moldflow User Group.</li>
    <li data-reveal style="--i:4"><strong>Teaching and media.</strong> Guest lecturer on rapid prototyping and rapid tooling at Carleton University in Ottawa, guest speaker on the Discovery Channel, and author and presenter of many papers.</li>
    <li data-reveal style="--i:5"><strong>Designers Accord.</strong> Evolve supports the coalition of design firms promoting positive environmental and social impact through their work.</li>
  </ul>
  <div class="badges" data-reveal>
    ${img(photos.members, { alt: 'Logos of SPE, SME, IDSA and the Designers Accord' })}
    ${img(photos.solidworks, { alt: 'SolidWorks Certified Professional and Manufacturing Network Partner badges' })}
  </div>
</section>

<section class="practice section" aria-labelledby="practice-title">
  <h2 class="head" id="practice-title" data-reveal>The practice</h2>
  <div class="practice-grid">
    <article class="practice-item" data-reveal>
      <figure>${img(photos.welcome, { alt: '' })}</figure>
      <h3>A personal welcome</h3>
      <p>Creating a great product is an accomplishment achieved by clients and suppliers working together as strategic business partners. If you are looking for a partner who shares your passion for excellence, we welcome the opportunity to speak with you.</p>
    </article>
    <article class="practice-item" data-reveal style="--i:1">
      <figure>${img(photos.vision, { alt: '' })}</figure>
      <h3>Vision and business practices</h3>
      <p>We aim for long-term working relationships, a proven phased development process, and programs that make a difference to your bottom line. We listen, collaborate and create.</p>
    </article>
    <article class="practice-item" data-reveal style="--i:2">
      <figure>${img(photos.mission, { alt: '' })}</figure>
      <h3>Mission</h3>
      <p>To help clients build and keep a competitive advantage through the quick introduction of innovative, attractive and cost-effective products, with less time, less risk and less cost, as consumer, environmental and manufacturing advocates.</p>
    </article>
  </div>
</section>

<section class="testimonials section" id="testimonials" aria-labelledby="t-title">
  <div class="t-head">
    <h2 class="head" id="t-title" data-reveal>In their words</h2>
    <p data-reveal style="--i:1">${testimonials.length} testimonials from clients, suppliers and colleagues, as published on the current site.</p>
  </div>
  <div class="t-wall">
    ${testimonials.map((t, n) => `<figure class="t-item" data-reveal style="--i:${n % 3}"><blockquote><p>${esc(t.quote)}</p></blockquote><figcaption><span class="t-name">${esc(t.name)}${t.post ? `, ${esc(t.post)}` : ''}</span><span class="t-role">${esc(t.role)}, ${esc(t.org)}</span></figcaption></figure>`)}
  </div>
</section>

${contactBand(r)}`;
  return page({
    depth: 1, current: 'about',
    title: 'Aldo Balatti | About Evolve Design Solutions',
    description: 'Aldo Balatti, D.I.D., IDSA, SPE, SME: industrial designer since 1984, founder of Evolve Design Solutions in 2005, with awards, memberships and testimonials.',
    body,
  });
}

// ---------- contact ----------
function contact() {
  const r = '../';
  const body = html`
<section class="page-hero contact-hero" aria-labelledby="contact-title">
  <h1 class="display page-title" id="contact-title"><span class="mask"><span class="rise">Let’s talk</span></span></h1>
  <div class="page-intro">
    <p class="lead" data-reveal style="--i:1">Creating your next product or revamping a current line? We can help with the issues of product development under tight budgets and timelines.</p>
    <p data-reveal style="--i:2">We welcome the opportunity to learn about your business and your product development needs, and to suggest how we can help.</p>
  </div>
</section>

<section class="contact-facts" aria-labelledby="reach-title">
  <h2 class="visually-hidden" id="reach-title">How to reach us</h2>
  <ul class="reach">
    <li data-reveal><span class="reach-label">Write</span><a class="reach-big" href="${EMAIL.href}">info@<wbr>evolve-designsolutions.com</a></li>
    <li data-reveal style="--i:1"><span class="reach-label">Call</span><a class="reach-big" href="${PHONE.href}">${PHONE.label}</a></li>
  </ul>
  <div class="contact-grid">
    <div class="contact-cell" data-reveal>
      <h3 class="cell-title">Visit</h3>
      <p>Evolve Design Solutions Inc.<br>${ADDRESS.join('<br>')}</p>
      <p><a class="text-link" href="${MAPS}" rel="noopener">Open in Maps</a></p>
    </div>
    <div class="contact-cell" data-reveal style="--i:1">
      <h3 class="cell-title">Business contact</h3>
      <p>Aldo Balatti, D.I.D., IDSA, SPE, SME<br>Design Engineering Director<br>Plastic Applications Specialist</p>
    </div>
    <div class="contact-cell" data-reveal style="--i:2">
      <h3 class="cell-title">What helps us reply</h3>
      <p>Your name, your company and a few lines about the product or idea.</p>
    </div>
    <figure class="contact-portrait" data-reveal style="--i:3">${img(HEADSHOT, { alt: 'Black and white portrait of Aldo Balatti' })}</figure>
  </div>
</section>

<section class="contact-work section" aria-labelledby="cw-title">
  <h2 class="section-head" id="cw-title">Recent work from Evolve</h2>
  <div class="sheet sheet-small">
    ${ordered.filter((p) => p.era === 'evolve').slice(0, 12).map((p, n) => frame(p, r, { i: n % 6 }))}
  </div>
</section>`;
  return page({
    depth: 1, current: 'contact',
    title: 'Contact | Evolve Design Solutions',
    description: 'Contact Evolve Design Solutions in Ottawa: 6999 Donwel Drive, +1 613 482 9626, info@evolve-designsolutions.com.',
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
write('data/redirects.csv', 'old_url,new_path\n' + [
  ['https://www.evolve-designsolutions.com/', ''],
  ['https://www.evolve-designsolutions.com/our-portfolio/', 'work/'],
  ['https://www.evolve-designsolutions.com/services/', 'capabilities/'],
  ['https://www.evolve-designsolutions.com/4d-process/', 'capabilities/#process'],
  ['https://www.evolve-designsolutions.com/about-us/', 'about/'],
  ['https://www.evolve-designsolutions.com/contact-us/', 'contact/'],
  ...projects.map((p) => [p.oldUrl, `work/${p.slug}/`]),
].map((row) => row.join(',')).join('\n') + '\n');
console.log(`Built ${projects.length} project pages + 5 pages (${count.evolve} Evolve, ${count.earlier} earlier).`);
