/* =========================================================
   Seja Seu Olhar · interações da página
   ========================================================= */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  /* ---------- Sempre abrir no começo da página ---------- */
  // O navegador costuma voltar para onde a pessoa parou; aqui a página sempre recomeça no topo
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // Pula direto para o topo (sem a rolagem suave), funcionando também em navegadores antigos
  function irParaTopo() {
    var raiz = document.documentElement;
    raiz.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    raiz.style.scrollBehavior = '';
  }
  if (location.hash) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
  }
  irParaTopo();
  window.addEventListener('load', function () { irParaTopo(); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) irParaTopo(); });

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
  // navegadores antigos sem animação por código: as dúvidas abrem e fecham sem efeito
  var canAnimate = typeof document.body.animate === 'function';
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
      if (reduceMotion || !canAnimate) return;
      var b = el.querySelector('.faq-body');
      var h = b.scrollHeight;
      b.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 300, easing: 'ease' });
    }
    function closeItem(el) {
      if (reduceMotion || !canAnimate) { el.open = false; return; }
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

  /* ---------- Janela de agendamento ---------- */
  var booking = document.getElementById('booking');
  if (booking) {
    var WHATS = 'https://wa.me/5511967213865';
    var form = document.getElementById('booking-form');
    var sheet = booking.querySelector('.booking-sheet');
    var sendBtn = document.getElementById('booking-send');
    var msgBox = document.getElementById('booking-msg');
    var lastFocus = null;

    function valor(nome) {
      var el = form.querySelector('input[name="' + nome + '"]:checked');
      return el ? el.value : '';
    }

    function montarMensagem() {
      var servico = valor('servico');
      var nome = formatarNome(form.elements.nome.value);
      if (!servico || !nomeCompleto(nome)) return '';
      // O que a cliente escolhe vai entre *asteriscos*, que o WhatsApp mostra em negrito
      var linhas = ['Olá, Anne! Meu nome é *' + nome + '* e vim pelo site.'];
      linhas.push(servico === 'avaliacao'
        ? 'Ainda não sei qual procedimento escolher. *Quero uma avaliação.*'
        : 'Quero agendar: *' + servico + '*');
      var dia = valor('dia'), horario = valor('horario');
      if (horario === 'outro') horario = form.elements.horarioOutro.value;
      if (dia) linhas.push('Data de preferência: *' + dia + '*');
      if (horario) linhas.push('Horário: *' + horario + '*');
      var cliente = valor('cliente');
      if (cliente === 'primeira') linhas.push('É a minha *primeira vez* com você.');
      if (cliente === 'ja') linhas.push('*Já sou sua cliente.*');
      var obs = limpar(form.elements.obs.value);
      obs = obs.charAt(0).toUpperCase() + obs.slice(1);
      if (obs) linhas.push('Observação: ' + obs);
      linhas.push(horario ? 'Esse horário está disponível?' : 'Quais horários você tem disponíveis?');
      return linhas.join('\n');
    }

    // Tira espaços sobrando e asteriscos (que bagunçariam o negrito do WhatsApp)
    function limpar(t) {
      return t.replace(/\*/g, '').replace(/\s+/g, ' ').trim();
    }

    // "maria DA silva" -> "Maria da Silva" (da, de, do, das, dos, e ficam minúsculas, como é costume)
    var LIGACOES = ['da', 'de', 'do', 'das', 'dos', 'e', 'di', 'du'];
    function formatarNome(t) {
      return limpar(t).toLowerCase().split(' ').map(function (p, i) {
        if (i > 0 && LIGACOES.indexOf(p) > -1) return p;
        // Também acerta nomes com hífen ou apóstrofo: Ana-Clara, D'Ávila
        return p.replace(/(^|[-'’])(\S)/g, function (m, sep, letra) { return sep + letra.toUpperCase(); });
      }).join(' ');
    }

    // Nome completo = pelo menos duas palavras de verdade (sem contar "da", "de"...), com 2 letras ou mais
    function nomeCompleto(nome) {
      return nome.split(' ').filter(function (p) {
        return LIGACOES.indexOf(p.toLowerCase()) === -1 && p.replace(/[^A-Za-zÀ-ÿ]/g, '').length >= 2;
      }).length >= 2;
    }

    // Prévia na tela: mostra o negrito de verdade em vez dos asteriscos
    function previa(msg) {
      msgBox.textContent = '';
      msg.split(/(\*[^*]+\*)/).forEach(function (parte) {
        if (/^\*[^*]+\*$/.test(parte)) {
          var b = document.createElement('strong');
          b.textContent = parte.slice(1, -1);
          msgBox.appendChild(b);
        } else if (parte) {
          msgBox.appendChild(document.createTextNode(parte));
        }
      });
    }

    /* ---------- Calendário ----------
       FERIADOS: dias em que o estúdio não abre (nacionais, de Sergipe e de Aracaju).
       Formato 'AAAA-MM-DD': 'Nome'. Para fechar um dia a mais (folga, viagem), é só incluir aqui. */
    var FERIADOS = {
      '2026-01-01': 'Confraternização Universal',
      '2026-02-16': 'Carnaval',
      '2026-02-17': 'Carnaval',
      '2026-03-17': 'Aniversário de Aracaju',
      '2026-04-03': 'Sexta-feira Santa',
      '2026-04-05': 'Páscoa',
      '2026-04-21': 'Tiradentes',
      '2026-05-01': 'Dia do Trabalho',
      '2026-06-04': 'Corpus Christi',
      '2026-07-08': 'Emancipação Política de Sergipe',
      '2026-09-07': 'Independência do Brasil',
      '2026-10-12': 'Nossa Senhora Aparecida',
      '2026-11-02': 'Finados',
      '2026-11-15': 'Proclamação da República',
      '2026-11-20': 'Dia da Consciência Negra',
      '2026-12-08': 'Nossa Senhora da Conceição (padroeira de Aracaju)',
      '2026-12-25': 'Natal'
    };
    var DIAS_ABERTOS = [2, 3, 4, 5, 6]; // 0 = domingo ... 6 = sábado (atende de terça a sábado)
    var MESES_A_FRENTE = 3;             // até quantos meses para frente a cliente pode escolher
    var MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    var SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

    var calGrid = document.getElementById('cal-grid');
    var calTitle = document.getElementById('cal-title');
    var calHolidays = document.getElementById('cal-holidays');
    var calValue = document.getElementById('cal-value');
    var calPrev = booking.querySelector('[data-cal="-1"]');
    var calNext = booking.querySelector('[data-cal="1"]');
    var calMes, calAno, calEscolhida = '';

    function dois(n) { return (n < 10 ? '0' : '') + n; }
    function chave(a, m, d) { return a + '-' + dois(m + 1) + '-' + dois(d); }
    function hoje() { var h = new Date(); return new Date(h.getFullYear(), h.getMonth(), h.getDate()); }

    function desenharCalendario() {
      var h = hoje();
      var primeiro = new Date(calAno, calMes, 1).getDay();
      var total = new Date(calAno, calMes + 1, 0).getDate();
      var distancia = (calAno - h.getFullYear()) * 12 + calMes - h.getMonth();
      calTitle.textContent = MESES[calMes].charAt(0).toUpperCase() + MESES[calMes].slice(1) + ' de ' + calAno;
      calPrev.disabled = distancia <= 0;
      calNext.disabled = distancia >= MESES_A_FRENTE;

      calGrid.innerHTML = '';
      calHolidays.innerHTML = '';
      for (var v = 0; v < primeiro; v++) calGrid.appendChild(document.createElement('span'));
      for (var d = 1; d <= total; d++) {
        var data = new Date(calAno, calMes, d);
        var k = chave(calAno, calMes, d);
        var feriado = FERIADOS[k];
        var fechado = DIAS_ABERTOS.indexOf(data.getDay()) === -1;
        // Hoje só fica liberado se ainda sobrar algum horário
        var passou = data < h || (+data === +h && !sobraHorarioHoje());
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'cal-day';
        b.textContent = d;
        b.setAttribute('data-dia', k);
        var rotulo = d + ' de ' + MESES[calMes] + ', ' + SEMANA[data.getDay()];
        if (feriado) {
          b.className += ' is-feriado';
          b.title = feriado;
          rotulo += ', feriado: ' + feriado;
        }
        if (passou || fechado || feriado) {
          b.disabled = true;
          if (!feriado) b.className += ' is-off';
          rotulo += ', indisponível';
        }
        if (k === h.getFullYear() + '-' + dois(h.getMonth() + 1) + '-' + dois(h.getDate())) b.className += ' is-today';
        if (k === calEscolhida) { b.className += ' is-selected'; b.setAttribute('aria-pressed', 'true'); }
        b.setAttribute('aria-label', rotulo);
        calGrid.appendChild(b);

        if (feriado) {
          var li = document.createElement('li');
          li.innerHTML = '<b></b> ';
          li.firstChild.textContent = dois(d) + '/' + dois(calMes + 1);
          li.appendChild(document.createTextNode(feriado));
          calHolidays.appendChild(li);
        }
      }
    }

    function resetarCalendario() {
      var h = hoje();
      calMes = h.getMonth();
      calAno = h.getFullYear();
      calEscolhida = '';
      calValue.value = '';
      outroH = outroM = null;
      desenharCalendario();
      // Fim do mês sem nenhum dia livre: já abre no mês seguinte
      if (!calGrid.querySelector('.cal-day:not(:disabled)')) {
        calMes++;
        if (calMes > 11) { calMes = 0; calAno++; }
        desenharCalendario();
      }
      bloquearHorarios();
    }

    calGrid.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('.cal-day') : e.target;
      if (!b || b.disabled || !b.getAttribute('data-dia')) return;
      // Tocar de novo no dia já escolhido desmarca
      if (b.getAttribute('data-dia') === calEscolhida) {
        calEscolhida = '';
        calValue.checked = false;
        desenharCalendario();
        bloquearHorarios();
        atualizar();
        return;
      }
      calEscolhida = b.getAttribute('data-dia');
      var p = calEscolhida.split('-');
      var data = new Date(+p[0], +p[1] - 1, +p[2]);
      calValue.value = SEMANA[data.getDay()] + ', ' + p[2] + '/' + p[1];
      calValue.checked = true;
      desenharCalendario();
      bloquearHorarios();
      atualizar();
    });

    // Se a data escolhida for hoje, bloqueia os horários que já passaram (com 1 hora de folga)
    function minutos(inp) {
      var m = inp.value.match(/^(\d+)h(\d*)$/);
      return m ? +m[1] * 60 + (+m[2] || 0) : -1;
    }
    function limiteHoje() {
      var agora = new Date();
      return agora.getHours() * 60 + agora.getMinutes() + 60;
    }
    function sobraHorarioHoje() {
      var limite = limiteHoje();
      return [].some.call(form.querySelectorAll('input[name="horario"]'), function (inp) {
        return minutos(inp) >= limite;
      }) || outroLista.some(function (m) { return m >= limite; });
    }
    function bloquearHorarios() {
      var agora = new Date();
      var ehHoje = calEscolhida === chave(agora.getFullYear(), agora.getMonth(), agora.getDate());
      var limite = limiteHoje();
      form.querySelectorAll('input[name="horario"]').forEach(function (inp) {
        var min = minutos(inp);
        var passou = ehHoje && min > -1 && min < limite;
        inp.disabled = !!passou;
        inp.parentNode.classList.toggle('is-off', !!passou);
        if (passou && inp.checked) inp.checked = false;
      });
      outroLimite = ehHoje ? limite : -1;
      if (!outroBox.hidden) ajustarOutro();
      lembrarMarcados();
      mostrarOutro();
    }

    /* OUTRO_HORARIO: botão "Outro horário" — duas rodinhas (hora e minutos) que a cliente arrasta
       para cima ou para baixo, como o despertador do celular. Vai do primeiro ao último horário. */
    var OUTRO_HORARIO = { primeiro: '8h30', ultimo: '17h30', intervalo: 15 };
    var ALTURA_ITEM = 44; // mesma altura de .wheel-item no style.css
    var outroBox = document.getElementById('slot-outro');
    var outroValor = document.getElementById('horario-outro');
    var outroLista = [], outroH = null, outroM = null, outroLimite = -1;
    var HORAS = [], MINS = [];
    (function () {
      var ini = minutos({ value: OUTRO_HORARIO.primeiro }), fim = minutos({ value: OUTRO_HORARIO.ultimo });
      for (var m = ini; m <= fim; m += OUTRO_HORARIO.intervalo) {
        outroLista.push(m);
        if (HORAS.indexOf(Math.floor(m / 60)) === -1) HORAS.push(Math.floor(m / 60));
        if (MINS.indexOf(m % 60) === -1) MINS.push(m % 60);
      }
      MINS.sort(function (a, b) { return a - b; });
    })();
    function livre(m) { return outroLista.indexOf(m) > -1 && m >= outroLimite; }
    function horaLivre(h) { return MINS.some(function (mm) { return livre(h * 60 + mm); }); }

    // Monta uma rodinha: lista que rola e "encaixa" no item do meio
    function criarRoda(el, valores, texto, ehHora) {
      var roda = { el: el, valores: valores, idx: 0, ehHora: ehHora, timer: null };
      valores.forEach(function (v, i) {
        var item = document.createElement('div');
        item.className = 'wheel-item';
        item.textContent = texto(v);
        item.addEventListener('click', function () { if (!roda.arrastou) irPara(roda, i, true); });
        el.appendChild(item);
      });
      el.addEventListener('scroll', function () {
        destacar(roda, Math.round(el.scrollTop / ALTURA_ITEM));
        clearTimeout(roda.timer);
        roda.timer = setTimeout(function () { if (!roda.segurando) assentar(roda); }, 130);
      });
      // Setas do teclado
      el.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        irPara(roda, Math.max(0, Math.min(valores.length - 1, roda.idx + d)), true);
      });
      // No computador: arrastar com o mouse (no celular o dedo já rola sozinho)
      el.addEventListener('mousedown', function (e) {
        var y0 = e.clientY, top0 = el.scrollTop;
        roda.segurando = true;
        roda.arrastou = false;
        el.classList.add('is-dragging');
        function mover(ev) {
          if (Math.abs(ev.clientY - y0) > 3) roda.arrastou = true;
          el.scrollTop = top0 - (ev.clientY - y0);
        }
        function soltar() {
          document.removeEventListener('mousemove', mover);
          document.removeEventListener('mouseup', soltar);
          el.classList.remove('is-dragging');
          roda.segurando = false;
          irPara(roda, Math.round(el.scrollTop / ALTURA_ITEM), true);
          setTimeout(function () { roda.arrastou = false; }, 0);
        }
        document.addEventListener('mousemove', mover);
        document.addEventListener('mouseup', soltar);
        e.preventDefault();
      });
      return roda;
    }

    function destacar(roda, i) {
      [].forEach.call(roda.el.children, function (item, j) {
        item.classList.toggle('is-center', i === j);
        var ok = roda.ehHora ? horaLivre(roda.valores[j]) : outroH !== null && livre(outroH * 60 + roda.valores[j]);
        item.classList.toggle('is-off', !ok);
      });
    }

    function irPara(roda, i, suave) {
      roda.idx = i;
      destacar(roda, i);
      if (suave && roda.el.scrollTo) {
        try { roda.el.scrollTo({ top: i * ALTURA_ITEM, behavior: 'smooth' }); return; } catch (err) {}
      }
      roda.el.scrollTop = i * ALTURA_ITEM;
    }

    // Item livre mais perto do índice i (para pular horários que não existem ou já passaram)
    function maisPerto(valores, i, ok) {
      for (var d = 0; d < valores.length; d++) {
        if (i + d < valores.length && ok(valores[i + d])) return i + d;
        if (i - d >= 0 && ok(valores[i - d])) return i - d;
      }
      return -1;
    }

    // Quando a rodinha para: confere se o horário existe e, se não, encaixa no mais perto
    function assentar(roda) {
      var i = Math.max(0, Math.min(roda.valores.length - 1, Math.round(roda.el.scrollTop / ALTURA_ITEM)));
      if (roda.ehHora) {
        var hi = maisPerto(HORAS, i, horaLivre);
        if (hi < 0) return;
        outroH = HORAS[hi];
        if (hi !== i || roda.el.scrollTop !== hi * ALTURA_ITEM) irPara(roda, hi, true);
        else roda.idx = hi;
        // Usa a posição real da rodinha de minutos (ela pode estar girando ao mesmo tempo)
        var mAtual = Math.max(0, Math.min(MINS.length - 1, Math.round(rodaMin.el.scrollTop / ALTURA_ITEM)));
        var mi = maisPerto(MINS, mAtual, function (mm) { return livre(outroH * 60 + mm); });
        outroM = MINS[mi];
        if (rodaMin.idx !== mi || rodaMin.el.scrollTop !== mi * ALTURA_ITEM) irPara(rodaMin, mi, true);
        else destacar(rodaMin, mi);
      } else {
        var m = maisPerto(MINS, i, function (mm) { return livre(outroH * 60 + mm); });
        if (m < 0) return;
        outroM = MINS[m];
        if (m !== i || roda.el.scrollTop !== m * ALTURA_ITEM) irPara(roda, m, true);
        else roda.idx = m;
      }
      gravarOutro();
    }

    function gravarOutro() {
      var t = outroH !== null && outroM !== null ? outroH + 'h' + dois(outroM) : '';
      document.getElementById('picker-h').textContent = outroH === null ? '--' : outroH;
      document.getElementById('picker-m').textContent = outroM === null ? '--' : dois(outroM);
      rodaHora.el.setAttribute('aria-valuetext', outroH === null ? '' : outroH + ' horas');
      rodaMin.el.setAttribute('aria-valuetext', outroM === null ? '' : dois(outroM) + ' minutos');
      if (outroValor.value !== t) {
        outroValor.value = t;
        atualizar();
      }
    }

    var rodaHora = criarRoda(document.getElementById('wheel-h'), HORAS, function (h) { return dois(h); }, true);
    var rodaMin = criarRoda(document.getElementById('wheel-m'), MINS, function (m) { return dois(m); }, false);

    // Coloca as rodinhas no horário atual (ou no primeiro livre) — só funciona com a caixa visível
    function ajustarOutro() {
      if (outroH === null || outroM === null || !livre(outroH * 60 + outroM)) {
        var primeiro = outroLista.filter(function (m) { return m >= outroLimite; })[0];
        if (primeiro === undefined) return;
        outroH = Math.floor(primeiro / 60);
        outroM = primeiro % 60;
      }
      irPara(rodaHora, HORAS.indexOf(outroH), false);
      irPara(rodaMin, MINS.indexOf(outroM), false);
      gravarOutro();
    }

    function mostrarOutro() {
      var abrir = valor('horario') === 'outro';
      var estavaFechado = outroBox.hidden;
      outroBox.hidden = !abrir;
      if (abrir && estavaFechado) ajustarOutro();
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'horario') mostrarOutro();
    });
    [calPrev, calNext].forEach(function (btn) {
      btn.addEventListener('click', function () {
        calMes += +btn.getAttribute('data-cal');
        if (calMes < 0) { calMes = 11; calAno--; }
        if (calMes > 11) { calMes = 0; calAno++; }
        desenharCalendario();
      });
    });

    function atualizar() {
      var msg = montarMensagem();
      var ok = !!msg;
      if (ok) previa(msg);
      else msgBox.textContent = !valor('servico')
        ? 'Escolha o procedimento e escreva seu nome para montar sua mensagem.'
        : (limpar(form.elements.nome.value) ? 'Escreva seu nome completo, com sobrenome (passo 4).' : 'Falta só escrever o seu nome completo (passo 4).');
      sendBtn.href = ok ? WHATS + '?text=' + encodeURIComponent(msg) : '#';
      sendBtn.classList.toggle('is-disabled', !ok);
      sendBtn.setAttribute('aria-disabled', ok ? 'false' : 'true');
    }

    function abrir(preServico) {
      lastFocus = document.activeElement;
      if (document.body.classList.contains('menu-open')) setMenu(false);
      // Abre sem nada marcado para a cliente escolher; só o botão do UP EYES já vem com ele marcado
      form.reset();
      resetarCalendario();
      try { form.elements.nome.value = localStorage.getItem('ssoNome') || ''; } catch (err) {}
      if (preServico) {
        var alvo = form.querySelector('input[name="servico"][value="' + preServico + '"]');
        if (alvo) alvo.checked = true;
      }
      lembrarMarcados();
      atualizar();
      booking.classList.add('is-open');
      booking.setAttribute('aria-hidden', 'false');
      document.body.classList.add('booking-open');
      sheet.scrollTop = 0;
      setTimeout(function () { sheet.focus(); }, 50);
    }

    function fechar() {
      booking.classList.remove('is-open');
      booking.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('booking-open');
      if (lastFocus) lastFocus.focus();
    }

    // Botões de agendar abrem a janela (links só com o número continuam abrindo o WhatsApp direto)
    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      if (booking.contains(a)) return;
      if (!a.matches('.btn, .floating-cta, .link-underline')) return;
      a.addEventListener('click', function (e) {
        e.preventDefault();
        abrir(a.textContent.indexOf('Quero o meu UP EYES') > -1 ? 'Método UP EYES' : '');
      });
    });

    form.addEventListener('change', atualizar);

    // Marcar e desmarcar: tocar de novo num botão já marcado tira a marcação
    var marcados = {};
    function lembrarMarcados() {
      marcados = {};
      form.querySelectorAll('input[type="radio"]:checked').forEach(function (inp) { marcados[inp.name] = inp; });
    }
    form.addEventListener('click', function (e) {
      var inp = e.target;
      if (!inp || inp.type !== 'radio' || inp === calValue) return;
      if (marcados[inp.name] === inp && inp.checked) {
        inp.checked = false;
        marcados[inp.name] = null;
        var ev;
        try { ev = new Event('change', { bubbles: true }); }
        catch (err) { ev = document.createEvent('Event'); ev.initEvent('change', true, true); }
        inp.dispatchEvent(ev);
      } else {
        marcados[inp.name] = inp;
      }
    });
    var campoNome = form.elements.nome;
    form.addEventListener('input', function (e) {
      if (e.target === campoNome) {
        campoNome.classList.remove('is-invalid');
        // Enquanto digita: deixa maiúscula a primeira letra de cada palavra, sem mexer no cursor
        var pos = campoNome.selectionStart;
        var novo = campoNome.value
          .replace(/(^|[\s-])(\S)/g, function (m, sep, letra) { return sep + letra.toUpperCase(); })
          .replace(/(\s)(Da|De|Do|Das|Dos|E|Di|Du)(?=\s)/g, function (m, sep, p) { return sep + p.toLowerCase(); });
        if (novo !== campoNome.value) {
          campoNome.value = novo;
          try { campoNome.setSelectionRange(pos, pos); } catch (err) {}
        }
      }
      atualizar();
    });
    // Ao sair do campo: arruma de vez (tira espaços sobrando e deixa "da", "de", "dos" minúsculos)
    campoNome.addEventListener('blur', function () {
      campoNome.value = formatarNome(campoNome.value);
      atualizar();
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    sendBtn.addEventListener('click', function (e) {
      if (sendBtn.classList.contains('is-disabled')) {
        e.preventDefault();
        if (!valor('servico')) form.querySelector('input[name="servico"]').focus();
        else { form.elements.nome.classList.add('is-invalid'); form.elements.nome.focus(); }
        return;
      }
      // Guarda o nome neste aparelho para já vir preenchido na próxima visita
      try { localStorage.setItem('ssoNome', formatarNome(form.elements.nome.value)); } catch (err) {}
      setTimeout(fechar, 300);
    });
    booking.querySelectorAll('[data-booking-close]').forEach(function (el) {
      el.addEventListener('click', fechar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && booking.classList.contains('is-open')) fechar();
    });
  }

  /* ---------- Ano no rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
