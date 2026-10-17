// Evolve Design Solutions, design preview. Small progressive enhancements; every page reads fully without it.
//
// Motion rule: nothing is hidden by default. Only pictures below the first screen are held back, and only
// when the tab is visible, the visitor has not asked for reduced motion, and IntersectionObserver exists.
// Anything still held back is released at once for printing, when the tab is hidden, or on any error.
(() => {
  const d = document;

  // ----- menu (phones) -----
  const nav = d.querySelector('.site-nav');
  const toggle = nav && nav.querySelector('.nav-toggle');
  if (toggle) {
    const set = (open) => { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; d.documentElement.classList.toggle('menu-open', open); };
    toggle.addEventListener('click', () => set(!nav.classList.contains('is-open')));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); toggle.focus(); } });
    d.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) set(false); });
  }

  // ----- pictures arrive as they enter; content is never hidden otherwise -----
  const items = [...d.querySelectorAll('[data-reveal]')];
  const releaseAll = () => { for (const el of items) el.classList.remove('is-pending'); };
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  try {
    if (!calm && 'IntersectionObserver' in window && d.visibilityState === 'visible') {
      // A clipped element has no visible area, so it is watched through its unclipped parent.
      const watched = new Map();
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) if (e.isIntersecting) {
          for (const el of watched.get(e.target) || []) el.classList.remove('is-pending');
          watched.delete(e.target); io.unobserve(e.target);
        }
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
      const fold = innerHeight;
      for (const el of items) {
        if (el.getBoundingClientRect().top < fold) continue; // the first screen never animates
        const target = el.parentElement || el;
        el.classList.add('is-pending');
        if (!watched.has(target)) { watched.set(target, []); io.observe(target); }
        watched.get(target).push(el);
      }
    }
  } catch (err) { releaseAll(); }
  const forPrint = () => { releaseAll(); for (const im of d.images) im.loading = 'eager'; };
  window.addEventListener('beforeprint', forPrint);
  if (window.matchMedia) matchMedia('print').addEventListener?.('change', (e) => { if (e.matches) forPrint(); });
  d.addEventListener('visibilitychange', () => { if (d.visibilityState === 'hidden') releaseAll(); });
  window.addEventListener('error', releaseAll);

  // ----- home: the contact sheet -----
  const sheet = d.querySelector('[data-sheet]');
  if (sheet) {
    // era toggle: dims the frames of the other era, so either body of work can be read on its own
    const group = d.querySelector('[data-era-toggle]');
    const status = d.querySelector('[data-era-status]');
    const words = { all: 'Showing all projects.', evolve: 'Showing Evolve projects, since 2005. Earlier work is dimmed.', earlier: 'Showing Aldo Balatti’s earlier work. Evolve projects are dimmed.' };
    if (group) {
      group.hidden = false;
      group.addEventListener('click', (e) => {
        const b = e.target.closest('button[data-era]'); if (!b) return;
        for (const x of group.querySelectorAll('button')) x.setAttribute('aria-pressed', String(x === b));
        if (b.dataset.era === 'all') sheet.removeAttribute('data-show'); else sheet.dataset.show = b.dataset.era;
        if (status) status.textContent = words[b.dataset.era];
      });
    }
    // the sector label row names the frame under the pointer or the keyboard focus
    const cells = {};
    for (const c of sheet.querySelectorAll('.run-cell')) cells[c.id.replace('run-', '')] = c;
    const show = (f) => { const c = cells[f.dataset.run]; if (!c) return; c.querySelector('.run-note').textContent = `${f.dataset.name}. ${f.dataset.desc}`; c.classList.add('is-live'); };
    const reset = (f) => { const c = cells[f.dataset.run]; if (!c) return; const n = c.querySelector('.run-note'); n.textContent = n.dataset.default; c.classList.remove('is-live'); };
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
    const empty = ledger.querySelector('[data-empty]');
    const sectorSel = ledger.querySelector('[data-sector-select]');
    const eraSel = ledger.querySelector('[data-era-select]');
    const state = { sector: 'all', era: 'all' };
    const keys = new Set(groups.map((g) => g.dataset.group));
    const frameEl = ledger.querySelector('[data-preview]');
    const pic = frameEl && frameEl.querySelector('img');
    const tag = frameEl && frameEl.querySelector('[data-preview-tag]');
    const preview = (a) => {
      if (!pic || pic.getAttribute('src') === a.dataset.src) return;
      pic.src = a.dataset.src; pic.width = +a.dataset.w; pic.height = +a.dataset.h;
      tag.textContent = a.dataset.tag;
      frameEl.classList.toggle('frame-evolve', a.dataset.era === 'evolve');
      frameEl.classList.toggle('frame-earlier', a.dataset.era === 'earlier');
    };
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
      empty.hidden = n > 0;
      for (const r of rows) if (!r.hidden) r.querySelector('[data-reveal]')?.classList.remove('is-pending');
      const first = ledger.querySelector('.ledger-row:not([hidden]) a');
      if (first) preview(first);
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.sector) state.sector = b.dataset.sector;
      if (b.dataset.era) state.era = b.dataset.era;
      apply();
    });
    ledger.querySelector('[data-reset]').addEventListener('click', () => { state.sector = 'all'; state.era = 'all'; apply(); });
    if (sectorSel) sectorSel.addEventListener('change', () => { state.sector = sectorSel.value; apply(); });
    if (eraSel) eraSel.addEventListener('change', () => { state.era = eraSel.value; apply(); });
    ledger.addEventListener('pointerover', (e) => { const a = e.target.closest('.ledger-row a'); if (a) preview(a); });
    ledger.addEventListener('focusin', (e) => { const a = e.target.closest('.ledger-row a'); if (a) preview(a); });
    // a sector named in the address (from a breadcrumb or the home sheet) opens filtered
    const fromHash = () => { const k = location.hash.slice(1); if (keys.has(k)) { state.sector = k; apply(); } };
    window.addEventListener('hashchange', fromHash);
    fromHash();
  }
})();
