/* ════════════════════════════════════════════════════════════════════
   FAROOQ — PORTFOLIO · INTERACTION ENGINE
   Native scroll + sticky pins + rAF parallax + canvas atmosphere.
   No scroll-jacking libraries — film pace, expo easing, global pause.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  const C = window.CONTENT;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

  /* Seeded RNG for deterministic generative art */
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ════════════ RENDER — from CONTENT (editable data) ════════════ */
  function renderHero() {
    $("#hero-eyebrow").textContent = C.hero.eyebrow;
    $("#hero-line1").textContent = C.hero.line1;
    $("#hero-line2").textContent = C.hero.line2;
    $("#hero-sub").textContent = C.hero.sub;
    const p = $("#hero-cta-primary"); p.querySelector("span").textContent = C.hero.primaryCta.label; p.href = C.hero.primaryCta.href;
    const s = $("#hero-cta-secondary"); s.querySelector("span").textContent = C.hero.secondaryCta.label; s.href = C.hero.secondaryCta.href;
    $("#hero-status-label").textContent = C.hero.statusPrefix;
    const frames = $("#hero-frames");
    const nav = $("#hero-chapters");
    C.hero.chapters.forEach((ch, i) => {
      const img = document.createElement("img");
      img.src = ch.img; img.alt = ch.alt; img.decoding = "async";
      if (i === 0) img.fetchPriority = "high";
      frames.appendChild(img);
      const b = document.createElement("button");
      b.type = "button";
      b.innerHTML = '<span class="ch-n">' + ch.n + '</span><span>' + ch.label + "</span>";
      b.setAttribute("aria-label", "Scene " + ch.n + ": " + ch.label);
      if (i === 0) { b.classList.add("active"); b.setAttribute("aria-current", "true"); }
      b.addEventListener("click", () => jumpToChapter(i));
      nav.appendChild(b);
    });
  }

  function renderMarquee() {
    const track = $("#marquee-track");
    const half = C.marquee.map(m => "<span>" + m + "</span>").join("");
    track.innerHTML = half + half; // two copies for a seamless loop
  }

  function renderProjects() {
    const host = $("#project-panels");
    C.projects.forEach((p, i) => {
      const full = i === 0;
      const flip = i % 2 === 0 && !full;
      const el = document.createElement("article");
      el.className = "project-panel reveal" + (full ? " full" : " split" + (flip ? " flip" : ""));
      el.innerHTML =
        (full
          ? '<div class="project-media" data-pimg><img src="' + p.image + '" alt="' + p.imageAlt + '" loading="lazy" decoding="async"></div>'
          : '<div class="project-grid">' +
            '<div class="project-media" data-pimg><img src="' + p.image + '" alt="' + p.imageAlt + '" loading="lazy" decoding="async"></div>') +
        '<div class="project-copy">' +
          '<div class="project-top">' +
            '<span class="mono-counter">' + p.index + " / " + String(C.projects.length).padStart(2, "0") + "</span>" +
            (p.concept ? '<span class="chip concept">Concept</span>' : "") +
          "</div>" +
          '<p class="project-eyebrow">' + p.title + "</p>" +
          "<h3>" + p.headline.replace(/\.\s*$/, ".").replace(/(\S+\.)$/, "<em>$1</em>") + "</h3>" +
          '<p class="project-scope">' + p.scope + "</p>" +
          '<p class="project-desc">' + p.description + "</p>" +
          '<div class="project-tags">' + p.tags.map(t => '<span class="chip">' + t + "</span>").join("") + "</div>" +
          '<a class="btn-outline" href="#contact"><span>Discuss a build like this</span><span class="btn-arrow" aria-hidden="true">↗</span></a>' +
        "</div>" +
        (full ? "" : "</div>");
      host.appendChild(el);
    });
  }

  function renderPhilosophy() {
    const host = $("#philosophy-grid");
    C.philosophy.principles.forEach((p, i) => {
      const d = document.createElement("div");
      d.className = "principle reveal" + (i === 1 ? " d1" : i === 2 ? " d2" : "");
      d.innerHTML = '<span class="numeral">' + p.numeral + "</span><h3>" + p.title + "</h3><p>" + p.text + "</p>";
      host.appendChild(d);
    });
  }

  function renderEngine() {
    const tl = $("#engine-timeline");
    C.engine.stages.forEach((s, i) => {
      const li = document.createElement("li");
      li.innerHTML =
        '<div class="tl-head"><span class="tl-title">' + s.n + " · " + s.title + '</span><span class="tl-n">' + s.code + "</span></div>" +
        '<div class="tl-bar"><span class="tl-fill" data-tl="' + i + '"></span></div>';
      tl.appendChild(li);
    });
    const frame = $("#engine-frame");
    C.engine.stages.forEach((s, i) => {
      const img = document.createElement("img");
      img.src = s.image; img.alt = s.imageAlt; img.loading = "lazy"; img.decoding = "async";
      img.dataset.stage = i;
      frame.appendChild(img);
    });
    setEngineStage(0, true);
  }

  function renderCapabilities() {
    const host = $("#capability-rows");
    C.capabilities.rows.forEach((r, i) => {
      const d = document.createElement("div");
      d.className = "cap-row reveal" + (i % 2 ? " d1" : "");
      d.innerHTML =
        '<span class="cap-n">' + r.n + "</span><h3>" + r.title + "</h3><p>" + r.text + "</p>" +
        '<span class="cap-mark"><span class="circle-btn" aria-hidden="true">↗</span></span>';
      host.appendChild(d);
    });
  }

  function renderExperiences() {
    const host = $("#experience-cards");
    C.experiences.cards.forEach((c, i) => {
      const card = document.createElement("article");
      card.className = "exp-card reveal" + (i === 1 ? " d1" : i === 2 ? " d2" : "");
      let demo;
      if (c.kind === "terminal") {
        demo = '<div class="exp-demo" data-term tabindex="0" role="button" aria-label="Replay terminal demo"><div class="exp-term" aria-hidden="true"></div></div>';
      } else {
        demo = '<div class="exp-demo"><canvas data-sketch="' + c.kind + '"></canvas></div>';
      }
      card.innerHTML =
        demo +
        '<div class="exp-body"><div class="exp-top"><span class="mono">' + c.n + " / " + c.code + '</span><span class="chip concept">Concept</span></div>' +
        "<h3>" + c.title + "</h3><p>" + c.text + "</p>" +
        '<p class="exp-hint">' + (c.kind === "terminal" ? "Click to replay" : c.kind === "field" ? "Move your pointer" : "Live render") + "</p></div>";
      host.appendChild(card);
    });
  }

  function renderExperiments() {
    const rail = $("#experiment-rail");
    C.experiments.cards.forEach((c) => {
      const card = document.createElement("article");
      card.className = "rail-card";
      card.innerHTML =
        "<canvas data-sketch=\"" + c.kind + "\" aria-label=\"Generative art: " + c.title + "\"></canvas>" +
        '<div class="rail-body"><div class="rail-top"><span class="mono">' + c.code + '</span><span class="chip">Live</span></div>' +
        "<h3>" + c.title + "</h3><p>" + c.text + "</p></div>";
      rail.appendChild(card);
    });
  }

  function renderProcess() {
    const host = $("#process-steps");
    C.process.steps.forEach((s, i) => {
      const li = document.createElement("li");
      li.className = "reveal" + (i % 2 ? " d1" : "");
      li.innerHTML = '<span class="p-n">' + s.n + "</span><h3>" + s.title + "</h3><p>" + s.text + "</p>";
      host.appendChild(li);
    });
  }

  function renderAbout() {
    $("#about-copy").innerHTML = C.about.paragraphs.map(p => "<p>" + p + "</p>").join("");
    $("#about-exploring-label").textContent = C.about.exploringLabel;
    $("#about-chips").innerHTML = C.about.exploring.map(e => '<li><span class="chip">' + e + "</span></li>").join("");
    $("#about-caption").textContent = C.about.portraitCaption;
  }

  function renderContact() {
    $("#contact-lede").textContent = C.contact.lede;
    $("#contact-checklist").innerHTML = C.contact.checklist.map(c => "<li>" + c + "</li>").join("");
    $("#f-type").innerHTML = C.contact.form.projectTypes.map(t => "<option>" + t + "</option>").join("");
  }

  function renderFooter() {
    $("#footer-location").textContent = C.profile.location;
    $("#footer-colophon").textContent = C.footer.colophon;
    $("#footer-socials").innerHTML = C.socials.map(s =>
      '<a href="' + s.href + '"' + (s.href === "#" ? ' aria-disabled="true"' : ' target="_blank" rel="noopener"') + ">" + s.label + " ↗</a>"
    ).join("");
  }

  /* ════════════ SMOKE — shared soft-particle painter ════════════ */
  const smokeSystems = [];
  function makeSmoke(canvas, opts) {
    const o = Object.assign({ count: 20, size: 260, speed: 0.16, alpha: 0.5, driftX: 0.3 }, opts || {});
    const ctx = canvas.getContext("2d");
    const rnd = mulberry32(opts.seed || 7);
    const tints = ["198,165,250", "187,149,246", "238,153,205", "130,120,150", "110,105,130"];
    let W = 0, H = 0, parts = [];
    function resize() {
      const r = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(2, Math.round(r.width * DPR));
      H = canvas.height = Math.max(2, Math.round(r.height * DPR));
      parts = [];
      for (let i = 0; i < o.count; i++) {
        parts.push({
          x: rnd() * W, y: rnd() * H,
          r: (0.5 + rnd()) * o.size * DPR,
          vx: (rnd() - 0.5 + o.driftX) * o.speed * DPR,
          vy: (rnd() - 0.5) * o.speed * DPR,
          tint: tints[(rnd() * tints.length) | 0],
          a: 0.25 + rnd() * 0.75, ph: rnd() * Math.PI * 2
        });
      }
    }
    resize();
    window.addEventListener("resize", resize);
    const sys = {
      canvas,
      tick(t) {
        if (!canvas.isConnected) return;
        const r = canvas.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        for (const p of parts) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -p.r) p.x = W + p.r; if (p.x > W + p.r) p.x = -p.r;
          if (p.y < -p.r) p.y = H + p.r; if (p.y > H + p.r) p.y = -p.r;
          const tw = 0.7 + 0.3 * Math.sin(t * 0.0004 + p.ph);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, "rgba(" + p.tint + "," + (0.05 * p.a * tw * o.alpha) + ")");
          g.addColorStop(1, "rgba(" + p.tint + ",0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }
    };
    smokeSystems.push(sys);
    return sys;
  }

  /* ════════════ INTRO ════════════ */
  const INTRO_MS = 3800;
  let introDone = false;
  function finishIntro() {
    if (introDone) return;
    introDone = true;
    const intro = $("#intro");
    intro.classList.add("done");
    intro.setAttribute("aria-hidden", "true");
    document.body.classList.add("loaded");
    setTimeout(() => intro.remove(), 900);
  }
  function runIntro() {
    makeSmoke($("#intro-canvas"), { count: 30, size: 340, speed: 0.22, alpha: 0.9, driftX: 0.1, seed: 21 });
    const fill = $("#intro-progress-fill");
    const t0 = performance.now();
    if (reducedMotion) { finishIntro(); return; }
    (function step(t) {
      if (introDone) return;
      const p = clamp((t - t0) / INTRO_MS, 0, 1);
      fill.style.transform = "scaleX(" + p + ")";
      if (p < 1) requestAnimationFrame(step);
      else finishIntro();
    })(t0);
    $("#intro-skip").addEventListener("click", finishIntro);
    // focus trap: keep keyboard focus inside the modal while it is visible
    window.addEventListener("keydown", function trap(e) {
      if (introDone || e.key !== "Tab") return;
      e.preventDefault();
      $("#intro-skip").focus();
    });
    window.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape" && !introDone) { finishIntro(); window.removeEventListener("keydown", esc); }
    });
  }

  /* ════════════ HEADER ════════════ */
  function initHeader() {
    const header = $("#site-header");
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
    const toggle = $("#menu-toggle"), menu = $("#mobile-menu");
    toggle.addEventListener("click", () => {
      const open = menu.hasAttribute("hidden");
      if (open) { menu.removeAttribute("hidden"); toggle.setAttribute("aria-expanded", "true"); }
      else { menu.setAttribute("hidden", ""); toggle.setAttribute("aria-expanded", "false"); }
    });
    $$("#mobile-menu a").forEach(a => a.addEventListener("click", () => {
      menu.setAttribute("hidden", ""); toggle.setAttribute("aria-expanded", "false");
    }));
    $("#motion-toggle").addEventListener("click", () => {
      const paused = document.documentElement.classList.toggle("paused");
      const btn = $("#motion-toggle");
      btn.setAttribute("aria-pressed", String(paused));
      btn.setAttribute("aria-label", paused ? "Resume motion" : "Pause motion");
    });
    $("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" }));
  }

  /* ════════════ SCROLL LOOP — hero pin, engine pin, parallax ════════════ */
  const heroWrap = () => $(".hero-pin-wrap");
  const engineWrap = () => $(".engine-pin-wrap");
  let heroImgs = [], chapterBtns = [];
  let engineImgs = [], engineTlFills = [], engineStage = -1;

  function setEngineStage(i, instant) {
    if (i === engineStage && !instant) return;
    engineStage = i;
    const s = C.engine.stages[i];
    const panel = $(".engine-panel");
    const apply = () => {
      $("#engine-num").textContent = s.n;
      $("#engine-title").textContent = s.title;
      $("#engine-text").textContent = s.text;
      $("#engine-chip").textContent = s.code;
      panel.style.opacity = 1; panel.style.transform = "none";
    };
    if (instant || reducedMotion) { apply(); return; }
    panel.style.transition = "opacity .3s ease, transform .3s ease";
    panel.style.opacity = 0; panel.style.transform = "translateY(8px)";
    setTimeout(apply, 180);
  }

  function pinProgress(wrap) {
    const r = wrap.getBoundingClientRect();
    const total = wrap.offsetHeight - window.innerHeight;
    return clamp(-r.top / total, 0, 1);
  }

  function updateHero(p) {
    const n = C.hero.chapters.length;
    heroImgs.forEach((img, i) => {
      const d = Math.abs(p * (n - 1) - i);
      img.style.opacity = clamp(1 - d * 1.5, 0, 1).toFixed(3);
      img.style.transform = "scale(" + (1.03 + 0.05 * clamp(1 - d, 0, 1) + p * 0.02).toFixed(4) + ")";
    });
    const idx = Math.round(p * (n - 1));
    chapterBtns.forEach((b, i) => {
      const on = i === idx;
      b.classList.toggle("active", on);
      if (on) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
    });
    $("#hero-status-num").textContent = String(idx + 1).padStart(2, "0");
    $("#hero-status-fill").style.transform = "scaleX(" + p.toFixed(3) + ")";
  }

  function updateEngine(p) {
    const sp = p * 2; // 0..2 across 3 stages
    let i0 = Math.floor(sp); let f = sp - i0;
    if (sp >= 2) { i0 = 1; f = 1; }
    engineImgs.forEach((img, k) => {
      if (k < i0) { img.style.opacity = 0; img.style.clipPath = "none"; }
      else if (k === i0) { img.style.opacity = 1; img.style.clipPath = "none"; img.style.transform = "scale(1.04)"; }
      else if (k === i0 + 1) {
        img.style.opacity = 1;
        img.style.clipPath = "inset(0 " + ((1 - f) * 100).toFixed(2) + "% 0 0)";
        img.style.transform = "scale(" + (1.1 - 0.06 * f).toFixed(4) + ")";
      } else { img.style.opacity = 0; }
    });
    engineTlFills.forEach((fill, k) => {
      fill.style.transform = "scaleX(" + clamp(p * 3 - k, 0, 1).toFixed(3) + ")";
    });
    setEngineStage(Math.round(sp));
  }

  function updateParallax() {
    if (reducedMotion) return;
    const vh = window.innerHeight;
    $$("[data-pimg] img").forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const c = (r.top + r.height / 2 - vh / 2) / vh; // -0.5..0.5
      img.style.transform = "translate3d(0," + (-c * 24).toFixed(1) + "%,0) scale(1.11)";
    });
    $$("[data-parallax]").forEach(el => {
      const f = parseFloat(el.dataset.parallax) || 0.08;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const c = (r.top + r.height / 2 - vh / 2);
      el.style.transform = "translate3d(0," + (-c * f).toFixed(1) + "px,0)";
    });
  }

  function jumpToChapter(i) {
    const wrap = heroWrap();
    const top = wrap.offsetTop + (i / (C.hero.chapters.length - 1)) * (wrap.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  }

  let scrollTick = false;
  function onScrollLoop() {
    if (scrollTick) return; scrollTick = true;
    requestAnimationFrame(() => {
      scrollTick = false;
      updateHero(pinProgress(heroWrap()));
      updateEngine(pinProgress(engineWrap()));
      updateParallax();
    });
  }

  /* ════════════ REVEALS + SCROLL-SPY ════════════ */
  function initReveals() {
    if (reducedMotion) { $$(".reveal").forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    $$(".reveal").forEach(el => io.observe(el));
  }

  function initSpy() {
    const links = $$(".site-nav a[data-spy]");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.removeAttribute("aria-current"));
          const link = links.find(l => l.dataset.spy === e.target.id);
          if (link) link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    ["work", "technology", "process", "about"].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ════════════ GENERATIVE SKETCHES — shared live-canvas loop ════════════ */
  const sketches = [];
  const BG = "#06070c";
  function registerSketch(canvas, kind, seed) {
    const ctx = canvas.getContext("2d");
    const rnd = mulberry32(seed || ((Math.random() * 1e9) | 0));
    const st = { canvas, ctx, kind, rnd, t: rnd() * 1000, seedPh: rnd() * 6.283, pointer: { x: -9999, y: -9999 }, parts: null, init: false };
    function size() {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(2, Math.round(r.width * DPR));
      canvas.height = Math.max(2, Math.round(r.height * DPR));
      st.init = false;
    }
    size();
    new ResizeObserver(size).observe(canvas);
    canvas.addEventListener("pointermove", e => {
      const r = canvas.getBoundingClientRect();
      st.pointer.x = (e.clientX - r.left) / r.width * canvas.width;
      st.pointer.y = (e.clientY - r.top) / r.height * canvas.height;
    });
    canvas.addEventListener("pointerleave", () => { st.pointer.x = -9999; st.pointer.y = -9999; });
    sketches.push(st);
    return st;
  }

  function sketchTick(st, dt) {
    const { ctx, canvas, kind, rnd } = st;
    const W = canvas.width, H = canvas.height;
    st.t += dt;
    const t = st.t;
    const lav = a => "rgba(198,165,250," + a + ")";
    const rose = a => "rgba(238,153,205," + a + ")";

    if (kind === "noise") {
      if (!st.buf || st.buf.width !== 160) {
        st.buf = document.createElement("canvas"); st.buf.width = 160; st.buf.height = 200;
        st.bctx = st.buf.getContext("2d");
        st.img = st.bctx.createImageData(160, 200);
      }
      if ((st.f = (st.f || 0) + 1) % 3 === 0) {
        const d = st.img.data;
        for (let i = 0; i < d.length; i += 4) {
          const v = rnd() * 255;
          d[i] = 140 + v * 0.25; d[i + 1] = 120 + v * 0.2; d[i + 2] = 170 + v * 0.3; d[i + 3] = 26 + rnd() * 40;
        }
        st.bctx.putImageData(st.img, 0, 0);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(st.buf, 0, 0, W, H);
      return;
    }

    if (!st.init) {
      st.init = true;
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      if (kind === "flow" || kind === "field") {
        st.parts = [];
        const n = kind === "flow" ? 110 : 70;
        for (let i = 0; i < n; i++) st.parts.push({ x: rnd() * W, y: rnd() * H, vx: 0, vy: 0 });
      }
      if (kind === "orbit") {
        st.parts = [];
        for (let i = 0; i < 6; i++) st.parts.push({ r: (0.12 + rnd() * 0.32) * Math.min(W, H), sp: (0.2 + rnd() * 0.5) * (rnd() > 0.5 ? 1 : -1), ph: rnd() * 7, s: 1.5 + rnd() * 2.5 });
      }
    }

    if (kind === "flow") {
      ctx.fillStyle = "rgba(6,7,12,0.07)"; ctx.fillRect(0, 0, W, H);
      for (const p of st.parts) {
        const a = Math.sin(p.x * 0.004 + t * 0.00035 + st.seedPh) + Math.cos(p.y * 0.004 - t * 0.00028);
        p.x += Math.cos(a * 2.2) * 1.4 * DPR; p.y += Math.sin(a * 2.2) * 1.4 * DPR;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.fillStyle = lav(0.55);
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.1 * DPR, 0, 7); ctx.fill();
      }
      return;
    }

    if (kind === "field") {
      ctx.fillStyle = "rgba(6,7,12,0.16)"; ctx.fillRect(0, 0, W, H);
      const px = st.pointer.x, py = st.pointer.y;
      for (const p of st.parts) {
        const dx = p.x - px, dy = p.y - py, d2 = dx * dx + dy * dy;
        if (d2 < 14400 * DPR * DPR && d2 > 1) {
          const d = Math.sqrt(d2), f = (120 * DPR - d) / (120 * DPR);
          p.vx += (dx / d) * f * 1.6; p.vy += (dy / d) * f * 1.6;
        }
        p.vx *= 0.94; p.vy *= 0.94;
        p.x += p.vx + Math.sin(t * 0.001 + p.y * 0.01) * 0.3;
        p.y += p.vy + Math.cos(t * 0.001 + p.x * 0.01) * 0.3;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0; if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.fillStyle = lav(0.7);
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4 * DPR, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = "rgba(198,165,250,0.10)"; ctx.lineWidth = 1;
      for (let i = 0; i < st.parts.length; i++) for (let j = i + 1; j < st.parts.length; j++) {
        const a = st.parts[i], b = st.parts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (dx * dx + dy * dy < 8100 * DPR * DPR) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      return;
    }

    if (kind === "wave") {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(198,165,250,0.05)";
      for (let gx = 0; gx < W; gx += 34 * DPR) for (let gy = 0; gy < H; gy += 34 * DPR) { ctx.fillRect(gx, gy, 1.5, 1.5); }
      const layers = [[lav, 0.75, 1], ["rgba(187,149,246,", 0.5, 1.7], [rose, 0.4, 2.6]];
      layers.forEach(([col, al, fq], li) => {
        ctx.strokeStyle = typeof col === "function" ? col(al) : col + al + ")";
        ctx.lineWidth = 1.6 * DPR; ctx.beginPath();
        for (let x = 0; x <= W; x += 4 * DPR) {
          const y = H / 2 + Math.sin(x * 0.008 * fq + t * 0.0016 + li * 1.7) * H * 0.16
            + Math.sin(x * 0.02 * fq - t * 0.0011) * H * 0.05;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      return;
    }

    if (kind === "grid") {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      const nx = 13, ny = 16, cx = W / 2, cy = H / 2;
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const x = (i + 0.5) / nx * W, y = (j + 0.5) / ny * H;
        const d = Math.hypot(x - cx, y - cy) / (Math.min(W, H) * 0.7);
        const r = (1.2 + 2.6 * Math.max(0, Math.sin(d * 9 - t * 0.0022))) * DPR;
        ctx.fillStyle = lav(0.16 + 0.5 * Math.max(0, Math.sin(d * 9 - t * 0.0022)));
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      return;
    }

    if (kind === "orbit") {
      ctx.fillStyle = "rgba(6,7,12,0.10)"; ctx.fillRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      ctx.strokeStyle = "rgba(198,165,250,0.10)";
      st.parts.forEach(o => { ctx.beginPath(); ctx.arc(cx, cy, o.r, 0, 7); ctx.stroke(); });
      st.parts.forEach((o, i) => {
        const a = o.ph + t * 0.0009 * o.sp;
        const x = cx + Math.cos(a) * o.r, y = cy + Math.sin(a) * o.r;
        ctx.fillStyle = i % 2 ? rose(0.85) : lav(0.85);
        ctx.beginPath(); ctx.arc(x, y, o.s * DPR, 0, 7); ctx.fill();
      });
      ctx.fillStyle = lav(0.9);
      ctx.beginPath(); ctx.arc(cx, cy, 3 * DPR, 0, 7); ctx.fill();
      return;
    }
  }

  /* ════════════ STACK CONSTELLATION ════════════ */
  function initStack() {
    const canvas = $("#stack-canvas");
    const ctx = canvas.getContext("2d");
    const nodes = C.stack.nodes.map((n, i) => Object.assign({ i }, n));
    const rnd = mulberry32(42);
    let W = 0, H = 0, hover = -1;
    const pointer = { x: -9999, y: -9999 };
    function layout() {
      const r = canvas.getBoundingClientRect();
      W = canvas.width = Math.round(r.width * DPR);
      H = canvas.height = Math.round(r.height * DPR);
      nodes.forEach((nd, i) => {
        if (nd.x === undefined) {
          const cols = 4, rows = 3;
          const cx = (i % cols + 0.5 + (rnd() - 0.5) * 0.5) / cols;
          const cy = (Math.floor(i / cols) + 0.5 + (rnd() - 0.5) * 0.5) / rows;
          nd.x = cx * W; nd.y = cy * H;
          nd.vx = (rnd() - 0.5) * 0.25 * DPR; nd.vy = (rnd() - 0.5) * 0.25 * DPR;
        } else { nd.x *= W / (nd.pw || W); nd.y *= H / (nd.ph || H); }
        nd.pw = W; nd.ph = H;
      });
    }
    layout();
    new ResizeObserver(layout).observe(canvas);
    function toLocal(e) {
      const r = canvas.getBoundingClientRect();
      return { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H };
    }
    canvas.addEventListener("pointermove", e => {
      const p = toLocal(e); pointer.x = p.x; pointer.y = p.y;
      let best = -1, bd = 46 * DPR;
      nodes.forEach((nd, i) => {
        const d = Math.hypot(nd.x - p.x, nd.y - p.y);
        if (d < bd) { bd = d; best = i; }
      });
      if (best !== hover) {
        hover = best;
        if (best >= 0) {
          $("#stack-readout-name").textContent = nodes[best].name;
          $("#stack-readout-note").textContent = "— " + nodes[best].note;
        } else {
          $("#stack-readout-name").textContent = C.stack.hint;
          $("#stack-readout-note").textContent = "";
        }
      }
    });
    canvas.addEventListener("pointerleave", () => {
      pointer.x = -9999; hover = -1;
      $("#stack-readout-name").textContent = C.stack.hint;
      $("#stack-readout-note").textContent = "";
    });
    canvas.addEventListener("click", e => {
      const p = toLocal(e);
      nodes.forEach((nd, i) => {
        if (Math.hypot(nd.x - p.x, nd.y - p.y) < 60 * DPR) {
          $("#stack-readout-name").textContent = nd.name;
          $("#stack-readout-note").textContent = "— " + nd.note;
        }
      });
    });
    sketches.push({
      canvas, ctx, kind: "stack", t: 0, rnd,
      tickOverride(dt) {
        this.t += dt;
        ctx.fillStyle = "rgba(9,11,18,0.28)"; ctx.fillRect(0, 0, W, H);
        nodes.forEach(nd => {
          nd.x += nd.vx + Math.sin(this.t * 0.0004 + nd.i) * 0.12 * DPR;
          nd.y += nd.vy + Math.cos(this.t * 0.0004 + nd.i * 1.3) * 0.12 * DPR;
          if (nd.x < 40 * DPR || nd.x > W - 40 * DPR) nd.vx *= -1;
          if (nd.y < 40 * DPR || nd.y > H - 40 * DPR) nd.vy *= -1;
        });
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 170 * DPR) {
            ctx.strokeStyle = "rgba(198,165,250," + (0.14 * (1 - d / (170 * DPR))).toFixed(3) + ")";
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        nodes.forEach((nd, i) => {
          const hot = i === hover;
          const r = (hot ? 9 : 6) * DPR;
          ctx.fillStyle = hot ? "rgba(238,153,205,0.25)" : "rgba(198,165,250,0.12)";
          ctx.beginPath(); ctx.arc(nd.x, nd.y, r * 1.9, 0, 7); ctx.fill();
          ctx.fillStyle = hot ? "#ee99cd" : "#c6a5fa";
          ctx.beginPath(); ctx.arc(nd.x, nd.y, r * 0.55, 0, 7); ctx.fill();
          ctx.strokeStyle = hot ? "rgba(238,153,205,0.8)" : "rgba(198,165,250,0.45)";
          ctx.beginPath(); ctx.arc(nd.x, nd.y, r, 0, 7); ctx.stroke();
          ctx.fillStyle = hot ? "rgba(244,240,250,0.95)" : "rgba(196,194,206,0.75)";
          ctx.font = (hot ? 600 : 400) + " " + Math.round(11 * DPR) + "px 'IBM Plex Mono', monospace";
          ctx.textAlign = "center";
          ctx.fillText(nd.name, nd.x, nd.y + r + 16 * DPR);
        });
      }
    });
  }

  /* ════════════ TERMINAL DEMO ════════════ */
  const TERM_SCRIPT = [
    { t: "$ farooq deploy --project nova", c: "t-acc" },
    { t: "▸ resolving dependencies .......... done", c: "" },
    { t: "▸ building interface .............. done", c: "" },
    { t: "▸ wiring intelligence ............. done", c: "" },
    { t: "▸ deploying to edge ............... live", c: "t-ok" },
    { t: "", c: "" },
    { t: "$ open https://nova.concept", c: "t-acc" },
    { t: "→ NOVA is live · 38ms · concept build", c: "t-dim" }
  ];
  function initTerminal() {
    $$("[data-term]").forEach(box => {
      const pre = box.querySelector(".exp-term");
      let timer = null, started = false;
      function play() {
        if (timer) timer.forEach(clearTimeout);
        timer = [];
        pre.innerHTML = "";
        let delay = 0, li = 0;
        TERM_SCRIPT.forEach(line => {
          const div = document.createElement("div");
          if (line.c) div.className = line.c;
          pre.appendChild(div);
          const chars = line.t.split("");
          chars.forEach(ch => {
            timer.push(setTimeout(() => { div.textContent += ch; }, delay));
            delay += 14 + Math.random() * 26;
          });
          delay += 160; li++;
        });
      }
      box.addEventListener("click", play);
      box.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); } });
      new IntersectionObserver((es, io) => {
        es.forEach(e => { if (e.isIntersecting && !started) { started = true; play(); io.disconnect(); } });
      }, { threshold: 0.4 }).observe(box);
    });
  }

  /* ════════════ EXPERIMENT RAIL ════════════ */
  function initRail() {
    const rail = $("#experiment-rail");
    const step = () => {
      const card = rail.querySelector(".rail-card");
      return card ? card.offsetWidth + 22 : 320;
    };
    $("#rail-prev").addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
    $("#rail-next").addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));
    const total = C.experiments.cards.length;
    const pad = n => String(n).padStart(2, "0");
    function updateCounter() {
      const s = step();
      const vis = Math.max(1, Math.floor(rail.clientWidth / s));
      const first = clamp(Math.round(rail.scrollLeft / s), 0, Math.max(0, total - vis));
      $("#rail-counter").textContent = pad(first + 1) + "–" + pad(Math.min(first + vis, total)) + " / " + pad(total);
      $("#rail-prev").disabled = rail.scrollLeft <= 4;
      $("#rail-next").disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 4;
    }
    let tick = false;
    rail.addEventListener("scroll", () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => { tick = false; updateCounter(); });
    }, { passive: true });
    window.addEventListener("load", updateCounter);
    window.addEventListener("resize", updateCounter);
    updateCounter();
  }

  /* ════════════ CONTACT FORM → mailto ════════════ */
  function initForm() {
    const form = $("#brief-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      let ok = true;
      const name = $("#f-name"), email = $("#f-email"), msg = $("#f-msg"), type = $("#f-type");
      [[name, v => v.trim().length > 1], [email, v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)], [msg, v => v.trim().length > 3]]
        .forEach(([el, test]) => {
          const valid = test(el.value);
          el.closest(".field").classList.toggle("invalid", !valid);
          if (!valid) ok = false;
        });
      if (!ok) return;
      const subject = "Project brief — " + type.value + " — " + name.value.trim();
      const body = "Name: " + name.value.trim() + "\nEmail: " + email.value.trim() +
        "\nProject type: " + type.value + "\n\nThe idea:\n" + msg.value.trim() +
        "\n\n— sent from farooq portfolio (prototype form)";
      const btn = form.querySelector('[type="submit"]');
      btn.querySelector("span").textContent = "Opening email…";
      window.location.href = "mailto:" + C.profile.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      setTimeout(() => { btn.querySelector("span").textContent = C.contact.form.submitLabel; }, 2500);
    });
    ["f-name", "f-email", "f-msg"].forEach(id =>
      $("#" + id).addEventListener("input", e => e.target.closest(".field").classList.remove("invalid")));
  }

  /* ════════════ MASTER LOOP ════════════ */
  let lastT = 0;
  function masterLoop(t) {
    requestAnimationFrame(masterLoop);
    if (document.documentElement.classList.contains("paused") || reducedMotion) return;
    if (document.hidden) { lastT = t; return; }
    const dt = Math.min(50, t - (lastT || t)); lastT = t;
    smokeSystems.forEach(s => s.tick(t));
    sketches.forEach(st => {
      const r = st.canvas.getBoundingClientRect();
      if (r.bottom < -80 || r.top > window.innerHeight + 80) return;
      if (st.tickOverride) st.tickOverride(dt);
      else sketchTick(st, dt);
    });
  }

  /* ════════════ INIT ════════════ */
  function init() {
    renderHero(); renderMarquee(); renderProjects(); renderPhilosophy();
    renderEngine(); renderCapabilities(); renderExperiences();
    renderExperiments(); renderProcess(); renderAbout();
    renderContact(); renderFooter();
    heroImgs = $$("#hero-frames img");
    chapterBtns = $$("#hero-chapters button");
    engineImgs = $$("#engine-frame img");
    engineTlFills = $$("[data-tl]");
    initHeader(); initReveals(); initSpy(); initTerminal(); initRail(); initForm();
    makeSmoke($("#hero-smoke"), { count: 16, size: 300, speed: 0.12, alpha: 0.7, driftX: 0.5, seed: 5 });
    makeSmoke($("#atmosphere"), { count: 42, size: 380, speed: 0.07, alpha: 0.5, driftX: 0.25, seed: 99 });
    $$("canvas[data-sketch]").forEach((c, i) => registerSketch(c, c.dataset.sketch, 1000 + i * 77));
    initStack();
    window.addEventListener("scroll", onScrollLoop, { passive: true });
    window.addEventListener("resize", onScrollLoop);
    onScrollLoop();
    requestAnimationFrame(masterLoop);
    if (reducedMotion) {
      // one static frame so canvases aren't empty for reduced-motion users
      sketches.forEach(st => { st.tickOverride ? st.tickOverride(16) : sketchTick(st, 16); });
    }
    runIntro();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
