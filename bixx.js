/* ==========================================================================
   BIXXVILLE — shared behavior
   ========================================================================== */
(function(){
  'use strict';

  /* ----- slide-out menu ----- */
  var menu = document.getElementById('menu');
  var hamBtn = document.getElementById('hamBtn');
  var menuClose = document.getElementById('menuClose');
  function openMenu(){ if(menu){ menu.classList.add('open'); menu.setAttribute('aria-hidden','false'); } }
  function closeMenu(){ if(menu){ menu.classList.remove('open'); menu.setAttribute('aria-hidden','true'); } }
  if(hamBtn) hamBtn.addEventListener('click', openMenu);
  if(menuClose) menuClose.addEventListener('click', closeMenu);
  if(menu) menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });

  /* ----- reveal on scroll ----- */
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});

    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });

    /* sections carry .in so their child .pop svg nodes animate */
    var sio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); sio.unobserve(e.target); }
      });
    }, {threshold:0.1});
    document.querySelectorAll('.scene').forEach(function(el){ sio.observe(el); });
  } else {
    document.querySelectorAll('.rv,.scene').forEach(function(el){ el.classList.add('in'); });
  }

  /* ----- first screen reveals immediately ----- */
  var hero = document.querySelector('.hero');
  if(hero){
    hero.classList.add('in');
    hero.querySelectorAll('.rv').forEach(function(el){ el.classList.add('in'); });
  }

  /* ----- mark the current page in nav ----- */
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.navlinks a, .menu a').forEach(function(a){
    var href = (a.getAttribute('href') || '').toLowerCase();
    if(href === here) a.classList.add('on');
  });

  /* ----- tap-to-flip tiles (roles) ----- */
  var flippables = document.querySelectorAll('.ctile');
  if(flippables.length){
    flippables.forEach(function(el){
      el.addEventListener('click', function(){
        var already = el.classList.contains('flipped');
        flippables.forEach(function(o){ if(o !== el) o.classList.remove('flipped'); });
        el.classList.toggle('flipped', !already);
      });
      el.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); }
      });
    });
    document.addEventListener('click', function(e){
      if(!e.target.closest('.ctile')){
        flippables.forEach(function(o){ o.classList.remove('flipped'); });
      }
    });
  }

  /* ----- live cycle counter (Genesis 27 Feb 2025, 28-day cycles) ----- */
  var cycleEls = document.querySelectorAll('[data-cycle]');
  if(cycleEls.length){
    var GENESIS = Date.UTC(2025, 1, 27);
    var days = Math.floor((Date.now() - GENESIS) / 86400000);
    var cycleNum = Math.floor(days / 28) + 1;
    var dayIn = (days % 28) + 1;
    cycleEls.forEach(function(el){
      var mode = el.getAttribute('data-cycle');
      if(mode === 'num') el.textContent = cycleNum;
      else if(mode === 'day') el.textContent = dayIn;
      else el.textContent = 'Cycle ' + cycleNum + ' · day ' + dayIn + ' of 28';
    });
  }

  /* ----- 28-day cycle track ----- */
  var track = document.getElementById('cycleTrack');
  if(track){
    var g2 = Date.UTC(2025, 1, 27);
    var d2 = Math.floor((Date.now() - g2) / 86400000);
    var dayInCycle = (d2 % 28) + 1;
    for(var i = 1; i <= 28; i++){
      var t = document.createElement('div');
      t.className = 'ctick' + (i < dayInCycle ? ' past' : i === dayInCycle ? ' now' : '');
      track.appendChild(t);
    }
  }

  /* ----- LOG price calculator ----- */
  var tierSel = document.getElementById('calcTier');
  if(tierSel){
    var logsInp = document.getElementById('calcLogs');
    var payoutEl = document.getElementById('calcPayout');
    var priceEl = document.getElementById('calcPrice');
    var resEl = document.getElementById('calcReserve');
    var fmt = function(n){ return '$' + Math.round(n).toLocaleString('en-US'); };
    var recalc = function(){
      var rate = parseFloat(tierSel.value) || 0;
      var logs = parseFloat(logsInp.value) || 0;
      var labor = rate * logs;
      var price = labor / 0.75;
      if(payoutEl) payoutEl.textContent = fmt(labor);
      if(priceEl) priceEl.textContent = fmt(price);
      if(resEl) resEl.textContent = fmt(price - labor);
    };
    tierSel.addEventListener('change', recalc);
    if(logsInp) logsInp.addEventListener('input', recalc);
    recalc();
  }

})();
