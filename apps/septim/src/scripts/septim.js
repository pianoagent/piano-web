/*
 * septim.js: chování webu Septim (www.septim.cz).
 *
 * Převzaté HTML a CSS ze Solid Pixels počítá se stavovými třídami, které na živém
 * webu přidával JavaScript CMS. Tady je vlastní, lehká implementace stejného
 * chování: výška hlavičky, scroll stavy, menu, taby, akordeony, slider, kotvy,
 * načtení obrázků a odesílání formulářů na /api/lead.php.
 */
(function () {
  'use strict';

  var doc = document, html = doc.documentElement, body = doc.body;
  var header = doc.getElementById('header');
  var main = doc.getElementById('main');
  var NAV_BREAKPOINT = 1150;
  var UI = window.SEPTIM_UI || { sending: 'Odesílám…', error: 'Odeslání se nepovedlo.', thanks: '/dekujeme' };
  var isMobileNav = function () { return window.matchMedia('(max-width: ' + NAV_BREAKPOINT + 'px)').matches; };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); };

  /* ------------------------------------------------ výška hlavičky */
  function headerHeight() {
    if (!header) return;
    html.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
  }

  /* ------------------------------------------------ odsazení obsahu pod fixní hlavičkou
     (logika Solid Pixels Layout.firstSectionIndent) */
  function firstSectionIndent() {
    if (!header || !main) return;
    var cl = body.classList;
    var first = main.querySelector('.section');
    var fixed = cl.contains('use-header-fixed');
    var transparent = cl.contains('use-header-transparent') || cl.contains('use-header-background-boxed');
    var hasBg = !!(first && first.querySelector('.section-background'));
    var fullrow = !!(first && first.classList.contains('section-has-fullrow'));
    var indent = (!fixed && transparent && !hasBg) || (fixed && !transparent && !hasBg) || (fixed && transparent && !hasBg) || (fixed && !transparent && hasBg);
    if ((transparent && fullrow) || cl.contains('is-header-hidden') || cl.contains('use-menu-toggle')) indent = false;
    if (indent) { header.classList.add('show-header'); main.classList.add('shown-header'); }
  }

  /* ------------------------------------------------ scroll stavy (waypoints) */
  var lastY = window.pageYOffset;
  function waypoints() {
    var y = window.pageYOffset, cl = body.classList;
    var first = main && main.querySelector('.section');
    var hh = header ? header.offsetHeight : 0;
    cl.toggle('is-after-start', y >= window.innerHeight / 3);
    cl.toggle('is-after-menu', y >= hh);
    if (first) {
      cl.toggle('is-before-hero', y >= first.offsetHeight - hh);
      cl.toggle('is-after-hero', y >= first.offsetHeight);
    }
    cl.toggle('is-scrolling-down', y > lastY && y >= window.innerHeight / 3);
    lastY = y;
  }

  /* ------------------------------------------------ obrázky: CSS je skrývá do načtení */
  function markLoaded(img) {
    img.classList.add('is-loaded');
    if (img.parentNode && img.parentNode.classList) img.parentNode.classList.add('is-loaded');
  }
  function images() {
    $$('img').forEach(function (img) {
      if (img.complete && img.naturalWidth) markLoaded(img);
      else {
        img.addEventListener('load', function () { markLoaded(img); }, { once: true });
        img.addEventListener('error', function () { markLoaded(img); }, { once: true });
      }
    });
    body.classList.add('is-hero-loaded');
  }

  /* ------------------------------------------------ hlavní menu */
  function menu() {
    var toggle = doc.getElementById('nav-toggle');
    var open = false;
    function setOpen(state) {
      open = state;
      html.classList.toggle('is-menu-open', open);
      if (toggle) { toggle.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    }
    if (toggle) toggle.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); setOpen(!open); });
    $$('.nav--primary a.nav__link, .nav--secondary a.nav__link').forEach(function (a) {
      a.addEventListener('click', function () { if (open) setOpen(false); });
    });

    /* podmenu na mobilu: rozbalování šipkou nebo klikem na položku bez odkazu */
    var items = $$('#header .nav__item.has-children');
    function collapseState() {
      items.forEach(function (li) {
        if (isMobileNav()) { if (!li.classList.contains('is-opened')) li.classList.add('is-collapsed'); }
        else li.classList.remove('is-collapsed', 'is-opened');
      });
    }
    collapseState();
    var wasMobile = isMobileNav();
    window.addEventListener('resize', function () {
      collapseState();
      var nowMobile = isMobileNav();
      if (wasMobile && !nowMobile && open) setOpen(false);
      wasMobile = nowMobile;
    });
    $$('#header .submenu-trigger').forEach(function (t) {
      t.addEventListener('click', function (e) {
        if (!isMobileNav()) return;
        e.preventDefault(); e.stopPropagation();
        var li = t.closest('.nav__item');
        var opened = li.classList.toggle('is-opened');
        li.classList.toggle('is-collapsed', !opened);
      });
    });
    $$('#header .has-children > span.nav__link').forEach(function (s) {
      s.addEventListener('click', function (e) {
        if (!isMobileNav()) return;
        var t = s.querySelector('.submenu-trigger');
        if (t && e.target !== t) t.click();
      });
    });

    /* aktivní položka podle URL (na živém webu ji doplňoval CMS) */
    var path = location.pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/';
    $$('#header .nav__link[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === path) {
        a.classList.add('active');
        var li = a.closest('.nav__item');
        while (li) {
          li.classList.add('active');
          var own = li.querySelector(':scope > .nav__link');
          if (own) own.classList.add('active');
          li = li.parentNode && li.parentNode.closest ? li.parentNode.closest('.nav__item') : null;
        }
      }
    });
  }

  /* ------------------------------------------------ dropdown (přepínač jazyka) */
  function dropdowns() {
    $$('[data-toggle="dropdown"]').forEach(function (t) {
      t.addEventListener('click', function (e) {
        e.preventDefault();
        var p = t.parentNode, opened = p.classList.toggle('is-opened');
        t.setAttribute('aria-expanded', opened ? 'true' : 'false');
      });
    });
    doc.addEventListener('click', function (e) {
      $$('.is-opened > [data-toggle="dropdown"]').forEach(function (t) {
        if (!t.parentNode.contains(e.target)) { t.parentNode.classList.remove('is-opened'); t.setAttribute('aria-expanded', 'false'); }
      });
    });
  }

  /* ------------------------------------------------ taby (.tab-links + .tab-content, logika z app.js živého webu) */
  function tabs() {
    var def = doc.querySelector('.tab-links a[href="#tab-flex"]');
    if (def) def.closest('.block').classList.add('active');
    $$('.tab-links a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = a.getAttribute('href').split('#')[1];
        $$('.tab-content.active').forEach(function (c) { c.classList.remove('active'); });
        $$('.tab-links .active').forEach(function (l) { l.classList.remove('active'); });
        $$('.' + target).forEach(function (c) { c.classList.add('active'); });
        a.closest('.block').classList.add('active');
      });
    });
    /* mobil: záložky jsou jako akordeon nad každým obsahem */
    $$('.tab-link a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var cur = a.closest('.block'), sec = a.closest('.section');
        if (cur.classList.contains('active')) { cur.classList.remove('active'); sec.classList.remove('active'); return; }
        $$('.tab-content.active').forEach(function (c) { c.classList.remove('active'); });
        $$('.tab-link.active').forEach(function (l) { l.classList.remove('active'); });
        sec.classList.add('active'); cur.classList.add('active');
      });
    });
  }

  /* ------------------------------------------------ akordeony (FAQ) */
  function accordions() {
    $$('.accordion__title').forEach(function (t) {
      t.setAttribute('role', 'button');
      t.setAttribute('tabindex', '0');
      t.setAttribute('aria-expanded', 'false');
      function toggle() {
        var acc = t.closest('.accordion'), content = acc.querySelector('.accordion__content');
        var opening = t.getAttribute('aria-expanded') !== 'true';
        t.setAttribute('aria-expanded', opening ? 'true' : 'false');
        if (!content) { acc.classList.toggle('accordion--is-opened', opening); return; }
        var h = content.scrollHeight;
        if (opening) {
          content.style.height = '0px';
          acc.classList.add('accordion--is-opening');
          requestAnimationFrame(function () { content.style.height = h + 'px'; });
          setTimeout(function () { acc.classList.remove('accordion--is-opening'); acc.classList.add('accordion--is-opened'); content.style.height = ''; }, 300);
        } else {
          content.style.height = h + 'px';
          acc.classList.remove('accordion--is-opened');
          requestAnimationFrame(function () { content.style.height = '0px'; });
          setTimeout(function () { content.style.height = ''; }, 300);
        }
      }
      t.addEventListener('click', toggle);
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    });
  }

  /* ------------------------------------------------ slider (hero na homepage a kariéře) */
  function sliders() {
    $$('.gallery-slider-element[data-slider="true"]').forEach(function (el) {
      var wrap = el.querySelector('.gallery-slider-wrapper');
      if (!wrap) return;
      var slides = Array.prototype.slice.call(wrap.children);
      if (slides.length < 2) return;
      var d = el.dataset;
      var duration = parseInt(d.sliderTransition, 10) || 600;
      var delay = parseInt(d.sliderSpeed, 10) || 5000;
      /* živý web začíná prvním snímkem (data-slider-initial-slide v loop režimu nerespektuje) */
      var index = 0;
      var container = el.parentNode;
      el.classList.add('gallery-slider-initialized', 'gallery-slider-horizontal');
      el.style.overflow = 'hidden';
      var pager = null, bullets = [];
      if (d.sliderPager === 'true') {
        pager = doc.createElement('div');
        pager.className = 'slider-pager swiper-pagination-clickable swiper-pagination-bullets';
        slides.forEach(function (_, i) {
          var b = doc.createElement('span');
          b.className = 'swiper-pagination-bullet';
          b.setAttribute('role', 'button');
          b.setAttribute('tabindex', '0');
          b.setAttribute('aria-label', 'Snímek ' + (i + 1));
          b.addEventListener('click', function () { go(i); restart(); });
          b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); restart(); } });
          pager.appendChild(b); bullets.push(b);
        });
        container.appendChild(pager);
      }
      if (d.sliderControls === 'true') {
        [['prev', 'left', 'Předchozí snímek', -1], ['next', 'right', 'Další snímek', 1]].forEach(function (c) {
          var btn = doc.createElement('div');
          btn.className = 'slider-btn-' + c[0];
          btn.setAttribute('tabindex', '0');
          btn.setAttribute('role', 'button');
          btn.setAttribute('aria-label', c[2]);
          btn.innerHTML = '<span class="cssicon cssicon--chevron cssicon--chevron-' + c[1] + '"></span>';
          btn.addEventListener('click', function () { go(index + c[3]); restart(); });
          btn.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(index + c[3]); restart(); } });
          container.appendChild(btn);
        });
      }
      function go(i, instant) {
        index = (i + slides.length) % slides.length;
        wrap.style.transitionDuration = instant ? '0ms' : duration + 'ms';
        wrap.style.transform = 'translate3d(' + (-100 * index) + '%,0,0)';
        slides.forEach(function (s, k) {
          var on = k === index;
          s.classList.toggle('is-active', on);
          s.classList.toggle('gallery-slider-item-active', on);
          /* neaktivní snímek: mimo fokus i čtečku (odkazy v něm nesmí být dosažitelné) */
          if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
        });
        bullets.forEach(function (b, k) { b.classList.toggle('swiper-pagination-bullet-active', k === index); });
      }
      var timer = null, paused = false;
      function restart() {
        if (timer) clearInterval(timer);
        timer = null;
        if (paused) return;
        if (d.sliderAutoplay === 'true' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          timer = setInterval(function () { go(index + 1); }, delay + duration);
        }
      }
      /* pauza při najetí myší a fokusu uvnitř */
      container.addEventListener('mouseenter', function () { paused = true; restart(); });
      container.addEventListener('mouseleave', function () { paused = false; restart(); });
      container.addEventListener('focusin', function () { paused = true; restart(); });
      container.addEventListener('focusout', function () { paused = false; restart(); });
      /* swipe; po posunu se zablokuje klik, aby tažení přes odkaz nenavigovalo */
      var startX = null, swiped = false;
      el.addEventListener('pointerdown', function (e) { startX = e.clientX; swiped = false; });
      el.addEventListener('pointercancel', function () { startX = null; });
      el.addEventListener('pointerup', function (e) {
        if (startX === null) return;
        var dx = e.clientX - startX; startX = null;
        if (Math.abs(dx) > 50) { swiped = true; go(index + (dx < 0 ? 1 : -1)); restart(); }
      });
      el.addEventListener('click', function (e) { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);
      go(index, true);
      restart();
    });
  }

  /* ------------------------------------------------ kotvy s ohledem na fixní hlavičku */
  function scrollToHash(hash, smooth) {
    if (!hash || hash === '#') return false;
    var id = decodeURIComponent(hash.slice(1));
    var target = doc.getElementById(id);
    if (!target) return false;
    var offset = body.classList.contains('use-header-fixed') && header ? header.offsetHeight - 1 : 0;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(top, 0), behavior: smooth ? 'smooth' : 'auto' });
    return true;
  }
  function anchors() {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href*="#"]');
      if (!a || a.closest('.tab-links, .tab-link') || a.hasAttribute('data-toggle')) return;
      var url = new URL(a.href, location.href);
      if (url.pathname.replace(/\.html$/, '') !== location.pathname.replace(/\.html$/, '') || !url.hash) return;
      if (scrollToHash(url.hash, true)) {
        e.preventDefault();
        history.replaceState(null, '', url.hash);
        /* během plynulého scrollu se donačtou obrázky a cíl se posune → dorovnat */
        var realign = function () { scrollToHash(url.hash, false); window.removeEventListener('scrollend', realign); };
        if ('onscrollend' in window) window.addEventListener('scrollend', realign);
        else setTimeout(realign, 900);
      }
    });
  }

  /* ------------------------------------------------ formuláře → /api/lead.php → /dekujeme */
  function forms() {
    $$('form[data-lead-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (form.dataset.sending) return;
        if (form.reportValidity && !form.reportValidity()) return;
        var page = form.querySelector('input[name="page"]');
        if (page) page.value = location.pathname;
        var btn = form.querySelector('[type="submit"]');
        var label = btn && btn.querySelector('.btn__label');
        var original = label ? (label.dataset.original || label.textContent) : '';
        if (label) label.dataset.original = original;
        var err = form.querySelector('.lead-form-error');
        if (err) err.remove();
        form.dataset.sending = '1';
        if (btn) btn.disabled = true;
        if (label) label.textContent = UI.sending;
        var ctrl = window.AbortController ? new AbortController() : null;
        var killer = ctrl ? setTimeout(function () { ctrl.abort(); }, 15000) : null;
        fetch(form.getAttribute('action') || '/api/lead.php', { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' }, signal: ctrl ? ctrl.signal : undefined })
          .finally(function () { if (killer) clearTimeout(killer); })
          .then(function (r) { return r.json().catch(function () { return { ok: r.ok }; }).then(function (j) { if (!r.ok || !j.ok) throw new Error(j.error || r.status); }); })
          .then(function () {
            var variant = form.dataset.leadForm;
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({ event: 'lead_form_submit', form_variant: variant, page_path: location.pathname });
            location.href = UI.thanks + '?formular=' + encodeURIComponent(variant);
          })
          .catch(function () {
            delete form.dataset.sending;
            if (btn) btn.disabled = false;
            if (label) label.textContent = original;
            var p = doc.createElement('p');
            p.className = 'lead-form-error';
            p.setAttribute('role', 'alert');
            p.textContent = UI.error;
            form.appendChild(p);
          });
      });
    });
  }

  /* návrat zpět z /dekujeme (bfcache): formulář nesmí zůstat v odesílání */
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    $$('form[data-lead-form]').forEach(function (form) {
      delete form.dataset.sending;
      var btn = form.querySelector('[type="submit"]');
      if (btn) btn.disabled = false;
      var label = btn && btn.querySelector('.btn__label');
      if (label && label.dataset.original) label.textContent = label.dataset.original;
    });
  });

  /* ------------------------------------------------ start */
  headerHeight();
  firstSectionIndent();
  menu();
  dropdowns();
  tabs();
  accordions();
  sliders();
  anchors();
  forms();
  images();
  waypoints();
  window.addEventListener('resize', function () { headerHeight(); waypoints(); });
  window.addEventListener('scroll', waypoints, { passive: true });
  window.addEventListener('load', function () {
    body.classList.add('is-page-loaded');
    headerHeight();
    if (location.hash) scrollToHash(location.hash, false);
  });
})();
