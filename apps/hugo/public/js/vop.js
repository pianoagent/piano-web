/* VOP: zvýraznění právě čtené sekce v obsahu (1:1 z hugopos.eu). */
// Highlight the section currently being read in the table of contents.
  // Rule: the active section is the LAST one whose heading has passed the
  // reading line (just under the sticky nav) - a section's tail scrolling out
  // must not keep it highlighted while the next heading is already on screen.
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
    var byId = {};
    links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var sections = Array.prototype.slice.call(document.querySelectorAll('article section'));
    if (!sections.length) return;

    var READ_LINE = 140; // px from the viewport top
    var ticking = false;
    var activeId = null;

    function update() {
      ticking = false;
      var current = sections[0].id;
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= READ_LINE) current = sections[i].id;
        else break;
      }
      if (current === activeId) return;
      activeId = current;
      links.forEach(function (a) { a.classList.remove('is-active'); });
      if (byId[current]) byId[current].classList.add('is-active');
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();
