/* ============================================================
   Scroll reveal, sdilena implementace pro cely ekosystem Piano.
   Vlozte jako <script src="/js/reveal.js"> v <head>. Bez defer:
   trida .js se musi na <html> objevit driv, nez se vykresli obsah,
   jinak prvky nejdriv bliknou viditelne a pak zmizi.

   ODCHYLKA od puvodni verze ze styleguidu, overeno v Chrome na dev
   serveru Protelu:
   1. IntersectionObserver na tehto webech nedorucoval callbacky. Weby
      maji v base.css `overflow-x: clip` na html i body jako pojistku
      proti vodorovnemu scrollu a s nim IO nehlasi prusecíky. Primarni
      cestou je proto dopocet pri scrollu, IO je jen doplnek.
   2. Podminka "je videt" nesmi vyzadovat bottom > 0. Sekce, kterou
      uzivatel preleti rychlym scrollem nebo ktera je nad obnovenou
      pozici scrollu, ma bottom < 0 a zustala by navzdy neviditelna.
      Odkryva se proto vse, co prekrocilo spousteci linku.
   ============================================================ */
(function () {
  var root = document.documentElement;

  // Kdyz uzivatel nechce pohyb, ani neskryvame: .js se neprida a CSS nic nedela.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  root.classList.add('js');

  /* Spousteci linka. Bere se z tokenu --reveal-threshold (default 0,2, jako grason.cz):
     prvek se odkryje, az jeho horni hrana vystoupa nad (1 - threshold)
     vysky viewportu, tedy az je znatelne v pohledu.

     POZOR na hodnotu blizko 1: pri 0,95 vysky okna se prvek odkryva ve
     spodnich 5 % obrazovky, animace probehne mimo misto, kam se uzivatel
     kouka, a je fakticky neviditelna. */
  var threshold = parseFloat(
    getComputedStyle(root).getPropertyValue('--reveal-threshold')
  );
  if (!(threshold > 0 && threshold < 1)) threshold = 0.2;
  var linePct = 1 - threshold;

  function crossed(el) {
    /* Pojistka: kdyz okno nema vysku (skryta zalozka, nulovy viewport, ramecek
       o nulove velikosti), byla by spousteci linka na nule a nic by se nikdy
       neodkrylo. Obsah nesmi zustat neviditelny, tak ho v takovem pripade
       pustime rovnou. */
    if (!window.innerHeight) return true;
    return el.getBoundingClientRect().top < window.innerHeight * linePct;
  }

  function arm() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var pending = [];
    for (var i = 0; i < els.length; i++) {
      /* Co je pri nacteni uz nad spousteci linkou, odkryjeme bez animace:
         hero se nema animovat, uzivatel na nej kouka od prvni vteriny.
         Pokryva i obnovenou pozici scrollu, kdy je nad linkou pul stranky. */
      if (crossed(els[i])) {
        els[i].classList.add('is-visible');
      } else {
        pending.push(els[i]);
      }
    }
    if (!pending.length) return;

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (!entries[k].isIntersecting) continue;
          entries[k].target.classList.add('is-visible');
          io.unobserve(entries[k].target);
        }
      }, { threshold: 0, rootMargin: '0px 0px -' + Math.round(threshold * 100) + '% 0px' });
      for (var j = 0; j < pending.length; j++) io.observe(pending[j]);
    }

    var ticking = false;
    function sweep() {
      ticking = false;
      for (var k = pending.length - 1; k >= 0; k--) {
        var el = pending[k];
        if (el.classList.contains('is-visible') || crossed(el)) {
          el.classList.add('is-visible');
          if (io) io.unobserve(el);
          pending.splice(k, 1);
        }
      }
      if (!pending.length) {
        window.removeEventListener('scroll', onMove);
        window.removeEventListener('resize', onMove);
      }
    }
    function onMove() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', onMove, { passive: true });
    window.addEventListener('resize', onMove, { passive: true });

    /* Doskoceni po dokresleni stranky: obrazky dorovnaji vysku layoutu,
       takze se spousteci linka posune. */
    window.addEventListener('load', onMove, { once: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }

  // Astro View Transitions: po prechodu na jinou stranku se DOM vymeni.
  document.addEventListener('astro:page-load', arm);
})();
