/* Palak Joshi — portfolio interactions. No dependencies. */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function store(key, value) {
    try {
      if (value === undefined) return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = $(".nav-toggle");
  if (toggle) {
    var setNav = function (open) {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setNav(!document.body.classList.contains("nav-open"));
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("nav-open")) { setNav(false); toggle.focus(); }
    });
    $$(".nav a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Home slideshow ---------- */
  var show = $(".slideshow");
  if (show) {
    var slides = $$(".slide", show);
    var caption = $(".slide-caption");
    var count = $(".slide-count");
    var bar = $(".slide-progress span");
    var DURATION = 6500;
    var index = 0, timer = null, started = 0, paused = false, raf = null;

    var render = function () {
      slides.forEach(function (s, i) {
        s.classList.toggle("is-active", i === index);
        s.setAttribute("aria-hidden", i === index ? "false" : "true");
        var link = s.querySelector("a");
        if (link) link.tabIndex = i === index ? 0 : -1;
      });
      var s = slides[index];
      if (caption) {
        caption.innerHTML = "";
        var eyebrow = document.createElement("span");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = s.dataset.kicker || "";
        var a = document.createElement("a");
        a.href = s.dataset.href;
        a.textContent = s.dataset.title;
        var meta = document.createElement("span");
        meta.textContent = s.dataset.meta || "";
        a.appendChild(meta);
        caption.appendChild(eyebrow);
        caption.appendChild(a);
      }
      if (count) count.textContent = (index + 1) + " / " + slides.length;
    };

    var tick = function () {
      if (!bar) return;
      var p = paused ? parseFloat(bar.dataset.p || 0) : Math.min(1, (Date.now() - started) / DURATION);
      bar.style.transform = "scaleX(" + p + ")";
      bar.dataset.p = p;
      raf = requestAnimationFrame(tick);
    };

    var go = function (n) {
      index = (n + slides.length) % slides.length;
      render();
      restart();
    };

    var restart = function () {
      clearTimeout(timer);
      started = Date.now();
      if (bar) bar.dataset.p = 0;
      if (!paused && !reduceMotion) timer = setTimeout(function () { go(index + 1); }, DURATION);
    };

    var pause = function () { paused = true; clearTimeout(timer); };
    var resume = function () {
      if (!paused) return;
      paused = false;
      var elapsed = parseFloat((bar && bar.dataset.p) || 0) * DURATION;
      started = Date.now() - elapsed;
      if (!reduceMotion) timer = setTimeout(function () { go(index + 1); }, Math.max(400, DURATION - elapsed));
    };

    var prev = $("[data-slide-prev]"), next = $("[data-slide-next]");
    if (prev) prev.addEventListener("click", function () { go(index - 1); });
    if (next) next.addEventListener("click", function () { go(index + 1); });

    show.addEventListener("mouseenter", pause);
    show.addEventListener("mouseleave", resume);
    show.addEventListener("focusin", pause);
    show.addEventListener("focusout", resume);
    document.addEventListener("visibilitychange", function () { document.hidden ? pause() : resume(); });

    document.addEventListener("keydown", function (e) {
      if (document.querySelector(".lightbox.is-open")) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    });

    var x0 = null;
    show.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    show.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      x0 = null;
    });

    render();
    restart();
    if (!reduceMotion) tick();
  }

  /* ---------- Filters (work index, art) ---------- */
  $$("[data-filter-group]").forEach(function (group) {
    var buttons = $$("[data-filter]", group);
    var scope = group.closest("[data-filter-scope]") || document;
    var items = $$("[data-cat]", scope);
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var f = btn.dataset.filter;
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        items.forEach(function (it) {
          var cats = (it.dataset.cat || "").split(" ");
          it.hidden = !(f === "all" || cats.indexOf(f) !== -1);
        });
      });
    });
  });

  /* ---------- Work index: list / grid view ---------- */
  var viewRoot = $("[data-view]");
  if (viewRoot) {
    var viewButtons = $$("[data-set-view]");
    var setView = function (v) {
      viewRoot.dataset.view = v;
      viewButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.setView === v)); });
      store("pj-view", v);
    };
    viewButtons.forEach(function (b) { b.addEventListener("click", function () { setView(b.dataset.setView); }); });
    var saved = store("pj-view");
    if (saved === "grid" || saved === "list") setView(saved);
  }

  /* ---------- Work index: floating preview on hover ---------- */
  var preview = $(".hover-preview");
  if (preview && window.matchMedia("(hover: hover)").matches) {
    var img = preview.querySelector("img");
    var px = 0, py = 0, tx = 0, ty = 0, moving = false;
    var follow = function () {
      px += (tx - px) * 0.18; py += (ty - py) * 0.18;
      preview.style.transform = "translate3d(" + px + "px," + py + "px,0)";
      if (moving) requestAnimationFrame(follow);
    };
    $$("[data-preview]").forEach(function (row) {
      row.addEventListener("mouseenter", function (e) {
        img.src = row.dataset.preview;
        tx = px = e.clientX + 28; ty = py = e.clientY - 120;
        preview.classList.add("is-visible");
        if (!moving) { moving = true; follow(); }
      });
      row.addEventListener("mousemove", function (e) {
        var w = preview.offsetWidth;
        tx = e.clientX + 28 + w > window.innerWidth ? e.clientX - w - 28 : e.clientX + 28;
        ty = Math.min(Math.max(12, e.clientY - preview.offsetHeight / 2), window.innerHeight - preview.offsetHeight - 12);
      });
      row.addEventListener("mouseleave", function () { preview.classList.remove("is-visible"); moving = false; });
    });
  }

  /* ---------- Themes: highlight current section ---------- */
  var themeLinks = $$(".theme-index a");
  if (themeLinks.length && "IntersectionObserver" in window) {
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        themeLinks.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$(".theme").forEach(function (t) { tio.observe(t); });
  }

  /* ---------- Copy to clipboard ---------- */
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1600);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
    });
  });

  /* ---------- Lightbox ---------- */
  var triggers = $$("a[data-lightbox]");
  if (triggers.length) {
    var icon = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");
    lb.innerHTML =
      '<div class="lightbox__top"><span class="lightbox__count"></span><button type="button" class="lightbox__close">Close</button></div>' +
      '<div class="lightbox__stage"><button type="button" class="lightbox__prev" aria-label="Previous image">' + icon("M15 4 7 12l8 8") + '</button>' +
      '<img alt=""><button type="button" class="lightbox__next" aria-label="Next image">' + icon("m9 4 8 8-8 8") + '</button></div>' +
      '<div class="lightbox__bottom"><span class="lightbox__caption"></span></div>';
    document.body.appendChild(lb);

    var lbImg = $("img", lb), lbCap = $(".lightbox__caption", lb), lbCount = $(".lightbox__count", lb);
    var closeBtn = $(".lightbox__close", lb);
    var set = [], pos = 0, lastFocus = null;

    var visibleTriggers = function (name) {
      return triggers.filter(function (t) { return t.dataset.lightbox === name && !t.closest("[hidden]"); });
    };

    var showAt = function (i) {
      pos = (i + set.length) % set.length;
      var t = set[pos];
      var thumb = t.querySelector("img");
      lbImg.classList.add("is-loading");
      lbImg.onload = function () { lbImg.classList.remove("is-loading"); };
      lbImg.src = t.getAttribute("href");
      lbImg.alt = thumb ? thumb.alt : "";
      var fig = t.closest("figure");
      var cap = fig && fig.querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent.trim() : (thumb ? thumb.alt : "");
      lbCount.textContent = (pos + 1) + " / " + set.length;
    };

    var open = function (t) {
      set = visibleTriggers(t.dataset.lightbox);
      lastFocus = document.activeElement;
      showAt(set.indexOf(t));
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    };

    var close = function () {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) { e.preventDefault(); open(t); });
    });
    closeBtn.addEventListener("click", close);
    $(".lightbox__prev", lb).addEventListener("click", function () { showAt(pos - 1); });
    $(".lightbox__next", lb).addEventListener("click", function () { showAt(pos + 1); });
    $(".lightbox__stage", lb).addEventListener("click", function (e) { if (e.target === e.currentTarget) close(); });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") showAt(pos + 1);
      if (e.key === "ArrowLeft") showAt(pos - 1);
      if (e.key === "Tab") {
        var f = $$("button", lb);
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    var lx = null;
    lb.addEventListener("touchstart", function (e) { lx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (lx === null) return;
      var dx = e.changedTouches[0].clientX - lx;
      if (Math.abs(dx) > 40) showAt(pos + (dx < 0 ? 1 : -1));
      lx = null;
    });
  }

  /* ---------- About portrait: tap or Enter toggles colour (hover handles it on desktop) ---------- */
  $$(".portrait").forEach(function (p) {
    var flip = function () { p.classList.toggle("is-colour"); };
    p.addEventListener("click", flip);
    p.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
