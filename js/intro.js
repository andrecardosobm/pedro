/*
 * Animação de abertura
 * ---------------------
 * Desenha em <canvas> um esfíncter estilizado (pregas radiais em volta de um
 * orifício) que se dilata até ocupar a tela inteira e revelar o site.
 *
 * Ajustes rápidos estão em CONFIG, logo abaixo.
 */
(function () {
  'use strict';

  var CONFIG = {
    holdMs: 700,       // tempo "fechado", com uma leve contração, antes de abrir
    openMs: 1500,      // duração da dilatação
    folds: 11,         // número de pregas principais
    onlyOncePerSession: false // true = só mostra na primeira visita da sessão
  };

  var root = document.documentElement;
  var overlay = document.getElementById('intro');
  if (!overlay) return;

  var skipBtn = document.getElementById('intro-skip');
  var finished = false;

  function finish(instant) {
    if (finished) return;
    finished = true;
    root.classList.remove('intro-lock', 'intro-opening');
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', resize);
    if (skipBtn) skipBtn.remove();
    if (instant) { overlay.remove(); return; }
    overlay.classList.add('intro--fade');
    setTimeout(function () { overlay.remove(); }, 450);
  }

  function seen() {
    try { return sessionStorage.getItem('introSeen') === '1'; } catch (e) { return false; }
  }
  function markSeen() {
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) { /* sem storage */ }
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = overlay.querySelector('canvas');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

  if (reduceMotion || !ctx || (CONFIG.onlyOncePerSession && seen())) {
    finish(true);
    return;
  }
  markSeen();
  root.classList.add('intro-lock');

  // ---------- geometria ----------
  var W, H, cx, cy, minD, maxR, R0;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H / 2;
    minD = Math.min(W, H);
    maxR = Math.hypot(W, H) / 2;
    R0 = Math.max(9, minD * 0.022);
  }
  resize();
  window.addEventListener('resize', resize);

  // Pregas com pequenas irregularidades para parecer orgânico.
  var TAU = Math.PI * 2;
  var folds = [];
  for (var i = 0; i < CONFIG.folds; i++) {
    folds.push({
      phi: (i / CONFIG.folds) * TAU + (Math.random() - 0.5) * 0.22,
      len: 0.7 + Math.random() * 0.45,
      width: 0.8 + Math.random() * 0.5,
      curve: (Math.random() - 0.5) * 0.35,
      lobe: 0.85 + Math.random() * 0.3,
      minorU: 0.35 + Math.random() * 0.3,
      minorLen: 0.3 + Math.random() * 0.25
    });
  }
  folds.sort(function (a, b) { return a.phi - b.phi; });

  // ---------- utilidades ----------
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + clamp(a, 0, 1).toFixed(3) + ')'; }

  var CREASE = [74, 16, 28];
  var SHINE = [255, 222, 212];
  var DEEP = [28, 5, 10];

  // Contorno do orifício: lóbulos arredondados entre as pregas, vales em "V".
  function holePath(R, a, rot) {
    ctx.beginPath();
    var n = folds.length;
    var steps = 26;
    for (var j = 0; j < n; j++) {
      var f0 = folds[j];
      var f1 = folds[(j + 1) % n];
      var p0 = f0.phi + rot;
      var p1 = f1.phi + rot + (j === n - 1 ? TAU : 0);
      for (var s = 0; s < steps; s++) {
        var u = s / steps;
        var ang = p0 + (p1 - p0) * u;
        var bump = Math.pow(Math.sin(Math.PI * u), 0.55) * f0.lobe;
        var r = R * (1 - a + a * bump);
        var x = cx + Math.cos(ang) * r;
        var y = cy + Math.sin(ang) * r;
        if (j === 0 && s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
  }

  // Sulco afilado que sai do orifício para fora.
  function streak(phi, r0, len, w, curve, color, alpha) {
    if (alpha <= 0.002 || len <= 1) return;
    var n = 12, left = [], right = [];
    for (var k = 0; k <= n; k++) {
      var s = k / n;
      var ang = phi + curve * s * s;
      var r = r0 + len * s;
      var x = cx + Math.cos(ang) * r;
      var y = cy + Math.sin(ang) * r;
      var half = w * Math.pow(1 - s, 0.8) * 0.5 + 0.25;
      var px = -Math.sin(ang) * half;
      var py = Math.cos(ang) * half;
      left.push(x + px, y + py);
      right.push(x - px, y - py);
    }
    ctx.beginPath();
    ctx.moveTo(left[0], left[1]);
    for (var m = 2; m < left.length; m += 2) ctx.lineTo(left[m], left[m + 1]);
    for (var q = right.length - 2; q >= 0; q -= 2) ctx.lineTo(right[q], right[q + 1]);
    ctx.closePath();
    var g = ctx.createLinearGradient(left[0], left[1], left[left.length - 2], left[left.length - 1]);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(0.6, rgba(color, alpha * 0.45));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g;
    ctx.fill();
  }

  function skin(R) {
    var outer = R + minD * 0.95;
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, outer);
    var stops = [
      [0, '#3e0f1a'],
      [R, '#6a2030'],
      [R + minD * 0.06, '#94404f'],
      [R + minD * 0.2, '#bf6f75'],
      [R + minD * 0.45, '#d89a90'],
      [outer, '#e7b8a8']
    ];
    var last = 0;
    for (var k = 0; k < stops.length; k++) {
      var f = Math.max(last, clamp(stops[k][0] / outer, 0, 1));
      g.addColorStop(f, stops[k][1]);
      last = f;
    }
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // luz suave vinda de cima à esquerda
    var lx = cx - minD * 0.28, ly = cy - minD * 0.32;
    var light = ctx.createRadialGradient(lx, ly, 0, lx, ly, minD * 0.75);
    light.addColorStop(0, 'rgba(255,236,226,0.16)');
    light.addColorStop(1, 'rgba(255,236,226,0)');
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, W, H);

    // vinheta
    var v = ctx.createRadialGradient(cx, cy, R + minD * 0.25, cx, cy, Math.max(maxR * 1.15, R + minD * 0.3));
    v.addColorStop(0, 'rgba(40,8,16,0)');
    v.addColorStop(1, 'rgba(40,8,16,0.5)');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  }

  // ---------- quadro ----------
  function draw(t) {
    var R, a, rot, lenScale, foldAlpha, dark, e;

    if (t < CONFIG.holdMs) {
      // fechado: uma leve contração ("piscada") antes de abrir
      var h = Math.sin(Math.PI * (t / CONFIG.holdMs));
      R = R0 * (1 - 0.22 * h);
      a = 0.62 + 0.08 * h;
      rot = 0;
      lenScale = 1 + 0.1 * h;
      foldAlpha = 1;
      dark = 1;
      e = 0;
    } else {
      var p = clamp((t - CONFIG.holdMs) / CONFIG.openMs, 0, 1);
      var aEnd = 0.03;
      var Rend = ((maxR + minD * 0.2) / (1 - aEnd)) * 1.35;
      var eLog = easeInOutSine(p);
      e = easeOutCubic(p);
      R = R0 * Math.pow(Rend / R0, eLog);       // dilatação em escala logarítmica
      a = aEnd + (0.62 - aEnd) * Math.pow(1 - eLog, 3.4);
      rot = 0.3 * eLog;
      lenScale = 1 - 0.35 * eLog;
      foldAlpha = Math.pow(1 - eLog, 1.4);
      dark = Math.pow(1 - clamp(p / 0.4, 0, 1), 2);
      if (p > 0.25 && skipBtn) skipBtn.classList.add('is-hidden');
      if (R * (1 - a) > maxR + minD * 0.12 || p >= 1) return false;
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    skin(R);

    var rValley = R * (1 - a);
    var n = folds.length;

    // relevo: brilho sobre as pregas (entre os sulcos)
    for (var j = 0; j < n; j++) {
      var f = folds[j];
      var nx = folds[(j + 1) % n].phi + (j === n - 1 ? TAU : 0);
      var mid = (f.phi + nx) / 2 + rot;
      var L = (minD * 0.2 * f.len * lenScale + R * 0.25);
      streak(mid, R * 1.02, L * 0.75, (9 + R * 0.09) * f.width, f.curve * 0.8, SHINE, 0.2 * foldAlpha);
    }

    // sulcos principais e secundários
    for (var k = 0; k < n; k++) {
      var fk = folds[k];
      var nk = folds[(k + 1) % n].phi + (k === n - 1 ? TAU : 0);
      var Lk = (minD * 0.2 * fk.len * lenScale + R * 0.25);
      streak(fk.phi + rot, rValley, Lk, (5 + R * 0.05) * fk.width, fk.curve, CREASE, 0.75 * foldAlpha);
      var minorPhi = fk.phi + (nk - fk.phi) * fk.minorU + rot;
      streak(minorPhi, R * 1.25, Lk * fk.minorLen, (3 + R * 0.03) * fk.width, -fk.curve, CREASE, 0.4 * foldAlpha);
    }

    // borda mais escura em volta do orifício
    ctx.save();
    holePath(R, a, rot);
    ctx.shadowColor = 'rgba(50,8,18,0.85)';
    ctx.shadowBlur = Math.min(56, 16 + R * 0.09);
    ctx.lineWidth = 2 + R * 0.025;
    ctx.strokeStyle = rgba([82, 20, 32], 0.3 + 0.4 * (1 - e));
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.restore();

    // recorta o orifício: o site aparece por baixo
    ctx.globalCompositeOperation = 'destination-out';
    holePath(R, a, rot);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // profundidade: escuro no início, sombra interna na borda
    ctx.save();
    holePath(R, a, rot);
    ctx.clip();
    if (dark > 0.001) {
      ctx.fillStyle = rgba(DEEP, dark);
      ctx.fillRect(0, 0, W, H);
    }
    holePath(R, a, rot);
    ctx.shadowColor = 'rgba(28,5,10,0.75)';
    ctx.shadowBlur = Math.min(48, 14 + R * 0.06);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(28,5,10,0.8)';
    ctx.stroke();
    ctx.restore();

    return true;
  }

  // ---------- laço ----------
  var start = null;
  var openingFlagged = false;

  function frame(now) {
    if (finished) return;
    if (start === null) start = now;
    var t = now - start;
    if (!openingFlagged && t >= CONFIG.holdMs) {
      openingFlagged = true;
      root.classList.add('intro-opening');
    }
    if (draw(t)) {
      window.requestAnimationFrame(frame);
    } else {
      finish(true);
    }
  }

  // primeiro quadro já, para não piscar o site antes da animação
  draw(0);
  overlay.classList.add('intro--ready');
  window.requestAnimationFrame(frame);

  // ---------- pular ----------
  function onKey(ev) {
    if (ev.key === 'Escape' || ev.key === 'Enter' || ev.key === ' ') finish(false);
  }
  overlay.addEventListener('click', function () { finish(false); });
  if (skipBtn) skipBtn.addEventListener('click', function () { finish(false); });
  window.addEventListener('keydown', onKey);
})();
