/* BISMI MANDI — website interactions: sticky nav, mobile menu, scroll reveal */
(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");

  // Solidify nav on scroll
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  function closeMenu() {
    links.classList.remove("is-open");
    toggle.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Current year in footer
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
