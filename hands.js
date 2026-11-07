/* Gesture hints for the wedding invitation (Noble & Neha).
   1. A soft grey hand taps the wax seal, with a soft red glow and ripple, until the guest opens the envelope.
   2. On the hero, a grey hand swipes upward above "Scroll to explore", the page gently dips and settles
      back to show there is more below, and small arrows bob either side of "Scroll to explore".
      All of it stops as soon as the guest touches or scrolls.
   Self-contained: injects its own styles and markup, never blocks taps, and adds nothing else to the page.
   Include once per page, just before </body>:  <script src="/hands.js" defer></script>  */
(function () {
  if (window.__nnHands) return;
  window.__nnHands = true;

  var SHAPES =
    '<rect x="17" y="2" width="11" height="40" rx="5.5"/>' +
    '<rect x="27" y="19" width="9.5" height="20" rx="4.75"/>' +
    '<rect x="35.5" y="22" width="9" height="19" rx="4.5"/>' +
    '<rect x="43.5" y="26" width="8.5" height="17" rx="4.25"/>' +
    '<path d="M17 30 L8.5 25.5 C4.5 23.5 1 27.5 3.5 31.5 L13 45 C16 52 21 58 29 59 L40 59 C47.5 59 52 53 52 45 L52 34 L17 34 Z"/>';
  var HAND =
    '<svg viewBox="-3 -3 61 66" width="100%" height="100%" aria-hidden="true" focusable="false">' +
    '<g class="nnh-line">' + SHAPES + '</g><g class="nnh-fill">' + SHAPES + '</g>' +
    '<path class="nnh-crease" d="M27.5 26v9M36 29v8M44 32v7"/></svg>';

  var CSS =
    '.nnh-hand svg{display:block;overflow:visible;filter:drop-shadow(0 4px 8px rgba(0,0,0,.28))}' +
    '.nnh-hand .nnh-line{fill:none;stroke:rgba(88,84,100,.9);stroke-width:4.5;stroke-linejoin:round}' +
    '.nnh-hand .nnh-fill{fill:#ECEAF0}' +
    '.nnh-hand .nnh-crease{fill:none;stroke:rgba(110,106,122,.55);stroke-width:1.6;stroke-linecap:round}' +

    /* tap the seal */
    '.nnh-tap{position:absolute;z-index:7;width:clamp(44px,11vw,56px);aspect-ratio:61/66;pointer-events:none;' +
      'transform:translate(-32%,-4%);opacity:0;transition:opacity .25s ease}' +
    '.nnh-tap .nnh-move{position:absolute;inset:0;transform-origin:32% 6%}' +
    '.nnh-ring{position:absolute;z-index:6;aspect-ratio:1;border-radius:50%;pointer-events:none;' +
      'border:3px solid rgba(228,58,78,.95);box-shadow:0 0 18px 5px rgba(240,84,104,.6),inset 0 0 12px rgba(240,84,104,.45);' +
      'transform:translate(-50%,-50%) scale(.7);opacity:0}' +
    '.nnh-ring2{border-width:1.5px;box-shadow:0 0 10px 2px rgba(240,96,112,.4)}' +
    '.nnh-halo{position:absolute;z-index:4;aspect-ratio:1;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);opacity:0;' +
      'transition:opacity .4s ease;box-shadow:0 0 0 0 rgba(236,72,92,0)}' +
    '.nnh-halo.nnh-on{opacity:1;animation:nnhHalo 2.8s ease-in-out infinite}' +
    '@keyframes nnhHalo{0%,100%{box-shadow:0 0 14px 6px rgba(236,72,92,.45)}50%{box-shadow:0 0 28px 13px rgba(236,72,92,.65)}}' +
    '.nnh-tap.nnh-on{opacity:1;transition:opacity .6s ease}' +
    '.nnh-tap.nnh-on .nnh-move{animation:nnhTap 2.8s cubic-bezier(.45,0,.25,1) infinite both}' +
    '.nnh-ring.nnh-on{animation:nnhRing 2.8s ease-out infinite both}' +
    '.nnh-ring2.nnh-on{animation-delay:.35s}' +
    '@keyframes nnhTap{' +
      '0%{transform:translate(34%,46%) rotate(-14deg);opacity:0}' +
      '14%{opacity:.92}' +
      '30%{transform:translate(0,0) rotate(-14deg) scale(1);opacity:.92}' +
      '37%{transform:translate(0,3%) rotate(-14deg) scale(.88)}' +
      '46%{transform:translate(0,0) rotate(-14deg) scale(1)}' +
      '64%{transform:translate(16%,22%) rotate(-14deg);opacity:.92}' +
      '80%,100%{transform:translate(34%,46%) rotate(-14deg);opacity:0}}' +
    '@keyframes nnhRing{' +
      '0%,35%{transform:translate(-50%,-50%) scale(.7);opacity:0}' +
      '38%,48%{opacity:1}' +
      '75%,100%{transform:translate(-50%,-50%) scale(1.7);opacity:0}}' +

    /* arrows either side of "Scroll to explore" */
    '.nnh-arr{display:inline-block;vertical-align:middle;width:14px;height:20px;margin:0 10px;position:relative;top:-1px;pointer-events:none}' +
    '.nnh-arr svg{display:block;width:100%;height:100%;overflow:visible;animation:nnhArr 1.6s ease-in-out infinite}' +
    '.nnh-arr.nnh-r svg{animation-delay:.12s}' +
    '@keyframes nnhArr{0%,100%{transform:translateY(-3px);opacity:.55}50%{transform:translateY(4px);opacity:1}}' +

    /* swipe up on the hero */
    '.nnh-swipe{position:fixed;z-index:60;left:50%;width:52px;height:124px;margin-left:-26px;pointer-events:none;' +
      'opacity:0;transition:opacity .3s ease}' +
    '.nnh-swipe.nnh-on{opacity:1;transition:opacity .9s ease}' +
    '.nnh-swipe .nnh-move{position:absolute;left:0;right:0;bottom:0;height:56px}' +
    '.nnh-swipe .nnh-trail{position:absolute;left:50%;bottom:44px;width:3px;height:64px;margin-left:-7px;border-radius:3px;' +
      'background:linear-gradient(to top,rgba(236,234,240,0),rgba(236,234,240,.55));transform-origin:50% 100%;opacity:0}' +
    '.nnh-swipe.nnh-on .nnh-move{animation:nnhSwipe 2.6s cubic-bezier(.5,0,.3,1) infinite both}' +
    '.nnh-swipe.nnh-on .nnh-trail{animation:nnhTrail 2.6s cubic-bezier(.5,0,.3,1) infinite both}' +
    '@keyframes nnhSwipe{' +
      '0%{transform:translateY(0);opacity:0}' +
      '15%{transform:translateY(0);opacity:.92}' +
      '60%{transform:translateY(-66px);opacity:.92}' +
      '78%,100%{transform:translateY(-74px);opacity:0}}' +
    '@keyframes nnhTrail{' +
      '0%,15%{transform:scaleY(0);opacity:0}' +
      '30%{opacity:1}' +
      '60%{transform:translateY(-2px) scaleY(1);opacity:.9}' +
      '78%,100%{transform:translateY(-10px) scaleY(.4);opacity:0}}' +

    '@media (prefers-reduced-motion:reduce){' +
      '.nnh-tap.nnh-on .nnh-move{animation:none;transform:rotate(-14deg);opacity:.9}' +
      '.nnh-ring.nnh-on,.nnh-swipe.nnh-on .nnh-trail{animation:none;opacity:0}' +
      '.nnh-halo.nnh-on{animation:none;box-shadow:0 0 18px 7px rgba(236,72,92,.5)}' +
      '.nnh-arr svg{animation:none;opacity:.9}' +
      '.nnh-swipe.nnh-on .nnh-move{animation:none;opacity:.9}}';

  function el(cls, html) {
    var d = document.createElement('div');
    d.className = cls;
    d.setAttribute('aria-hidden', 'true');
    d.innerHTML = html;
    return d;
  }
  function visible(node) {
    if (!node) return false;
    var cs = getComputedStyle(node);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.6;
  }

  function init() {
    var env = document.getElementById('envelope') || document.querySelector('.envelope');
    var intro = document.getElementById('intro');
    var seal = env && env.querySelector('.seal');
    var cue = document.querySelector('.scroll-cue');
    var hero = document.getElementById('hero');

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var tap = null, ring = null;
    if (env && seal) {
      var halo = el('nnh-halo', '');
      seal.insertAdjacentElement('beforebegin', halo);
      ring = el('nnh-ring', '');
      var ring2 = el('nnh-ring nnh-ring2', '');
      tap = el('nnh-tap nnh-hand', '<div class="nnh-move">' + HAND + '</div>');
      seal.insertAdjacentElement('afterend', ring);
      ring.insertAdjacentElement('afterend', ring2);
      ring2.insertAdjacentElement('afterend', tap);
      ring = { list: [ring, ring2, halo] };
    }
    var ARROW = '<svg viewBox="0 0 14 20" aria-hidden="true" focusable="false"><path d="M7 1v16M1.5 11.5 7 17l5.5-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (cue && !cue.querySelector('.nnh-arr')) {
      var a1 = document.createElement('span'); a1.className = 'nnh-arr nnh-l'; a1.setAttribute('aria-hidden', 'true'); a1.innerHTML = ARROW;
      var a2 = document.createElement('span'); a2.className = 'nnh-arr nnh-r'; a2.setAttribute('aria-hidden', 'true'); a2.innerHTML = ARROW;
      cue.insertBefore(a1, cue.firstChild); cue.appendChild(a2);
    }
    var swipe = el('nnh-swipe nnh-hand', '<span class="nnh-trail"></span><div class="nnh-move">' + HAND + '</div>');
    document.body.appendChild(swipe);

    // keep the tap hand and ring sitting exactly on the seal, whatever its size on this screen
    function placeTap() {
      if (!tap) return;
      var cs = getComputedStyle(seal);
      tap.style.left = cs.left; tap.style.top = cs.top;
      ring.list.forEach(function (r) { r.style.left = cs.left; r.style.top = cs.top; r.style.width = seal.offsetWidth + 'px'; });
    }
    // keep the swipe hand just above "Scroll to explore"
    function placeSwipe() {
      var bottom = innerHeight * 0.05 + 96;
      if (cue) {
        var r = cue.getBoundingClientRect();
        if (r.height) bottom = innerHeight - r.top + 10;
      }
      swipe.style.bottom = Math.round(bottom) + 'px';
    }

    var tapSince = 0, heroSince = 0, swiped = false, tapOn = false, swipeOn = false;
    function setTap(on) {
      if (!tap || on === tapOn) return;
      tapOn = on;
      tap.classList.toggle('nnh-on', on);
      ring.list.forEach(function (r) { r.classList.toggle('nnh-on', on); });
    }
    function setSwipe(on) {
      if (on === swipeOn) return;
      swipeOn = on;
      if (on) placeSwipe();
      swipe.classList.toggle('nnh-on', on);
    }

    // gentle "peek": the whole page dips a little and settles back, so guests see there is more below
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var nudgeStopped = false, nudgeRaf = 0, nudgeNext = 0, nudging = false;
    var STEPS = [[0, 0], [520, 42], [1050, 0], [1330, 14], [1650, 0]];   // [ms, px]
    function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
    function cancelNudge() {
      if (nudgeRaf) cancelAnimationFrame(nudgeRaf);
      nudgeRaf = 0;
      if (nudging) { nudging = false; if (scrollY < 60) scrollTo({ top: 0, behavior: 'instant' }); }
    }
    function runNudge() {
      if (scrollY > 2) return;
      nudging = true;
      var t0 = performance.now(), end = STEPS[STEPS.length - 1][0];
      (function frame(now) {
        var t = now - t0, y = 0;
        for (var i = 1; i < STEPS.length; i++) {
          if (t <= STEPS[i][0]) {
            var a = STEPS[i - 1], b = STEPS[i];
            y = a[1] + (b[1] - a[1]) * ease((t - a[0]) / (b[0] - a[0]));
            break;
          }
        }
        scrollTo({ top: Math.round(y), behavior: 'instant' });
        if (t < end) nudgeRaf = requestAnimationFrame(frame);
        else { nudgeRaf = 0; nudging = false; scrollTo({ top: 0, behavior: 'instant' }); }
      })(t0);
    }
    function userMoved() {
      if (!heroSince) return;               // touches on the envelope don't count
      nudgeStopped = true;
      cancelNudge();
    }
    ['touchstart', 'wheel', 'keydown', 'mousedown'].forEach(function (ev) {
      addEventListener(ev, userMoved, { passive: true, capture: true });
    });

    function tick() {
      var now = Date.now();
      var introShown = intro ? visible(intro) : false;
      var sealed = env ? !env.classList.contains('open') : false;

      // 1. Tap hint: envelope sealed and on screen for a moment
      if (introShown && sealed) {
        if (!tapSince) { tapSince = now; placeTap(); }
        swiped = false;          // a fresh run (first visit or after "seal this letter again")
        nudgeStopped = false; nudgeNext = 0;
      } else tapSince = 0;
      setTap(!!tapSince && now - tapSince > 1400);

      // 2. Swipe hint: hero open at the top, "Scroll to explore" has settled, guest hasn't scrolled yet
      if (scrollY > 60 && !nudging) swiped = true;
      var heroReady = !introShown && !sealed &&
        (cue ? visible(cue) && !cue.classList.contains('hide')
             : !!(hero && hero.classList.contains('opened')));
      if (heroReady && !swiped) { if (!heroSince) heroSince = now; } else heroSince = 0;
      var ready = !!heroSince && now - heroSince > (cue ? 600 : 5000);
      setSwipe(ready);

      if (ready && !nudgeStopped && !reduce) {
        if (!nudgeNext) nudgeNext = now + 700;
        if (now >= nudgeNext && !nudging) { runNudge(); nudgeNext = now + 3600; }
      } else {
        if (nudging) cancelNudge();
        if (!ready) nudgeNext = 0;
      }
    }

    if (env) env.addEventListener('pointerdown', function () { setTap(false); tapSince = 0; }, true);
    addEventListener('scroll', function () { if (scrollY > 60 && !nudging) { swiped = true; setSwipe(false); } }, { passive: true });
    addEventListener('resize', function () { placeTap(); if (swipeOn) placeSwipe(); });
    placeTap();
    tick();
    setInterval(tick, 250);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
