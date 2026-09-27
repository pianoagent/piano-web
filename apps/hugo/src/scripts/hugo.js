/* Hugo landing: chovani stranky, prevzate 1:1 z inline skriptu hugopos.eu.
   Jazyk urcuje stranka (/ = cs, /en/ = en). Formular jde na /api/lead.php jako na ostatnich webech Piana. */
window.HUGO_LANG = document.documentElement.lang === 'en' ? 'en' : 'cs';

/* Prepinac CZ / EN: vede na druhou jazykovou verzi, zachova ?v= a kotvu */
(function () {
  var t = document.getElementById('langToggle');
  if (!t) return;
  t.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-lang]');
    if (!b || b.dataset.lang === window.HUGO_LANG) return;
    var thanks = /dekujeme/.test(location.pathname) ? 'dekujeme/' : '';
    location.href = (b.dataset.lang === 'en' ? '/en/' : '/') + thanks + location.search + location.hash;
  });
})();

/* MIF++ odkazy otevrou polozku FAQ, ktera ho vysvetluje */
/* Every MIF++ link points at the FAQ entry that explains it. A <details> does not
     open itself on a fragment navigation in every browser, so open it here. */
  (function () {
    function openMif() {
      if (location.hash !== '#mif') return;
      var el = document.getElementById('mif');
      if (!el) return;
      el.open = true;
      /* The final resting position comes from scroll-margin-top on .faq-item, because
         the browser's own fragment scroll runs after this one and wins. */
      requestAnimationFrame(function () { el.scrollIntoView({ block: 'start' }); });
    }
    document.addEventListener('click', function (ev) {
      /* A modified click opens a new tab; leave this page as the reader left it. */
      if (ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
      var link = ev.target.closest && ev.target.closest('a.mif-link');
      if (!link || link.getAttribute('href') !== '#mif') return;
      var el = document.getElementById('mif');
      if (el) el.open = true;
    });
    window.addEventListener('hashchange', openMif);
    document.addEventListener('DOMContentLoaded', openMif);
  })();

// Sticky nav border
  const nav = document.getElementById('nav');
  const mobilebar = document.getElementById('mobilebar');
  const onScroll = () => {
    if (window.scrollY > 8) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    if (mobilebar){
      if (window.scrollY > window.innerHeight * 0.7) mobilebar.classList.add('show');
      else mobilebar.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Announcement bar dismiss (persisted)
  const annbar = document.getElementById('annbar');
  if (annbar){
    try { if (localStorage.getItem('hugo-ann-closed') === '1') annbar.style.display = 'none'; } catch(e){}
    const annClose = annbar.querySelector('.annbar-close');
    if (annClose) annClose.addEventListener('click', () => {
      annbar.style.display = 'none';
      try { localStorage.setItem('hugo-ann-closed', '1'); } catch(e){}
    });
  }

/* Formular "Ozvi se mi" -> /api/lead.php (PHP hosting), po uspechu na dekovaci stranku */
(function () {
  var form = document.getElementById('waitlistForm');
  if (!form) return;
  var MSG = {
    cs: { sending: 'Odesílám…', error: 'Nepovedlo se to odeslat. Zkus to znovu nebo napiš na hugo@piano.cz.' },
    en: { sending: 'Sending…', error: 'Something went wrong. Try again, or write to hugo@piano.cz.' }
  }[window.HUGO_LANG];
  var btn = form.querySelector('button[type=submit]');
  var label = btn ? btn.innerHTML : '';
  var busy = false;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (busy) return;
    busy = true;
    if (btn) { btn.disabled = true; btn.textContent = MSG.sending; }
    var data = new FormData(form);
    data.append('page', location.href);
    fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error('lead');
        location.href = window.HUGO_LANG === 'en' ? '/en/dekujeme/' : '/dekujeme/';
      })
      .catch(function () {
        busy = false;
        if (btn) { btn.disabled = false; btn.innerHTML = label; }
        var err = form.querySelector('.waitlist-error');
        if (!err) {
          err = document.createElement('p');
          err.className = 'waitlist-fineprint waitlist-error';
          err.setAttribute('role', 'alert');
          form.querySelector('.waitlist-fields').after(err);
        }
        err.textContent = MSG.error;
      });
  });
})();

/* Terminal colour carousel: scroll drives the case colour. */
(function () {
  var COLOURS = [
    { img: 'case-red-impulse.jpg', c: '#d93645', cs: 'Rudý impuls', en: 'Red Impulse' },
    { img: 'case-mint-current.jpg', c: '#16b89d', cs: 'Mátový proud', en: 'Mint Current' },
    { img: 'case-sage-calm.jpg', c: '#58ad63', cs: 'Šalvějový klid', en: 'Sage Calm' },
    { img: 'case-sun-spark.jpg', c: '#f2ca28', cs: 'Luční med', en: 'Meadow Honey' },
    { img: 'case-lagoon-breeze.jpg', c: '#22a9cf', cs: 'Laguna', en: 'Lagoon' },
    { img: 'case-electric-blue.jpg', c: '#315f91', cs: 'Hluboký oceán', en: 'Deep Ocean' }
  ];
  var sec = document.getElementById('barvy');
  if (!sec) return;
  var imgs = document.getElementById('tcImgs'), sw = document.getElementById('tcSwatches'),
      nameEl = document.getElementById('tcName'), dot = document.getElementById('tcDot'), nameBox = nameEl.parentNode;
  COLOURS.forEach(function (col, i) {
    var im = document.createElement('img');
    im.src = '/assets/eshop/' + col.img; im.alt = ''; im.loading = 'eager';
    imgs.appendChild(im);
    var b = document.createElement('button');
    b.type = 'button'; b.style.setProperty('--c', col.c);
    b.addEventListener('click', function () { jumpTo(i); });
    sw.appendChild(b);
  });
  var imEls = imgs.querySelectorAll('img'), swEls = sw.querySelectorAll('button'), cur = -1;
  function lang() { return window.HUGO_LANG === 'en' ? 'en' : 'cs'; }
  var pin = sec.querySelector('.tc-pin'), nav = document.querySelector('.nav');
  var reduceMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  // Pin exactly under the sticky nav, whatever its real height is.
  function navHeight() { return nav ? nav.offsetHeight : 72; }
  var grid = sec.querySelector('.tc-grid'), bar = document.querySelector('.mobilebar');
  if (!grid) return;
  function pinned() { return !sec.classList.contains('is-static'); }
  // Height the fixed mobile CTA bar can cover at the bottom (0 where it is not shown).
  function barHeight() { return bar && window.getComputedStyle(bar).display !== 'none' ? bar.offsetHeight : 0; }
  function layout() {
    var h = navHeight();
    sec.classList.remove('is-static');
    pin.style.top = h + 'px';
    pin.style.height = 'calc(100svh - ' + h + 'px)';
    var padTop = parseFloat(window.getComputedStyle(pin).paddingTop) || 0;
    var fits = grid.offsetHeight + padTop <= pin.clientHeight - barHeight();
    if (!fits) {
      sec.classList.add('is-static');
      pin.style.top = '';
      pin.style.height = '';
    }
  }
  function travel() { return sec.offsetHeight - pin.offsetHeight; }
  function jumpTo(i) {
    if (!pinned()) {
      show(i);
      return;
    }
    var top = sec.getBoundingClientRect().top + window.scrollY - navHeight();
    window.scrollTo({
      top: top + travel() * ((i + 0.5) / COLOURS.length),
      behavior: reduceMotion && reduceMotion.matches ? 'auto' : 'smooth'
    });
  }
  function show(i, force) {
    if (i === cur && !force) return;
    cur = i;
    imEls.forEach(function (im, j) {
      im.classList.toggle('is-active', j === i);
    });
    swEls.forEach(function (b, j) {
      b.classList.toggle('is-on', j === i);
      b.setAttribute('aria-label', COLOURS[j][lang()]);
      b.setAttribute('aria-pressed', j === i ? 'true' : 'false');
    });
    nameEl.textContent = COLOURS[i][lang()];
    sec.setAttribute('aria-label', lang() === 'en' ? 'Hugo terminal case colours' : 'Barvy obalu terminálu Hugo');
    dot.style.setProperty('--c', COLOURS[i].c);
  }
  function update() {
    if (!pinned()) {
      if (cur < 0) show(0);
      return;
    }
    var p = (navHeight() - sec.getBoundingClientRect().top) / Math.max(1, travel());
    p = Math.max(0, Math.min(0.9999, p));
    show(Math.floor(p * COLOURS.length));
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(update); }, { passive: true });
  // Re-measure whenever the section's content can change size: viewport resize, late
  // fonts, and anything that rewrites the copy (language switch, audience variant).
  var relayoutQueued = false;
  function relayout() {
    if (relayoutQueued) return;
    relayoutQueued = true;
    requestAnimationFrame(function () { relayoutQueued = false; layout(); update(); });
  }
  window.addEventListener('resize', relayout);
  window.addEventListener('load', relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  if (window.ResizeObserver) new ResizeObserver(relayout).observe(grid);
  layout();
  var prevApply = window.applyHugoLang;
  if (prevApply) window.applyHugoLang = function (l) { prevApply(l); show(cur < 0 ? 0 : cur, true); layout(); update(); };
  update();
})();

/* Lightweight Instagram carousel; every slide links to the original post. */
(function () {
  var carousel = document.querySelector('.instagram-carousel');
  var track = document.querySelector('.instagram-track');
  if (!carousel || !track || track.children.length < 2) return;
  Array.from(track.children).forEach(function (slide) {
    var clone = slide.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;
    track.appendChild(clone);
  });
  var moving = false;
  var direction = 0;
  var timer;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function distance() {
    var slide = track.firstElementChild;
    return slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
  }
  function withoutTransition(transform) {
    track.style.transition = 'none';
    track.style.transform = transform;
    track.offsetHeight;
    track.style.transition = '';
  }
  function next() {
    if (moving) return;
    moving = true;
    direction = 1;
    track.style.transform = 'translate3d(-' + distance() + 'px,0,0)';
  }
  function previous() {
    if (moving) return;
    moving = true;
    direction = -1;
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    withoutTransition('translate3d(-' + distance() + 'px,0,0)');
    requestAnimationFrame(function () { requestAnimationFrame(function () { track.style.transform = 'translate3d(0,0,0)'; }); });
  }
  function start() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(next, 5500);
  }
  track.addEventListener('transitionend', function (event) {
    if (event.propertyName !== 'transform') return;
    if (direction === 1) track.appendChild(track.firstElementChild);
    withoutTransition('translate3d(0,0,0)');
    moving = false;
    direction = 0;
  });
  document.querySelector('.ig-prev').addEventListener('click', function () { previous(); start(); });
  document.querySelector('.ig-next').addEventListener('click', function () { next(); start(); });
  carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', function () { clearInterval(timer); });
  carousel.addEventListener('focusout', function (event) { if (!carousel.contains(event.relatedTarget)) start(); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearInterval(timer); else start(); });
  window.addEventListener('resize', function () { if (!moving) withoutTransition('translate3d(0,0,0)'); });
  start();
})();

/* Video under the hero: load the YouTube player only after a click (no third-party cookies before play). */
(function () {
  var btn = document.querySelector('.video-facade');
  if (!btn) return;
  function en() { return window.HUGO_LANG === 'en'; }
  function label() { if (btn.isConnected) btn.setAttribute('aria-label', en() ? 'Play the Hugo video' : 'Přehrát video o pokladně Hugo'); }
  label();
  var prevApply = window.applyHugoLang;
  if (prevApply) window.applyHugoLang = function (l) { prevApply(l); label(); };
  btn.addEventListener('click', function () {
    var id = btn.dataset.videoId;
    var frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
    frame.title = en() ? 'Hugo video' : 'Video o pokladně Hugo';
    frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    btn.replaceWith(frame);
    frame.focus();
  });
})();
