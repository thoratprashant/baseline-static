/* Baseline Health — site behaviours.
   Vanilla JS, framework-agnostic. Static pages run BH.init() on load;
   the Angular app calls window.BH.init() after every route change.
   Every initialiser is idempotent and all scroll work reads the live DOM,
   so nothing leaks when Angular swaps a page out. */
(function () {
  'use strict';
  document.documentElement.classList.add('has-js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var globalsBound = false;
  var ticking = false;

  function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
  function normalise(s) { return (s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }
  function once(el, key) { if (el.dataset[key]) return false; el.dataset[key] = '1'; return true; }

  /* ------------------------------------------------------------------
     1. The baseline: a heartbeat line that settles as you scroll
     ------------------------------------------------------------------ */
  function beat(u) {
    if (u < 0.30) return 0;
    if (u < 0.36) return -0.12 * Math.sin(((u - 0.30) / 0.06) * Math.PI);
    if (u < 0.42) return 0;
    if (u < 0.45) return 0.18 * ((u - 0.42) / 0.03);
    if (u < 0.49) return 0.18 - 1.18 * ((u - 0.45) / 0.04);
    if (u < 0.53) return -1 + 1.45 * ((u - 0.49) / 0.04);
    if (u < 0.56) return 0.45 - 0.45 * ((u - 0.53) / 0.03);
    if (u < 0.64) return 0;
    if (u < 0.76) return -0.22 * Math.sin(((u - 0.64) / 0.12) * Math.PI);
    return 0;
  }

  function drawPulse(svg, time) {
    var rect = svg.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight || !rect.width) return;
    var w = Math.round(rect.width), h = Math.round(rect.height);
    var path = svg.querySelector('path');
    if (!path) return;
    // Settle: full heartbeat at the top of the page, flat once the hero has scrolled away
    var settle = clamp(window.scrollY / (window.innerHeight * 0.55), 0, 1);
    var amp = (1 - settle) * h * 0.46;
    var mid = h * 0.56;
    var cycle = Math.max(260, Math.min(460, w / 3));
    var shift = reduceMotion ? 0.2 : (time / 1000) * 0.16;
    var d = 'M0 ' + mid.toFixed(1);
    for (var x = 0; x <= w; x += 4) {
      var u = (x / cycle - shift) % 1; if (u < 0) u += 1;
      d += 'L' + x + ' ' + (mid + beat(u) * amp).toFixed(1);
    }
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    path.setAttribute('d', d);
  }

  function pulseLoop(time) {
    each(document, '[data-pulse]', function (svg) { drawPulse(svg, time); });
    if (!reduceMotion) window.requestAnimationFrame(pulseLoop);
  }

  /* ------------------------------------------------------------------
     2. Scroll-linked work (one handler, one frame)
     ------------------------------------------------------------------ */
  function onScroll() {
    var vh = window.innerHeight;
    var header = document.querySelector('.site-header');
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);

    var bar = document.querySelector('.scroll-progress span');
    if (bar) {
      var max = document.documentElement.scrollHeight - vh;
      bar.style.transform = 'scaleX(' + (max > 0 ? clamp(window.scrollY / max, 0, 1) : 0) + ')';
    }

    // Statement: words switch on as the sentence travels up the viewport
    each(document, '[data-words]', function (el) {
      var r = el.getBoundingClientRect();
      var p = clamp((vh * 0.85 - r.top) / (vh * 0.5), 0, 1);
      var words = el.querySelectorAll('span');
      var on = Math.round(p * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < on);
    });

    // Step-by-step: highlight the step nearest the reading line, update the sticky counter
    each(document, '[data-steps]', function (wrap) {
      var steps = wrap.querySelectorAll('.step');
      if (!steps.length) return;
      var active = 0;
      for (var i = 0; i < steps.length; i++) {
        if (steps[i].getBoundingClientRect().top < vh * 0.5) active = i;
      }
      for (var j = 0; j < steps.length; j++) steps[j].classList.toggle('is-active', j === active);
      var num = wrap.querySelector('[data-step-num]');
      var title = wrap.querySelector('[data-step-title]');
      var fill = wrap.querySelector('[data-step-bar]');
      var label = (active + 1 < 10 ? '0' : '') + (active + 1);
      if (num && num.textContent !== label) num.textContent = label;
      if (title) title.textContent = steps[active].dataset.title || '';
      if (fill) fill.style.transform = 'scaleX(' + (active + 1) / steps.length + ')';
    });

    if (reduceMotion) each(document, '[data-pulse]', function (svg) { drawPulse(svg, 0); });
  }

  function requestScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; onScroll(); });
  }

  function bindGlobals() {
    if (globalsBound) return;
    globalsBound = true;
    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll, { passive: true });
    window.requestAnimationFrame(pulseLoop);
  }

  /* ------------------------------------------------------------------
     3. Components
     ------------------------------------------------------------------ */
  function initWords(root) {
    each(root, '[data-words]', function (el) {
      if (!once(el, 'bhWords')) return;
      var words = el.textContent.trim().split(/\s+/);
      el.setAttribute('aria-label', words.join(' '));
      el.innerHTML = words.map(function (w) { return '<span aria-hidden="true">' + w + '</span>'; }).join(' ');
    });
  }

  /* Segmented switch: [data-switch] > [data-switch-btn="key"] + [data-switch-panel="key"] */
  function initSwitches(root) {
    each(root, '[data-switch]', function (wrap) {
      if (!once(wrap, 'bhSwitch')) return;
      var btns = wrap.querySelectorAll('[data-switch-btn]');
      var panels = wrap.querySelectorAll('[data-switch-panel]');
      function show(key) {
        Array.prototype.forEach.call(btns, function (b) {
          var on = b.dataset.switchBtn === key;
          b.classList.toggle('active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        Array.prototype.forEach.call(panels, function (p) { p.hidden = p.dataset.switchPanel !== key; });
      }
      Array.prototype.forEach.call(btns, function (b) {
        b.addEventListener('click', function () { show(b.dataset.switchBtn); });
      });
    });
  }

  /* Eligibility guide: one question at a time, stops at the first "no". */
  function initChecker(root) {
    each(root, '[data-checker]', function (wrap) {
      if (!once(wrap, 'bhChecker')) return;
      var steps = wrap.querySelectorAll('[data-q]');
      var results = wrap.querySelectorAll('[data-result]');
      var fill = wrap.querySelector('[data-checker-bar]');
      var count = wrap.querySelector('[data-checker-count]');
      var select = wrap.querySelector('select');
      var total = steps.length;

      function go(index, result) {
        Array.prototype.forEach.call(steps, function (s, i) { s.hidden = result ? true : i !== index; });
        Array.prototype.forEach.call(results, function (r) { r.hidden = r.dataset.result !== result; });
        var done = result ? total : index;
        if (fill) fill.style.transform = 'scaleX(' + done / total + ')';
        if (count) count.textContent = result ? 'Done' : 'Question ' + (index + 1) + ' of ' + total;
        var target = result ? wrap.querySelector('[data-result="' + result + '"]') : steps[index];
        var heading = target && target.querySelector('h3');
        if (heading && wrap.dataset.started) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      }

      function answer(index, ok) {
        wrap.dataset.started = '1';
        if (!ok) return go(index, steps[index].dataset.q);
        if (index + 1 < total) return go(index + 1);
        go(index, 'fit');
      }

      Array.prototype.forEach.call(steps, function (step, index) {
        each(step, '[data-a]', function (btn) {
          btn.addEventListener('click', function () {
            if (btn.dataset.a === 'select') {
              if (!select.value) { select.focus(); select.classList.add('is-invalid'); return; }
              return answer(index, select.value !== 'none');
            }
            answer(index, btn.dataset.a === 'yes');
          });
        });
      });
      if (select) select.addEventListener('change', function () { select.classList.remove('is-invalid'); });
      each(wrap, '[data-restart]', function (btn) {
        btn.addEventListener('click', function () { if (select) select.value = ''; go(0); });
      });
      go(0);
    });
  }

  /* Hours calculator: visits a year x hours per visit. */
  function initCalc(root) {
    each(root, '[data-calc]', function (wrap) {
      if (!once(wrap, 'bhCalc')) return;
      var visits = wrap.querySelector('[data-calc-visits]');
      var hours = wrap.querySelector('[data-calc-hours]');
      function update() {
        var v = parseFloat(visits.value), h = parseFloat(hours.value);
        var total = Math.round(v * h * 10) / 10;
        wrap.querySelector('[data-calc-visits-out]').textContent = v + (v === 1 ? ' visit' : ' visits');
        wrap.querySelector('[data-calc-hours-out]').textContent = h + (h === 1 ? ' hour' : ' hours');
        wrap.querySelector('[data-calc-total]').textContent = total;
        wrap.querySelector('[data-calc-unit]').textContent = total === 1 ? 'hour a year' : 'hours a year';
      }
      visits.addEventListener('input', update);
      hours.addEventListener('input', update);
      update();
    });
  }

  /* List filter: [data-filter] holds an input, optional chips ([data-chip])
     and items ([data-item] with data-keywords, data-group). */
  function initFilters(root) {
    each(root, '[data-filter]', function (wrap) {
      if (!once(wrap, 'bhFilter')) return;
      var input = wrap.querySelector('[data-filter-input]');
      var chips = wrap.querySelectorAll('[data-chip]');
      var items = wrap.querySelectorAll('[data-item]');
      var countEl = wrap.querySelector('[data-filter-count]');
      var empty = wrap.querySelector('[data-filter-empty]');
      var group = 'all';
      function apply() {
        var q = normalise(input ? input.value : '');
        var shown = 0;
        Array.prototype.forEach.call(items, function (it) {
          var text = normalise(it.dataset.keywords + ' ' + it.textContent);
          var g = (it.dataset.group || '').split(' ');
          var ok = (!q || text.indexOf(q) !== -1) && (group === 'all' || g.indexOf(group) !== -1);
          it.hidden = !ok;
          if (ok) shown++;
        });
        if (countEl) countEl.textContent = shown + ' of ' + items.length;
        if (empty) empty.hidden = shown !== 0;
      }
      if (input) input.addEventListener('input', apply);
      Array.prototype.forEach.call(chips, function (c) {
        c.addEventListener('click', function () {
          Array.prototype.forEach.call(chips, function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
          c.classList.add('active'); c.setAttribute('aria-pressed', 'true');
          group = c.dataset.chip; apply();
        });
      });
      apply();
    });
  }

  /* FAQ search across accordion items and their groups. */
  function initFaq(root) {
    var input = root.querySelector('[data-faq-search]');
    if (!input || !once(input, 'bhFaq')) return;
    var empty = root.querySelector('[data-faq-empty]');
    input.addEventListener('input', function () {
      var q = normalise(input.value), total = 0;
      each(root, '.faq-group', function (g) {
        var shown = 0;
        each(g, '.accordion-item', function (it) {
          var ok = !q || normalise(it.textContent).indexOf(q) !== -1;
          it.hidden = !ok;
          if (ok) shown++;
        });
        g.hidden = shown === 0;
        total += shown;
      });
      if (empty) empty.hidden = total !== 0;
    });

    var links = root.querySelectorAll('.faq-nav a');
    if ('IntersectionObserver' in window && links.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          Array.prototype.forEach.call(links, function (l) {
            l.classList.toggle('active', l.getAttribute('href').split('#')[1] === e.target.id);
          });
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      each(root, '.faq-group', function (g) { spy.observe(g); });
    }
  }

  /* Front-end only "notify me" form — wire to your email service. */
  function initForms(root) {
    each(root, '[data-notify-form]', function (form) {
      if (!once(form, 'bhForm')) return;
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var email = form.querySelector('input[type=email]');
        if (email && !email.checkValidity()) { email.reportValidity(); return; }
        var ok = form.parentElement.querySelector('.form-success');
        if (ok) ok.hidden = false;
        form.reset();
      });
    });
  }

  function initYear(root) {
    each(root, '[data-year]', function (el) { el.textContent = new Date().getFullYear(); });
  }

  function init(root) {
    root = root || document;
    bindGlobals();
    initWords(root);
    initSwitches(root);
    initChecker(root);
    initCalc(root);
    initFilters(root);
    initFaq(root);
    initForms(root);
    initYear(root);
    onScroll();
  }

  window.BH = { init: init };

  // Static site: run automatically. The Angular app (has <app-root>) calls BH.init itself.
  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('app-root')) init(document);
  });
})();
