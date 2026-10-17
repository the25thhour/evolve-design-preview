// Evolve Design Solutions, design preview. Small progressive enhancements; every page reads fully without it.
(() => {
  window.evolveReady = true;
  const d = document;

  // ----- menu (phones) -----
  const nav = d.querySelector('.site-nav');
  const toggle = nav && nav.querySelector('.nav-toggle');
  if (toggle) {
    const set = (open) => { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; };
    toggle.addEventListener('click', () => set(!nav.classList.contains('is-open')));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); toggle.focus(); } });
    d.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) set(false); });
  }

  // ----- reveals: once, as each part enters; content stays visible if this never runs -----
  const items = d.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach((el) => io.observe(el));
  } else items.forEach((el) => el.classList.add('is-in'));

  // ----- home: the contact sheet -----
  const sheet = d.querySelector('[data-sheet]');
  if (sheet) {
    // era toggle: dims the frames of the other era, so either body of work can be read on its own
    const group = d.querySelector('[data-era-toggle]');
    const status = d.querySelector('[data-era-status]');
    const words = { all: 'Showing all projects.', evolve: 'Showing Evolve projects, since 2005. Earlier work is dimmed.', earlier: 'Showing Aldo Balatti’s earlier work. Evolve projects are dimmed.' };
    if (group) group.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-era]'); if (!b) return;
      for (const x of group.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
      if (b.dataset.era === 'all') sheet.removeAttribute('data-show'); else sheet.dataset.show = b.dataset.era;
      if (status) status.textContent = words[b.dataset.era];
    });
    // the run's own cell names the frame under the pointer or the keyboard focus
    const cells = {};
    for (const c of sheet.querySelectorAll('.run-cell')) cells[c.dataset.run] = c;
    const show = (f) => {
      const c = cells[f.dataset.run]; if (!c) return;
      const note = c.querySelector('.run-note');
      note.textContent = `${f.dataset.name}. ${f.dataset.desc}`;
      c.classList.add('is-live');
    };
    const reset = (f) => {
      const c = cells[f.dataset.run]; if (!c) return;
      const note = c.querySelector('.run-note');
      note.textContent = note.dataset.default; c.classList.remove('is-live');
    };
    sheet.addEventListener('pointerover', (e) => { const f = e.target.closest('.frame'); if (f) show(f); });
    sheet.addEventListener('pointerout', (e) => { const f = e.target.closest('.frame'); if (f && !f.contains(e.relatedTarget)) reset(f); });
    sheet.addEventListener('focusin', (e) => { const f = e.target.closest('.frame'); if (f) show(f); });
    sheet.addEventListener('focusout', (e) => { const f = e.target.closest('.frame'); if (f) reset(f); });
  }

  // ----- work index: filters and the side preview -----
  const ledger = d.querySelector('[data-ledger]');
  if (ledger) {
    const filters = ledger.querySelector('[data-filters]');
    filters.hidden = false;
    const rows = [...ledger.querySelectorAll('.ledger-row')];
    const groups = [...ledger.querySelectorAll('.ledger-group')];
    const countEl = ledger.querySelector('[data-count]');
    const sectorSel = ledger.querySelector('[data-sector-select]');
    const eraSel = ledger.querySelector('[data-era-select]');
    const state = { sector: 'all', era: 'all' };
    const keys = new Set(groups.map((g) => g.dataset.group));
    const apply = () => {
      let n = 0;
      for (const r of rows) {
        const on = (state.sector === 'all' || r.dataset.sector === state.sector) && (state.era === 'all' || r.dataset.era === state.era);
        r.hidden = !on; if (on) n++;
      }
      for (const g of groups) g.hidden = !g.querySelector('.ledger-row:not([hidden])');
      for (const b of filters.querySelectorAll('button[data-sector]')) b.setAttribute('aria-pressed', String(b.dataset.sector === state.sector));
      for (const b of filters.querySelectorAll('button[data-era]')) b.setAttribute('aria-pressed', String(b.dataset.era === state.era));
      if (sectorSel) sectorSel.value = state.sector;
      if (eraSel) eraSel.value = state.era;
      countEl.textContent = n === rows.length ? `Showing all ${n} projects` : `Showing ${n} of ${rows.length} projects`;
      const first = ledger.querySelector('.ledger-row:not([hidden]) a');
      if (first) preview(first);
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.sector) state.sector = b.dataset.sector;
      if (b.dataset.era) state.era = b.dataset.era;
      apply();
    });
    if (sectorSel) sectorSel.addEventListener('change', () => { state.sector = sectorSel.value; apply(); });
    if (eraSel) eraSel.addEventListener('change', () => { state.era = eraSel.value; apply(); });

    const frameEl = ledger.querySelector('[data-preview]');
    const pic = frameEl && frameEl.querySelector('img');
    const tag = frameEl && frameEl.querySelector('[data-preview-tag]');
    const preview = (a) => {
      if (!pic || pic.dataset.src === a.dataset.src) return;
      pic.dataset.src = a.dataset.src;
      pic.src = a.dataset.src; pic.width = +a.dataset.w; pic.height = +a.dataset.h;
      tag.textContent = a.dataset.tag;
      frameEl.classList.toggle('frame-evolve', a.dataset.era === 'evolve');
      frameEl.classList.toggle('frame-earlier', a.dataset.era === 'earlier');
    };
    ledger.addEventListener('pointerover', (e) => { const a = e.target.closest('.ledger-row a'); if (a) preview(a); });
    ledger.addEventListener('focusin', (e) => { const a = e.target.closest('.ledger-row a'); if (a) preview(a); });

    // a sector named in the address (from a project page's breadcrumb) opens filtered
    const fromHash = () => { const k = location.hash.slice(1); if (keys.has(k)) { state.sector = k; apply(); } };
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }

  // ----- home: what we do -----
  const svc = d.querySelector('[data-services]');
  if (svc) {
    const note = svc.querySelector('[data-svc-note]');
    const nameEl = note && note.querySelector('.svc-note-name');
    const textEl = note && note.querySelector('.svc-note-text');
    let active = null;
    const on = (g) => {
      if (!note || g === active) return;
      if (active) active.classList.remove('is-active');
      active = g; g.classList.add('is-active');
      nameEl.textContent = g.dataset.name; textEl.textContent = g.dataset.summary;
    };
    svc.addEventListener('pointerover', (e) => { const g = e.target.closest('.svc-group'); if (g) on(g); });
    svc.addEventListener('focusin', (e) => { const g = e.target.closest('.svc-group'); if (g) on(g); });
  }
})();
