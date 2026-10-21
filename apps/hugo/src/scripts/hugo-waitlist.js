/* Formulář „Ozvi se mi“ na homepage → Databridge (JSON, web pozná podle Origin), po úspěchu
   na děkovací stránku. Nahrazuje Google Chat webhook živého hugopos.eu; markup formuláře je
   převzatý 1:1 a volá window.hugoWaitlistSubmit(form) z onsubmit. Sekce je zatím skrytá
   (hidden) stejně jako na živém webu. */
(function () {
  var ENDPOINT = 'https://databridge.pianopos.cz/api/web-lead';
  var MSG = {
    cs: { sending: 'Odesílám…', error: 'Nepovedlo se to odeslat. Zkus to znovu nebo napiš na hugo@piano.cz.' },
    en: { sending: 'Sending…', error: 'Something went wrong. Try again, or write to hugo@piano.cz.' }
  }[document.documentElement.lang === 'en' ? 'en' : 'cs'];
  var busy = false;

  window.hugoWaitlistSubmit = function (form) {
    if (busy) return;
    busy = true;
    var btn = form.querySelector('button[type=submit]');
    var label = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.textContent = MSG.sending; }
    var landing = {};
    try { landing = JSON.parse(sessionStorage.getItem('leadLanding') || '{}'); } catch (e) {}
    var payload = {
      name: (form.querySelector('input[type=text]') || {}).value || '',
      email: (form.querySelector('input[type=email]') || {}).value || '',
      pageUrl: location.href,
      landingUrl: landing.url || location.href,
      referrer: landing.referrer != null ? landing.referrer : document.referrer,
      website: ''
    };
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) {
        if (!r.ok) throw new Error('lead');
        location.href = document.documentElement.lang === 'en' ? '/en/dekujeme/' : '/dekujeme/';
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
  };
})();
