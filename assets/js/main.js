/* ===========================================================================
   BISMI MANDI — website interactions
   Designed by TheVincis.
   Sticky nav · scroll spy · reading progress · reveal system · parallax ·
   count-up stats · menu filtering · gallery lightbox · testimonial carousel ·
   reservation form (WhatsApp handoff) · FAQ accordion · back to top
   No dependencies, no build step.
   =========================================================================== */
(function () {
  "use strict";

  /* -------------------------------------------------------------------------
     CONFIG — swap these for the real values before going live.
     ---------------------------------------------------------------------- */
  var CONFIG = {
    // Digits only, with country code, no "+" or spaces. Used for the WhatsApp link.
    whatsapp: "919876543210",
    // Displayed / dialled number.
    phone: "+91 98765 43210",
    email: "hello@bismimandi.in",
    opensAt: "11:00",
    closesAt: "23:30"
  };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* =========================================================================
     Nav: solidify on scroll, mobile menu, reading progress, back-to-top
     ====================================================================== */
  var nav = $("#nav");
  var toggle = $("#navToggle");
  var links = $("#navLinks");
  var progressBar = $("#progressBar");
  var toTop = $("#toTop");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;

    if (nav) nav.classList.toggle("is-scrolled", y > 24);

    if (progressBar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }

    if (toTop) {
      var show = y > window.innerHeight * 0.9;
      if (show) toTop.hidden = false;
      toTop.classList.toggle("is-visible", show);
    }

    updateParallax(y);
  }

  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });

  function closeMenu() {
    if (!links) return;
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", links).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* =========================================================================
     Parallax — elements drift slightly against the scroll
     ====================================================================== */
  var parallaxEls = reduceMotion ? [] : $$("[data-parallax]");

  function updateParallax(y) {
    if (!parallaxEls.length) return;
    for (var i = 0; i < parallaxEls.length; i++) {
      var el = parallaxEls[i];
      var rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) continue;
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0;
      var centreOffset = (rect.top + rect.height / 2) - window.innerHeight / 2;
      el.style.transform = "translate3d(0," + (centreOffset * speed * -1).toFixed(2) + "px,0)";
    }
  }

  /* =========================================================================
     Reveal system — [data-reveal] with optional per-parent stagger
     ====================================================================== */
  function applyStagger() {
    $$("[data-stagger]").forEach(function (parent) {
      var step = parseInt(parent.getAttribute("data-stagger"), 10) || 80;
      $$("[data-reveal]", parent)
        .filter(function (el) { return el.closest("[data-stagger]") === parent; })
        .forEach(function (el, i) {
          if (!el.hasAttribute("data-reveal-delay")) {
            el.setAttribute("data-reveal-delay", String(i * step));
          }
        });
    });
  }

  // "mask" reveals wipe an inner span rather than clipping the heading itself:
  // a target clipped to zero area never reports as intersecting.
  function wrapMaskTargets() {
    $$('[data-reveal="mask"]').forEach(function (el) {
      if (el.firstElementChild && el.firstElementChild.classList.contains("mask-inner")) return;
      var inner = document.createElement("span");
      inner.className = "mask-inner";
      while (el.firstChild) inner.appendChild(el.firstChild);
      el.appendChild(inner);
    });
  }

  function initReveal() {
    var els = $$("[data-reveal]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    wrapMaskTargets();
    applyStagger();

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var delay = parseInt(e.target.getAttribute("data-reveal-delay"), 10) || 0;
        e.target.style.transitionDelay = delay + "ms";
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  /* =========================================================================
     Scroll spy — highlight the nav link for the section in view
     ====================================================================== */
  function initScrollSpy() {
    var spyLinks = $$("[data-spy]");
    if (!spyLinks.length || !("IntersectionObserver" in window)) return;

    var map = {};
    var sections = [];
    spyLinks.forEach(function (a) {
      var id = a.getAttribute("data-spy");
      var sec = document.getElementById(id);
      if (!sec) return;
      map[id] = a;
      sections.push(sec);
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        spyLinks.forEach(function (a) { a.classList.remove("is-active"); });
        var active = map[e.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    sections.forEach(function (s) { io.observe(s); });
  }

  /* =========================================================================
     Count-up stats
     ====================================================================== */
  function initCounters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;

    function render(el, value) {
      el.textContent = value + (el.getAttribute("data-suffix") || "");
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nums.forEach(function (el) { render(el, parseInt(el.getAttribute("data-count"), 10)); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var duration = 1400;
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / duration, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          render(el, Math.round(target * eased));
          if (p < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* =========================================================================
     Menu filtering — course chips + diet toggle + text search
     ====================================================================== */
  function initMenuFilter() {
    var chipsWrap = $("#menuChips");
    var dietWrap = $("#dietToggle");
    var search = $("#menuSearch");
    var cols = $("#menuCols");
    var empty = $("#menuEmpty");
    var reset = $("#menuReset");
    if (!cols) return;

    var items = $$(".menu__item", cols);
    var groups = $$(".menu__group", cols);
    var state = { cat: "all", diet: "all", q: "" };

    // Cache each item's searchable text once.
    items.forEach(function (li) {
      var name = $(".menu__name", li);
      li.dataset.search = (name ? name.textContent : li.textContent).toLowerCase();
    });

    function apply() {
      var shown = 0;

      items.forEach(function (li) {
        var okCat = state.cat === "all" || li.getAttribute("data-cat") === state.cat;
        var okDiet = state.diet === "all" || li.getAttribute("data-diet") === state.diet;
        var okText = !state.q || li.dataset.search.indexOf(state.q) !== -1;
        var visible = okCat && okDiet && okText;
        li.hidden = !visible;
        if (visible) shown++;
      });

      // Hide a course group once every dish inside it is filtered out.
      groups.forEach(function (g) {
        var any = $$(".menu__item", g).some(function (li) { return !li.hidden; });
        g.hidden = !any;
      });

      if (empty) empty.hidden = shown !== 0;
    }

    if (chipsWrap) {
      chipsWrap.addEventListener("click", function (e) {
        var btn = e.target.closest(".chip");
        if (!btn) return;
        $$(".chip", chipsWrap).forEach(function (c) { c.classList.remove("is-active"); });
        btn.classList.add("is-active");
        state.cat = btn.getAttribute("data-filter");
        apply();
      });
    }

    if (dietWrap) {
      dietWrap.addEventListener("click", function (e) {
        var btn = e.target.closest(".diet__btn");
        if (!btn) return;
        $$(".diet__btn", dietWrap).forEach(function (c) { c.classList.remove("is-active"); });
        btn.classList.add("is-active");
        state.diet = btn.getAttribute("data-diet");
        apply();
      });
    }

    if (search) {
      search.addEventListener("input", function () {
        state.q = search.value.trim().toLowerCase();
        apply();
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        state = { cat: "all", diet: "all", q: "" };
        if (search) search.value = "";
        $$(".chip", chipsWrap).forEach(function (c) {
          c.classList.toggle("is-active", c.getAttribute("data-filter") === "all");
        });
        $$(".diet__btn", dietWrap).forEach(function (c) {
          c.classList.toggle("is-active", c.getAttribute("data-diet") === "all");
        });
        apply();
      });
    }
  }

  /* =========================================================================
     Gallery lightbox
     ====================================================================== */
  function initLightbox() {
    var grid = $("#galleryGrid");
    var lb = $("#lightbox");
    if (!grid || !lb) return;

    var figures = $$("figure", grid);
    var img = $("#lbImg");
    var cap = $("#lbCap");
    var idx = 0;
    var lastFocus = null;

    function show(i) {
      idx = (i + figures.length) % figures.length;
      var source = $("img", figures[idx]);
      var caption = $("figcaption", figures[idx]);
      img.src = source.getAttribute("data-full") || source.src;
      img.alt = source.alt || "";
      cap.textContent = caption ? caption.textContent : source.alt || "";
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      window.requestAnimationFrame(function () { lb.classList.add("is-open"); });
      $("#lbClose").focus();
    }

    function close() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      window.setTimeout(function () { lb.hidden = true; }, reduceMotion ? 0 : 280);
      if (lastFocus) lastFocus.focus();
    }

    figures.forEach(function (fig, i) {
      var trigger = $("img", fig);
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("role", "button");
      fig.addEventListener("click", function () { open(i); });
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i); }
      });
    });

    $("#lbClose").addEventListener("click", close);
    $("#lbPrev").addEventListener("click", function () { show(idx - 1); });
    $("#lbNext").addEventListener("click", function () { show(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });

    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(idx - 1);
      else if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* =========================================================================
     Testimonials carousel
     ====================================================================== */
  function initQuotes() {
    var track = $("#quotesTrack");
    var dotsWrap = $("#quotesDots");
    if (!track) return;

    var slides = $$(".quote", track);
    if (slides.length < 2) return;

    var i = 0;
    var timer = null;
    var AUTO = 6500;

    slides.forEach(function (_, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Review " + (n + 1));
      b.addEventListener("click", function () { go(n); restart(); });
      dotsWrap.appendChild(b);
    });
    var dots = $$("button", dotsWrap);

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(" + (-i * 100) + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("is-active", k === i); });
      slides.forEach(function (s, k) { s.setAttribute("aria-hidden", k === i ? "false" : "true"); });
    }

    function restart() {
      window.clearInterval(timer);
      if (!reduceMotion) timer = window.setInterval(function () { go(i + 1); }, AUTO);
    }

    $("#qPrev").addEventListener("click", function () { go(i - 1); restart(); });
    $("#qNext").addEventListener("click", function () { go(i + 1); restart(); });

    var quotes = $(".quotes");
    quotes.addEventListener("mouseenter", function () { window.clearInterval(timer); });
    quotes.addEventListener("mouseleave", restart);

    // Touch swipe
    var startX = null;
    quotes.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    quotes.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 44) { go(dx < 0 ? i + 1 : i - 1); restart(); }
      startX = null;
    });

    go(0);
    restart();
  }

  /* =========================================================================
     FAQ accordion
     ====================================================================== */
  function initAccordion() {
    var acc = $("#acc");
    if (!acc) return;

    $$(".acc__item", acc).forEach(function (item, n) {
      var btn = $(".acc__q", item);
      var panel = $(".acc__a", item);
      var id = "acc-panel-" + n;

      panel.id = id;
      panel.setAttribute("role", "region");
      btn.setAttribute("aria-controls", id);

      btn.addEventListener("click", function () {
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        panel.style.height = open ? $(".acc__a-inner", panel).offsetHeight + "px" : "0px";
      });
    });

    // Keep an open panel correctly sized when the text rewraps.
    window.addEventListener("resize", function () {
      $$(".acc__item.is-open", acc).forEach(function (item) {
        var panel = $(".acc__a", item);
        panel.style.height = $(".acc__a-inner", panel).offsetHeight + "px";
      });
    });
  }

  /* =========================================================================
     Reservation form — validate, then hand off to WhatsApp
     ====================================================================== */
  function initReserveForm() {
    var form = $("#reserveForm");
    var done = $("#reserveDone");
    var again = $("#reserveAgain");
    if (!form) return;

    var dateInput = $("#rDate");
    if (dateInput) {
      var today = new Date();
      var iso = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString().slice(0, 10);
      dateInput.min = iso;
      if (!dateInput.value) dateInput.value = iso;
    }

    function setError(input, message) {
      var field = input.closest(".field");
      var slot = $('[data-error-for="' + input.id + '"]', field);
      field.classList.toggle("has-error", !!message);
      if (slot) slot.textContent = message || "";
      if (message) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    }

    function validate() {
      var ok = true;
      var name = $("#rName"), phone = $("#rPhone"), date = $("#rDate"),
          time = $("#rTime"), guests = $("#rGuests");

      if (!name.value.trim()) { setError(name, "Please tell us your name."); ok = false; }
      else setError(name, "");

      var digits = phone.value.replace(/\D/g, "");
      if (digits.length < 10) { setError(phone, "Enter a valid phone number."); ok = false; }
      else setError(phone, "");

      if (!date.value) { setError(date, "Pick a date."); ok = false; }
      else if (date.min && date.value < date.min) { setError(date, "Pick a date from today onward."); ok = false; }
      else setError(date, "");

      if (!time.value) { setError(time, "Pick a time."); ok = false; }
      else if (time.value < CONFIG.opensAt || time.value > CONFIG.closesAt) {
        setError(time, "We serve between " + CONFIG.opensAt + " and " + CONFIG.closesAt + ".");
        ok = false;
      } else setError(time, "");

      var n = parseInt(guests.value, 10);
      if (!n || n < 1 || n > 30) { setError(guests, "1 to 30 guests."); ok = false; }
      else setError(guests, "");

      if (!ok) {
        var firstBad = $(".field.has-error input, .field.has-error textarea", form);
        if (firstBad) firstBad.focus();
      }
      return ok;
    }

    function prettyDate(value) {
      var parts = value.split("-");
      var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
      return d.toLocaleDateString("en-IN", {
        weekday: "short", day: "numeric", month: "short", year: "numeric"
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;

      var notes = $("#rNotes").value.trim();
      var lines = [
        "Table reservation request — BISMI MANDI",
        "",
        "Name: " + $("#rName").value.trim(),
        "Phone: " + $("#rPhone").value.trim(),
        "Date: " + prettyDate($("#rDate").value),
        "Time: " + $("#rTime").value,
        "Guests: " + $("#rGuests").value
      ];
      if (notes) lines.push("Notes: " + notes);

      var url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");

      form.hidden = true;
      done.hidden = false;
      done.focus && done.focus();
    });

    // Clear an error as soon as the guest starts fixing it.
    $$("input, textarea", form).forEach(function (input) {
      input.addEventListener("input", function () {
        if (input.closest(".field").classList.contains("has-error")) setError(input, "");
      });
    });

    if (again) {
      again.addEventListener("click", function () {
        done.hidden = true;
        form.hidden = false;
        $("#rName").focus();
      });
    }
  }

  /* =========================================================================
     Open / closed status in the hero
     ====================================================================== */
  function initOpenStatus() {
    var wrap = $("#openStatus");
    var text = $("#openStatusText");
    if (!wrap || !text) return;

    var now = new Date();
    var mins = now.getHours() * 60 + now.getMinutes();
    function toMins(hhmm) {
      var p = hhmm.split(":");
      return +p[0] * 60 + +p[1];
    }
    var open = mins >= toMins(CONFIG.opensAt) && mins <= toMins(CONFIG.closesAt);

    wrap.classList.toggle("is-closed", !open);
    text.textContent = open
      ? "Open now · until " + CONFIG.closesAt
      : "Closed · opens " + CONFIG.opensAt;
  }

  /* =========================================================================
     QR card tilt (pointer only)
     ====================================================================== */
  function initTilt() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;

    $$("[data-tilt]").forEach(function (el) {
      var parent = el.parentElement;
      parent.addEventListener("mousemove", function (e) {
        var r = parent.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          "rotateY(" + (px * 12).toFixed(2) + "deg) rotateX(" + (-py * 12).toFixed(2) + "deg)";
      });
      parent.addEventListener("mouseleave", function () { el.style.transform = ""; });
    });
  }

  /* =========================================================================
     Boot
     ====================================================================== */
  initReveal();
  initScrollSpy();
  initCounters();
  initMenuFilter();
  initLightbox();
  initQuotes();
  initAccordion();
  initReserveForm();
  initOpenStatus();
  initTilt();
  onScroll();

  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
