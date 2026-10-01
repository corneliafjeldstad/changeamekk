/* ================= Åpningsfortelling ================= */
(() => {
  const root = document.documentElement;
  const intro = document.getElementById('intro');
  if (!intro || !root.classList.contains('intro-on')) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.getElementById('intro-stage');
  const symsEl = document.getElementById('intro-syms');
  const bar = document.getElementById('intro-bar');
  const skip = document.getElementById('intro-skip');
  const hero = document.querySelector('.hero');
  const inertEls = document.querySelectorAll('.skip, .site-header, main, .site-footer');
  inertEls.forEach((e) => e.setAttribute('inert', ''));

  const CLAY = '#a64a2f', OLIVE = '#4a5636', INK = '#1d1c1a';

  // {c|ord} = leire, {i|ord} = sort, {o|ord} = oliven. \n = ny linje.
  const scenes = [
    { t: 'Det var en gang en {c|sykkel.}',
      sy: [{ id: 'st-wheel', c: CLAY, x: 82, y: 72, sz: 26, a: 'roll' }] },
    { t: 'Rusten.\nGlemt.\nStående i en kjeller.', sy: [] },
    { t: 'Så kom noen med en {i|skrunøkkel.}',
      sy: [{ id: 'st-wrench', c: INK, x: 17, y: 74, sz: 22, rot: -20, a: 'pop' }] },
    { t: 'Én skrue her.\nEt nytt dekk der.\nEn kjede som tar tak igjen.',
      sy: [{ id: 'st-wheel', c: CLAY, x: 82, y: 24, sz: 26, a: 'spin' }] },
    { t: '{c|Mekk.}\nÅ fikse. Å fikle.\nÅ få det til.', big: true, sy: [] },
    { t: 'Et hjul som snurrer\nsetter andre ting i gang.',
      sy: [{ id: 'st-wheel', c: CLAY, x: 16, y: 26, sz: 22, a: 'spin' },
           { id: 'st-wheel', c: OLIVE, x: 86, y: 74, sz: 15, a: 'spin' }] },
    { t: 'Hver sykkel vi mekker\nblir til {o|penger.}',
      sy: [{ id: 'st-coin', c: INK, x: 82, y: 26, sz: 17, rot: 12, a: 'pop' },
           { id: 'st-coin', c: CLAY, x: 70, y: 76, sz: 12, rot: -14, a: 'pop' },
           { id: 'st-coin', c: OLIVE, x: 16, y: 70, sz: 15, rot: 8, a: 'pop' }] },
    { t: 'Og hver krone blir til\nhjelp for mennesker i {o|Gaza.}',
      sy: [{ id: 'st-leaf', c: OLIVE, x: 84, y: 72, sz: 26, rot: 8, a: 'pop' },
           { id: 'st-heart', c: CLAY, x: 15, y: 26, sz: 15, rot: -10, a: 'pop' }] },
    { t: '{c|Change.}\nForandring. Og vekslepenger.\nVi mener begge deler.',
      sy: [{ id: 'st-coin', c: INK, x: 14, y: 28, sz: 16, rot: -10, a: 'pop' },
           { id: 'st-coin', c: CLAY, x: 86, y: 72, sz: 20, rot: 14, a: 'pop' },
           { id: 'st-coin', c: OLIVE, x: 82, y: 22, sz: 11, rot: 4, a: 'pop' }] },
    { t: 'Skift gir.\nSkift slange.\nSkift noens {c|hverdag.}',
      sy: [{ id: 'st-wheel', c: CLAY, x: 85, y: 74, sz: 24, a: 'spin' },
           { id: 'st-wrench', c: INK, x: 14, y: 70, sz: 18, rot: 30, a: 'pop' }] },
    { t: '{c|Mekk} a {c|Change}', big: true, final: true,
      sub: 'Mekk en sykkel. Mekk en forskjell. For Gaza.',
      sy: [{ id: 'st-wheel', c: CLAY, x: 11, y: 24, sz: 24, a: 'spin' },
           { id: 'st-leaf', c: OLIVE, x: 89, y: 26, sz: 22, rot: 10, a: 'pop' },
           { id: 'st-coin', c: INK, x: 88, y: 78, sz: 13, rot: 12, a: 'pop' },
           { id: 'st-heart', c: CLAY, x: 12, y: 78, sz: 12, rot: -12, a: 'pop' }] },
  ];
  const last = scenes.length - 1;

  function parse(str) {
    return str.split('\n').map((line) => {
      const out = [];
      const re = /\{([a-z])\|([^}]+)\}|(\S+)/g;
      let m;
      while ((m = re.exec(line))) {
        if (m[3]) out.push({ t: m[3] });
        else m[2].split(' ').forEach((w) => out.push({ t: w, k: m[1] }));
      }
      return out;
    });
  }

  let idx = -1, timers = [], allOn = true, ended = false;
  const T = (fn, ms) => { timers.push(setTimeout(fn, ms)); };
  const clear = () => { timers.forEach(clearTimeout); timers = []; };

  function build(n) {
    const sc = scenes[n];
    const wrap = document.createElement('div');
    wrap.className = 'scene' + (sc.big ? ' big' : '');
    const words = [];
    parse(sc.t).forEach((line) => {
      const L = document.createElement('div');
      L.className = 'line';
      line.forEach((w) => {
        const s = document.createElement('span');
        s.className = 'w' + (w.k ? ' cut cut-' + w.k : '');
        s.textContent = w.t;
        const rot = w.k ? Math.random() * 4 - 2 : Math.random() * 1.2 - 0.6;
        s.style.setProperty('--wr', rot.toFixed(1) + 'deg');
        L.appendChild(s);
        words.push(s);
      });
      wrap.appendChild(L);
    });
    if (sc.sub) {
      const p = document.createElement('p');
      p.className = 'sub w';
      p.textContent = sc.sub;
      wrap.appendChild(p);
      words.push(p);
    }
    let btn = null;
    if (sc.final) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn';
      btn.textContent = 'Kom inn →';
      btn.addEventListener('click', (e) => { e.stopPropagation(); finish(); });
      wrap.appendChild(btn);
    }
    symsEl.textContent = '';
    (sc.sy || []).forEach((y) => {
      const d = document.createElement('div');
      d.className = 'isym a-' + y.a;
      d.style.setProperty('--x', y.x);
      d.style.setProperty('--y', y.y);
      d.style.setProperty('--sz', y.sz);
      d.style.setProperty('--c', y.c);
      d.style.setProperty('--rot', (y.rot || 0) + 'deg');
      d.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><use href="#' + y.id + '"/></svg>';
      symsEl.appendChild(d);
    });
    return { wrap, words, btn };
  }

  function show(n) {
    clear();
    idx = n;
    stage.textContent = '';
    const { wrap, words, btn } = build(n);
    stage.appendChild(wrap);
    bar.style.width = (n / last * 100) + '%';
    if (reduce) {
      words.forEach((w) => w.classList.add('on'));
      if (btn) { btn.classList.add('on'); btn.focus({ preventScroll: true }); }
      allOn = true;
      return;
    }
    allOn = false;
    words.forEach((w, k) => T(() => w.classList.add('on'), 260 + k * 190));
    const total = 260 + words.length * 190;
    T(() => {
      allOn = true;
      if (btn) { btn.classList.add('on'); btn.focus({ preventScroll: true }); }
    }, total + 80);
    if (n < last) T(next, total + 1000 + words.length * 40);
  }

  function next() {
    if (idx >= last || ended) return;
    clear();
    const cur = stage.firstChild;
    if (cur) cur.classList.add('out');
    T(() => show(idx + 1), 380);
  }

  function revealAll() {
    clear();
    stage.querySelectorAll('.w, .btn').forEach((e) => e.classList.add('on'));
    allOn = true;
    const b = stage.querySelector('.btn');
    if (b) b.focus({ preventScroll: true });
    if (!reduce && idx < last) T(next, 1100);
  }

  function advance() {
    if (ended) return;
    if (!allOn) { revealAll(); return; }
    if (idx < last) next();
  }

  function finish() {
    if (ended) return;
    ended = true;
    clear();
    bar.style.width = '100%';
    intro.classList.add('done');
    root.classList.add('intro-done');
    inertEls.forEach((e) => e.removeAttribute('inert'));
    window.scrollTo(0, 0);
    setTimeout(() => {
      root.classList.add('intro-play');
      if (hero) hero.classList.add('play');
    }, reduce ? 0 : 450);
    setTimeout(() => {
      root.classList.remove('intro-on', 'intro-done', 'intro-play');
      const h1 = document.querySelector('h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }, reduce ? 50 : 1300);
  }

  skip.addEventListener('click', (e) => { e.stopPropagation(); finish(); });
  intro.addEventListener('click', (e) => {
    if (e.target.closest('button')) return;
    advance();
  });
  document.addEventListener('keydown', (e) => {
    if (ended) return;
    if (e.key === 'Escape') { finish(); return; }
    if ((e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') && !e.target.closest('button')) {
      e.preventDefault();
      advance();
    }
  });

  skip.focus({ preventScroll: true });
  // Først en tom, hvit skjerm – så begynner fortellingen
  T(() => show(0), 800);
})();

(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobilmeny ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Scroll-reveal ---------- */
  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Hjul: snurrer med scroll og klikk ---------- */
  const wheel = document.querySelector('.p-wheel .wheel');
  let angle = 0, vel = 0, lastY = window.scrollY;
  function tick() {
    const y = window.scrollY;
    if (!reduce) angle += (y - lastY) * 0.25;
    lastY = y;
    angle += vel;
    vel *= 0.965;
    if (Math.abs(vel) < 0.02) vel = 0;
    wheel.style.transform = 'rotate(' + angle + 'deg)';
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ---------- Sykkelbjelle (Web Audio) ---------- */
  let ctx;
  function ding(t0) {
    [[2349, 0.30], [3520, 0.16], [4699, 0.08]].forEach(([f, g]) => {
      const o = ctx.createOscillator();
      const a = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      a.gain.setValueAtTime(0.0001, t0);
      a.gain.exponentialRampToValueAtTime(g, t0 + 0.005);
      a.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
      o.connect(a).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 1.3);
    });
  }
  function ring(el) {
    const bell = el.querySelector('.bell');
    bell.classList.remove('ring');
    void bell.offsetWidth;
    bell.classList.add('ring');
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = ctx || new AC();
      if (ctx.state === 'suspended') ctx.resume();
      const t = ctx.currentTime;
      ding(t);
      ding(t + 0.17);
    } catch (_) { /* lyd er valgfritt */ }
  }

  /* ---------- Dra i collage-bitene ---------- */
  const stage = document.getElementById('stage');
  let zTop = 10;
  function act(el) {
    const a = el.dataset.click;
    if (a === 'spin') vel += 22;
    if (a === 'ring') ring(el);
  }
  document.querySelectorAll('[data-drag]').forEach((el) => {
    let sx = 0, sy = 0, ox = 0, oy = 0, moved = 0, dragging = false;
    const num = (n) => parseFloat(el.style.getPropertyValue(n)) || 0;
    el.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragging = true; moved = 0;
      el.setPointerCapture(e.pointerId);
      ox = num('--dx'); oy = num('--dy');
      sx = e.clientX; sy = e.clientY;
      el.style.zIndex = ++zTop;
      el.classList.add('lifting');
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      moved = Math.max(moved, Math.hypot(dx, dy));
      const minX = -el.offsetLeft - el.offsetWidth * 0.5;
      const maxX = stage.clientWidth - el.offsetLeft - el.offsetWidth * 0.5;
      const minY = -el.offsetTop - el.offsetHeight * 0.5;
      const maxY = stage.clientHeight - el.offsetTop - el.offsetHeight * 0.5;
      el.style.setProperty('--dx', Math.min(maxX, Math.max(minX, ox + dx)) + 'px');
      el.style.setProperty('--dy', Math.min(maxY, Math.max(minY, oy + dy)) + 'px');
      if (el.dataset.click === 'spin') vel += (e.movementX || 0) * 0.12;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('lifting');
      if (moved < 5) act(el);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', () => { dragging = false; el.classList.remove('lifting'); });
    if (el.hasAttribute('tabindex')) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(el); }
      });
    }
  });

  /* ---------- Linoleumstrykk ---------- */
  const board = document.getElementById('board');
  const picks = document.querySelectorAll('.stamp-pick button');
  const inks = ['#a64a2f', '#38422a', '#1d1c1a'];
  let current = 'st-wheel', inkIdx = 0;
  const MAX_STAMPS = 80;

  picks.forEach((b) => b.addEventListener('click', () => {
    picks.forEach((x) => x.setAttribute('aria-checked', 'false'));
    b.setAttribute('aria-checked', 'true');
    current = b.dataset.stamp;
  }));

  function stampAt(x, y) {
    const NS = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 100 100');
    s.setAttribute('class', 'stamp');
    s.setAttribute('aria-hidden', 'true');
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.color = inks[inkIdx++ % inks.length];
    s.style.setProperty('--r', (Math.random() * 40 - 20).toFixed(1) + 'deg');
    s.style.setProperty('--o', (0.78 + Math.random() * 0.2).toFixed(2));
    const u = document.createElementNS(NS, 'use');
    u.setAttribute('href', '#' + current);
    s.appendChild(u);
    board.appendChild(s);
    board.classList.add('used');
    const all = board.querySelectorAll('.stamp');
    if (all.length > MAX_STAMPS) all[0].remove();
  }
  board.addEventListener('pointerdown', (e) => {
    const r = board.getBoundingClientRect();
    stampAt(e.clientX - r.left, e.clientY - r.top);
  });
  document.getElementById('stamp-random').addEventListener('click', () => {
    stampAt(60 + Math.random() * (board.clientWidth - 120), 60 + Math.random() * (board.clientHeight - 120));
  });
  document.getElementById('stamp-clear').addEventListener('click', () => {
    board.querySelectorAll('.stamp').forEach((s) => s.remove());
    board.classList.remove('used');
  });

  /* ---------- Guide: klikk på sykkelen eller fanene ---------- */
  const guideStage = document.getElementById('guide-stage');
  const tabs = guideStage.querySelectorAll('.guide-tabs [data-guide]');
  const hots = guideStage.querySelectorAll('.hot');
  const panels = guideStage.querySelectorAll('.guide-panel');
  function selectGuide(id) {
    guideStage.dataset.active = id;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.guide === id)));
    hots.forEach((h) => h.classList.toggle('is-active', h.dataset.guide === id));
    panels.forEach((p) => { p.hidden = p.id !== 'g-' + id; });
  }
  tabs.forEach((t) => t.addEventListener('click', () => selectGuide(t.dataset.guide)));
  hots.forEach((h) => h.addEventListener('click', () => selectGuide(h.dataset.guide)));
  selectGuide('punktering');

  /* ---------- Donasjonsbeløp ---------- */
  const amounts = document.querySelectorAll('.amount');
  const custom = document.getElementById('custom-amt');
  const out = document.getElementById('amt-out');
  amounts.forEach((b) => b.addEventListener('click', () => {
    amounts.forEach((x) => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    custom.value = '';
    out.textContent = b.dataset.amt + ' kr';
  }));
  custom.addEventListener('input', () => {
    const v = parseInt(custom.value, 10);
    if (v > 0) {
      amounts.forEach((x) => x.setAttribute('aria-pressed', 'false'));
      out.textContent = v + ' kr';
    }
  });
})();
