// Evolve Design Solutions, design preview. Small progressive enhancements; every page reads fully without it.
//
// Motion rule: nothing is ever hidden. Every picture is in its final state in the HTML and CSS. When a
// picture that started off screen scrolls into view (IntersectionObserver, no scroll listeners), it gets
// .is-in, which plays a short "develop" in CSS: a greyscale veil over the picture fades out (opacity), and
// the large renders settle (transform). Pictures on the first screen never move. The animation lives in
// CSS under prefers-reduced-motion: no-preference, so reduced motion, print and no-JS all show the final state.
(() => {
  const d = document;
  window.evolveReady = true; // tells the fallback in <head> that this script ran
  // ----- menu (phones): button with aria-expanded and aria-controls; Escape closes and returns focus;
  // a link inside the menu, a click outside it, or focus leaving the nav (Tab past the last link) closes it -----
  const nav = d.querySelector('.site-nav');
  const toggle = nav && nav.querySelector('.nav-toggle');
  if (toggle) {
    const list = d.getElementById(toggle.getAttribute('aria-controls'));
    const set = (open) => { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.textContent = open ? 'Close' : 'Menu'; d.documentElement.classList.toggle('menu-open', open); };
    toggle.addEventListener('click', () => set(!nav.classList.contains('is-open')));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); toggle.focus(); } });
    d.addEventListener('click', (e) => { if (nav.classList.contains('is-open') && !nav.contains(e.target)) set(false); });
    if (list) list.addEventListener('click', (e) => { if (e.target.closest('a') && nav.classList.contains('is-open')) set(false); });
    // relatedTarget is where focus goes next; moving between the toggle and the links stays open
    nav.addEventListener('focusout', (e) => { if (nav.classList.contains('is-open') && e.relatedTarget && !nav.contains(e.relatedTarget)) set(false); });
  }

  // ----- pictures develop as they arrive; never hidden -----
  try {
    const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!calm && 'IntersectionObserver' in window) {
      const armed = new WeakSet(); // seen out of view at least once
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) { armed.add(e.target); continue; }
          if (armed.has(e.target)) e.target.classList.add('is-in');
          io.unobserve(e.target); // once only; a picture in view from the start never animates
        }
      }, { threshold: 0 });
      for (const el of d.querySelectorAll('[data-develop]')) io.observe(el);
    }
  } catch (err) { /* motion is optional */ }
  window.addEventListener('beforeprint', () => { for (const im of d.images) im.loading = 'eager'; });

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
      const first = ledger.querySelector('.ledger-row:not([hidden]) a');
      if (first) preview(first);
      if (frameEl) frameEl.hidden = n === 0; // no stale picture beside an empty result
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
