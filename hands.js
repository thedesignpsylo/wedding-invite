/* Gesture hints for the wedding invitation (Noble & Neha).
   1. Seal screen: a soft red glow breathes around the wax seal and a red ring ripples out.
      For the first 3 seconds, a soft white circle also presses the seal, like a fingertip.
   2. Hero: for the first 3 seconds, a soft white circle glides up and down above "Scroll to explore".
      The page also dips and settles back to show there is more below, and small arrows bob either side
      of "Scroll to explore". The dip stops as soon as the guest touches or scrolls.
   Self-contained: injects its own styles and markup, never blocks taps, and adds nothing else to the page.
   Include once per page, just before </body>:  <script src="/hands.js" defer></script>  */
(function () {
  if (window.__nnHands) return;
  window.__nnHands = true;

  var SHOW_MS = 3000;   // how long the white circle stays on screen each time

  var CSS =
    /* the soft white circle */
    '.nnh-dot{width:100%;height:100%;border-radius:50%;' +
      'background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.55),rgba(255,255,255,.22) 70%);' +
      'border:1.5px solid rgba(255,255,255,.9);' +
      'box-shadow:0 0 16px 4px rgba(255,255,255,.45),0 3px 10px rgba(0,0,0,.18);' +
      '-webkit-backdrop-filter:blur(5px);backdrop-filter:blur(5px)}' +

    /* seal: glow + ripple */
    '.nnh-ring{position:absolute;z-index:6;aspect-ratio:1;border-radius:50%;pointer-events:none;' +
      'border:3px solid rgba(228,58,78,.95);box-shadow:0 0 18px 5px rgba(240,84,104,.6),inset 0 0 12px rgba(240,84,104,.45);' +
      'transform:translate(-50%,-50%) scale(.7);opacity:0}' +
    '.nnh-ring2{border-width:1.5px;box-shadow:0 0 10px 2px rgba(240,96,112,.4)}' +
    '.nnh-halo{position:absolute;z-index:4;aspect-ratio:1;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%);opacity:0;' +
      'transition:opacity .4s ease;box-shadow:0 0 0 0 rgba(236,72,92,0)}' +
    '.nnh-halo.nnh-on{opacity:1;animation:nnhHalo 2.8s ease-in-out infinite}' +
    '@keyframes nnhHalo{0%,100%{box-shadow:0 0 14px 6px rgba(236,72,92,.45)}50%{box-shadow:0 0 28px 13px rgba(236,72,92,.65)}}' +
    '.nnh-ring.nnh-on{animation:nnhRing 2.8s ease-out infinite both}' +
    '.nnh-ring2.nnh-on{animation-delay:.35s}' +
    '@keyframes nnhRing{' +
      '0%,35%{transform:translate(-50%,-50%) scale(.7);opacity:0}' +
      '38%,48%{opacity:1}' +
      '75%,100%{transform:translate(-50%,-50%) scale(1.7);opacity:0}}' +

    /* seal: white circle presses it (first 3 seconds) */
    '.nnh-tap{position:absolute;z-index:7;width:clamp(38px,10vw,46px);aspect-ratio:1;pointer-events:none;' +
      'transform:translate(-50%,-50%);opacity:0;transition:opacity .4s ease}' +
    '.nnh-tap.nnh-on{opacity:1;transition:opacity .5s ease}' +
    '.nnh-tap .nnh-move{position:absolute;inset:0}' +
    '.nnh-tap .nnh-dot{border-color:#fff;background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.7),rgba(255,255,255,.35) 70%);' +
      'box-shadow:0 0 0 1px rgba(110,20,40,.35),0 0 18px 6px rgba(255,255,255,.75),0 4px 12px rgba(0,0,0,.25)}' +
    '.nnh-tap.nnh-on .nnh-move{animation:nnhTap 1.5s cubic-bezier(.45,0,.25,1) infinite both}' +
    '@keyframes nnhTap{' +
      '0%{transform:translate(60%,70%) scale(1);opacity:0}' +
      '20%{opacity:1}' +
      '42%{transform:translate(0,0) scale(1)}' +
      '54%{transform:translate(0,0) scale(.72)}' +
      '68%{transform:translate(0,0) scale(1);opacity:1}' +
      '100%{transform:translate(60%,70%) scale(1);opacity:0}}' +

    /* arrows either side of "Scroll to explore" */
    '.scroll-cue.nnh-row{flex-direction:row!important;width:max-content;white-space:nowrap}' +
    '.nnh-arr{display:inline-block;flex:none;vertical-align:middle;width:14px;height:20px;margin:0 10px;position:relative;top:-1px;pointer-events:none}' +
    '.nnh-arr svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 1px 3px rgba(0,0,0,.55));animation:nnhArr 1.6s ease-in-out infinite}' +
    '.nnh-arr.nnh-r svg{animation-delay:.12s}' +
    '@keyframes nnhArr{0%,100%{transform:translateY(-3px);opacity:.55}50%{transform:translateY(4px);opacity:1}}' +

    /* hero: white circle glides up and down (first 3 seconds) */
    '.nnh-swipe{position:fixed;z-index:60;left:50%;width:40px;height:110px;margin-left:-20px;pointer-events:none;' +
      'opacity:0;transition:opacity .5s ease}' +
    '.nnh-swipe.nnh-on{opacity:1;transition:opacity .6s ease}' +
    '.nnh-swipe .nnh-move{position:absolute;left:0;right:0;bottom:0;height:40px}' +
    '.nnh-swipe .nnh-trail{position:absolute;left:50%;bottom:20px;width:2px;height:70px;margin-left:-1px;border-radius:2px;' +
      'background:linear-gradient(to top,rgba(255,255,255,.5),rgba(255,255,255,0));opacity:0}' +
    '.nnh-swipe.nnh-on .nnh-move{animation:nnhSwipe 1.5s cubic-bezier(.45,0,.55,1) infinite both}' +
    '.nnh-swipe.nnh-on .nnh-trail{opacity:1;transition:opacity .6s ease}' +
    '@keyframes nnhSwipe{0%,100%{transform:translateY(0)}50%{transform:translateY(-70px)}}' +

    '@media (prefers-reduced-motion:reduce){' +
      '.nnh-tap.nnh-on .nnh-move,.nnh-swipe.nnh-on .nnh-move{animation:none}' +
      '.nnh-ring.nnh-on{animation:none;opacity:0}' +
      '.nnh-halo.nnh-on{animation:none;box-shadow:0 0 18px 7px rgba(236,72,92,.5)}' +
      '.nnh-arr svg{animation:none;opacity:.9}}';

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

    var DOT = '<div class="nnh-move"><div class="nnh-dot"></div></div>';
    var tap = null, glow = [];
    var autoOpen = document.documentElement.hasAttribute('data-autoopen');   // letter opens by itself: no tap hint
    if (env && seal && !autoOpen) {
      var halo = el('nnh-halo', ''), ring = el('nnh-ring', ''), ring2 = el('nnh-ring nnh-ring2', '');
      tap = el('nnh-tap', DOT);
      seal.insertAdjacentElement('beforebegin', halo);
      seal.insertAdjacentElement('afterend', ring);
      ring.insertAdjacentElement('afterend', ring2);
      ring2.insertAdjacentElement('afterend', tap);
      glow = [halo, ring, ring2];
    }
    var ARROW = '<svg viewBox="0 0 14 20" aria-hidden="true" focusable="false"><path d="M7 1v16M1.5 11.5 7 17l5.5-5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    if (cue && !cue.querySelector('.nnh-arr')) {
      var a1 = document.createElement('span'); a1.className = 'nnh-arr nnh-l'; a1.setAttribute('aria-hidden', 'true'); a1.innerHTML = ARROW;
      var a2 = document.createElement('span'); a2.className = 'nnh-arr nnh-r'; a2.setAttribute('aria-hidden', 'true'); a2.innerHTML = ARROW;
      cue.insertBefore(a1, cue.firstChild); cue.appendChild(a2);
      cue.classList.add('nnh-row');
    }
    var swipe = el('nnh-swipe', '<span class="nnh-trail"></span>' + DOT);
    document.body.appendChild(swipe);

    // keep the circle, glow and rings sitting exactly on the seal, whatever its size on this screen
    function placeTap() {
      if (!tap) return;
      var cs = getComputedStyle(seal);
      tap.style.left = cs.left; tap.style.top = cs.top;
      glow.forEach(function (r) { r.style.left = cs.left; r.style.top = cs.top; r.style.width = seal.offsetWidth + 'px'; });
    }
    // keep the hero circle just above "Scroll to explore"
    function placeSwipe() {
      var bottom = innerHeight * 0.05 + 96;
      if (cue) {
        var r = cue.getBoundingClientRect();
        if (r.height) bottom = innerHeight - r.top + 10;
      }
      swipe.style.bottom = Math.round(bottom) + 'px';
    }

    var tapSince = 0, heroSince = 0, swiped = false, glowOn = false, tapOn = false, swipeOn = false;
    function toggle(node, on) { if (node) node.classList.toggle('nnh-on', on); }
    function setGlow(on) { if (on === glowOn) return; glowOn = on; glow.forEach(function (g) { toggle(g, on); }); }
    function setTap(on) { if (on === tapOn) return; tapOn = on; toggle(tap, on); }
    function setSwipe(on) { if (on === swipeOn) return; swipeOn = on; if (on) placeSwipe(); toggle(swipe, on); }

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

      // 1. Seal: glow stays while sealed; the white circle only for the first 3 seconds
      if (introShown && sealed) {
        if (!tapSince) { tapSince = now; placeTap(); }
        swiped = false;          // a fresh run (first visit or after "seal this letter again")
        nudgeStopped = false; nudgeNext = 0;
      } else tapSince = 0;
      var tapAge = tapSince ? now - tapSince : -1;
      setGlow(tapAge > 1000);
      setTap(tapAge > 1000 && tapAge < 1000 + SHOW_MS);

      // 2. Hero: once "Scroll to explore" has settled and the guest hasn't scrolled yet
      if (scrollY > 60 && !nudging) swiped = true;
      var heroReady = !introShown && !sealed &&
        (cue ? visible(cue) && !cue.classList.contains('hide')
             : !!(hero && hero.classList.contains('opened')));
      if (heroReady && !swiped) { if (!heroSince) heroSince = now; } else heroSince = 0;
      var delay = cue ? 600 : 5000;
      var heroAge = heroSince ? now - heroSince : -1;
      var ready = heroAge > delay;
      setSwipe(ready && heroAge < delay + SHOW_MS);

      if (ready && !nudgeStopped && !reduce) {
        if (!nudgeNext) nudgeNext = now + 700;
        if (now >= nudgeNext && !nudging) { runNudge(); nudgeNext = now + 3600; }
      } else {
        if (nudging) cancelNudge();
        if (!ready) nudgeNext = 0;
      }
    }

    if (env) env.addEventListener('pointerdown', function () { setTap(false); setGlow(false); tapSince = 0; }, true);
    addEventListener('scroll', function () { if (scrollY > 60 && !nudging) { swiped = true; setSwipe(false); } }, { passive: true });
    addEventListener('resize', function () { placeTap(); if (swipeOn) placeSwipe(); });
    placeTap();
    tick();
    setInterval(tick, 150);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
