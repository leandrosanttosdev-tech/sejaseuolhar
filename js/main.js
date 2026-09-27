/* =========================================================
   Seja Seu Olhar · interações da página
   ========================================================= */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var header = document.getElementById('site-header');
  var hero = document.getElementById('topo');
  var floating = document.getElementById('floating-cta');
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('nav');

  /* ---------- Menu fixo: fica sólido ao rolar ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', y > 40);

    // Botão flutuante aparece depois do topo e some na chamada final
    var heroEnd = hero ? hero.offsetHeight - 120 : 600;
    var finalCta = document.getElementById('agendar');
    var nearEnd = finalCta && finalCta.getBoundingClientRect().top < window.innerHeight * 0.8;
    var show = y > heroEnd && !nearEnd;
    floating.classList.toggle('is-visible', show);
    floating.setAttribute('aria-hidden', show ? 'false' : 'true');
    floating.tabIndex = show ? 0 : -1;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu do celular ---------- */
  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menuBtn.querySelector('use').setAttribute('href', open ? '#i-close' : '#i-menu');
  }
  menuBtn.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  /* ---------- Link do menu destacado conforme a seção ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = '#' + entry.target.id;
        navLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('href') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (l) {
      var target = document.querySelector(l.getAttribute('href'));
      if (target) sectionObserver.observe(target);
    });
  }

  /* ---------- Antes e depois (barra deslizante) ---------- */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba-range');
    function update() { ba.style.setProperty('--pos', range.value + '%'); }
    range.addEventListener('input', update);
    range.addEventListener('pointerdown', function () { ba.classList.add('is-dragging'); });
    ['pointerup', 'pointercancel', 'blur'].forEach(function (ev) {
      range.addEventListener(ev, function () { ba.classList.remove('is-dragging'); });
    });
    update();
  });

  /* ---------- Dúvidas: abre uma de cada vez, com animação ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var faqItems = document.querySelectorAll('#faq details');
  faqItems.forEach(function (item) {
    var summary = item.querySelector('summary');
    var body = item.querySelector('.faq-body');

    summary.addEventListener('click', function (e) {
      e.preventDefault();
      var willOpen = !item.open;

      // fecha as outras
      faqItems.forEach(function (other) {
        if (other !== item && other.open) closeItem(other);
      });

      if (willOpen) openItem(item); else closeItem(item);
    });

    function openItem(el) {
      el.open = true;
      if (reduceMotion) return;
      var b = el.querySelector('.faq-body');
      var h = b.scrollHeight;
      b.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 300, easing: 'ease' });
    }
    function closeItem(el) {
      if (reduceMotion) { el.open = false; return; }
      var b = el.querySelector('.faq-body');
      var anim = b.animate([{ height: b.scrollHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 250, easing: 'ease' });
      anim.onfinish = function () { el.open = false; };
    }
    body.dataset.ready = '1';
  });

  /* ---------- Abertura (cortina rosa) e entrada do topo ---------- */
  var intro = document.getElementById('intro');
  function startHero() { document.body.classList.add('is-loaded'); }
  if (reduceMotion || !intro) {
    if (intro) intro.remove();
    startHero();
  } else {
    document.body.style.overflow = 'hidden';
    var introDone = false;
    var finishIntro = function () {
      if (introDone) return;
      introDone = true;
      intro.classList.add('is-done');
      document.body.style.overflow = '';
      setTimeout(startHero, 150);
      setTimeout(function () { intro.remove(); }, 800);
    };
    // espera a foto principal carregar (no máximo 2,2 s)
    var heroImg = document.querySelector('.hero-photo');
    var minTime = new Promise(function (r) { setTimeout(r, 900); });
    var imgReady = new Promise(function (r) {
      if (!heroImg || heroImg.complete) r();
      else { heroImg.addEventListener('load', r); heroImg.addEventListener('error', r); }
    });
    Promise.all([minTime, imgReady]).then(finishIntro);
    setTimeout(finishIntro, 1800);
  }

  /* ---------- Barra de progresso + parallax ---------- */
  var progress = document.getElementById('progress');
  var parallaxEls = (reduceMotion || window.innerWidth <= 900) ? [] : Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function onFrame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    var vh = window.innerHeight;
    parallaxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0;
      var center = r.top + r.height / 2 - vh / 2;
      el.style.setProperty('--py', (-center * speed).toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onFrame); }
  }, { passive: true });
  onFrame();

  /* ---------- Brilho que segue o mouse nos cartões ---------- */
  document.querySelectorAll('.card, .quote').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Entrada em cascata: cartões lado a lado aparecem um após o outro ---------- */
  document.querySelectorAll('.cards-3, .services, .steps, .ba-grid, .trust-grid').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.transitionDelay = (i * 0.12) + 's';
      var media = child.querySelector('.img-reveal');
      if (media) media.style.setProperty('--delay', (i * 0.12 + 0.15) + 's');
    });
  });

  /* ---------- Contador de seguidoras ---------- */
  function runCount(el) {
    var to = parseInt(el.getAttribute('data-to'), 10) || 0;
    var start = null;
    function step(t) {
      if (!start) start = t;
      var k = Math.min((t - start) / 1600, 1);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * eased).toLocaleString('pt-BR');
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // garante o número final mesmo se a aba estiver em segundo plano
    setTimeout(function () { el.textContent = to.toLocaleString('pt-BR'); }, 1800);
  }

  /* ---------- Antes e depois: a barra desliza sozinha uma vez para mostrar que é arrastável ---------- */
  function nudge(ba) {
    var range = ba.querySelector('.ba-range');
    if (!range || ba.dataset.nudged) return;
    ba.dataset.nudged = '1';
    var seq = [30, 70, 50];
    ba.classList.add('is-nudging');
    seq.forEach(function (v, i) {
      setTimeout(function () {
        if (ba.classList.contains('is-dragging')) return;
        range.value = v;
        ba.style.setProperty('--pos', v + '%');
        if (i === seq.length - 1) setTimeout(function () { ba.classList.remove('is-nudging'); }, 950);
      }, 700 + i * 950);
    });
  }

  /* ---------- Animação de entrada ao rolar ---------- */
  var reveals = document.querySelectorAll('.reveal, .img-reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          if (entry.target.classList.contains('ba')) nudge(entry.target);
          // depois da entrada, tira o atraso para o efeito de passar o mouse ficar imediato
          var el = entry.target;
          setTimeout(function () { el.style.transitionDelay = ''; }, 1600);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    // Fotos com "cortina": começam 100% recortadas e o navegador as trata como
    // invisíveis, então observamos o elemento pai no lugar delas.
    var photoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.img-reveal').forEach(function (img) {
          if (img.parentElement === entry.target) img.classList.add('is-in');
        });
        photoObserver.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    document.querySelectorAll('.img-reveal').forEach(function (el) { photoObserver.observe(el.parentElement); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // contador começa junto com a entrada do topo
  if (!reduceMotion) {
    var counters = document.querySelectorAll('.count');
    var waitHero = setInterval(function () {
      if (!document.body.classList.contains('is-loaded')) return;
      clearInterval(waitHero);
      setTimeout(function () { counters.forEach(runCount); }, 900);
    }, 100);
  }

  /* ---------- Vídeos: leves para o celular ----------
     - só baixa o vídeo quando a cliente chega perto da seção
     - toca sem som só enquanto está na tela; pausa ao sair
     - internet lenta, modo economia de dados ou "menos movimento":
       não baixa sozinho, mostra o botão de play para tocar
     - se o arquivo ainda não existe, fica o espaço reservado */
  var reels = Array.prototype.slice.call(document.querySelectorAll('.reel'));
  var conn = navigator.connection || {};
  var lowData = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
  var autoVideo = !reduceMotion && !lowData;

  function loadReel(reel) {
    var v = reel.querySelector('video');
    if (!v || v.getAttribute('src')) return;
    v.addEventListener('loadeddata', function () { reel.classList.add('is-ready'); }, { once: true });
    v.addEventListener('error', function () { reel.classList.remove('is-ready'); }, { once: true });
    v.src = v.getAttribute('data-src');
    v.load();
  }
  function playReel(reel) {
    var v = reel.querySelector('video');
    if (!v) return;
    loadReel(reel);
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  reels.forEach(function (reel) {
    var v = reel.querySelector('video');
    var btn = reel.querySelector('.reel-btn');
    // botão de som
    btn.addEventListener('click', function () {
      v.muted = !v.muted;
      if (!v.muted) {
        // só um vídeo com som por vez
        reels.forEach(function (r) {
          var o = r.querySelector('video');
          if (o !== v) { o.muted = true; r.querySelector('.reel-btn use').setAttribute('href', '#i-sound-off'); }
        });
        playReel(reel);
      }
      btn.querySelector('use').setAttribute('href', v.muted ? '#i-sound-off' : '#i-sound-on');
      btn.setAttribute('aria-label', v.muted ? 'Ligar o som' : 'Desligar o som');
    });
    // sem autoplay: toque no espaço para carregar e tocar
    if (!autoVideo) {
      reel.classList.add('needs-tap');
      reel.querySelector('.reel-ph').addEventListener('click', function () { playReel(reel); });
    }
  });

  if (reels.length && 'IntersectionObserver' in window) {
    if (autoVideo) {
      // começa a baixar um pouco antes de aparecer
      var preloadObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { loadReel(e.target); preloadObs.unobserve(e.target); }
        });
      }, { rootMargin: '300px 0px' });
      reels.forEach(function (r) { preloadObs.observe(r); });
    }
    // toca/pausa conforme aparece na tela
    var playObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target.querySelector('video');
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          if (autoVideo || v.getAttribute('src')) playReel(e.target);
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: [0, 0.5] });
    reels.forEach(function (r) { playObs.observe(r); });
  }

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
