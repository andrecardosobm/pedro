/*
 * Carrossel de fotos (até 5)
 * --------------------------
 * Procura sozinho as fotos img/foto1 ... img/foto5 (.jpg, .jpeg, .png ou .webp)
 * e mostra só as que existirem, na ordem do número.
 * Para adicionar uma foto, basta enviar o arquivo com um desses nomes.
 */
(function () {
  'use strict';

  var CONFIG = {
    max: 5,
    folder: 'img/',
    prefix: 'foto',
    extensions: ['jpg', 'jpeg', 'png', 'webp'],
    // descrição de cada foto para leitores de tela (opcional), pelo número da foto
    alts: {
      1: 'Bandeja com hambúrgueres, batatas fritas com molho de queijo e uma lata de refrigerante'
    }
  };

  var root = document.querySelector('.carousel');
  if (!root) return;
  var track = root.querySelector('.carousel__track');
  var prevBtn = root.querySelector('.carousel__btn--prev');
  var nextBtn = root.querySelector('.carousel__btn--next');
  var dotsBox = root.querySelector('.carousel__dots');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Testa as extensões em ordem até achar o arquivo da foto n.
  function find(n) {
    return new Promise(function (resolve) {
      var i = 0;
      (function tryNext() {
        if (i >= CONFIG.extensions.length) { resolve(null); return; }
        var src = CONFIG.folder + CONFIG.prefix + n + '.' + CONFIG.extensions[i++];
        var probe = new Image();
        probe.onload = function () { resolve({ n: n, src: src }); };
        probe.onerror = tryNext;
        probe.src = src;
      })();
    });
  }

  var searches = [];
  for (var n = 1; n <= CONFIG.max; n++) searches.push(find(n));
  Promise.all(searches).then(function (found) {
    build(found.filter(Boolean));
  });

  function build(photos) {
    if (!photos.length) return;
    var slides = [];
    var dots = [];
    var index = 0;

    photos.forEach(function (photo, i) {
      var slide = document.createElement('div');
      slide.className = 'slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', (i + 1) + ' de ' + photos.length);

      var bg = document.createElement('div');
      bg.className = 'slide__bg';
      bg.style.backgroundImage = 'url("' + photo.src + '")';

      var img = document.createElement('img');
      img.src = photo.src;
      img.alt = CONFIG.alts[photo.n] || ('Foto ' + (i + 1));
      img.decoding = 'async';

      slide.appendChild(bg);
      slide.appendChild(img);
      track.appendChild(slide);
      slides.push(slide);
    });

    var fallback = track.querySelector('noscript');
    if (fallback) fallback.remove();

    if (slides.length < 2) return; // uma foto só: sem setas nem bolinhas

    photos.forEach(function (photo, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot';
      dot.setAttribute('aria-label', 'Ir para a foto ' + (i + 1));
      dot.addEventListener('click', function () { go(i); });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });
    root.classList.add('carousel--multi');

    function update() {
      for (var k = 0; k < dots.length; k++) {
        dots[k].setAttribute('aria-current', k === index ? 'true' : 'false');
      }
    }

    function go(i) {
      index = (i + slides.length) % slides.length; // dá a volta nas pontas
      track.scrollTo({ left: index * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
      update();
    }

    prevBtn.addEventListener('click', function () { go(index - 1); });
    nextBtn.addEventListener('click', function () { go(index + 1); });

    // acompanha o deslizar com o dedo / trackpad
    var ticking = false;
    track.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        var i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== index && i >= 0 && i < slides.length) { index = i; update(); }
      });
    }, { passive: true });

    // setas do teclado (depois que a animação de abertura terminar)
    window.addEventListener('keydown', function (ev) {
      if (document.documentElement.classList.contains('intro-lock')) return;
      if (ev.key === 'ArrowRight') { ev.preventDefault(); go(index + 1); }
      else if (ev.key === 'ArrowLeft') { ev.preventDefault(); go(index - 1); }
    });

    // mantém a foto atual ao girar o celular ou redimensionar a janela
    window.addEventListener('resize', function () {
      track.scrollTo({ left: index * track.clientWidth, behavior: 'auto' });
    });

    update();
  }
})();
