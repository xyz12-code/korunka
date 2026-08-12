/* Zubní korunka — sdílený skript */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky header ---------- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobilní menu ---------- */
  var burger = document.getElementById("burger");
  var mnav = document.getElementById("mobile-nav");
  if (burger && mnav) {
    var toggleMenu = function (open) {
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Zavřít menu" : "Otevřít menu");
      mnav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () {
      toggleMenu(burger.getAttribute("aria-expanded") !== "true");
    });
    mnav.addEventListener("click", function (e) { if (e.target.closest("a")) toggleMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mnav.classList.contains("is-open")) { toggleMenu(false); burger.focus(); }
    });
  }

  /* ---------- Reveal při scrollování ---------- */
  var items = document.querySelectorAll(".rv");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  var accBtns = document.querySelectorAll(".acc__btn");
  if (accBtns.length) {
    accBtns.forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        accBtns.forEach(function (other) {
          if (other === btn) return;
          other.setAttribute("aria-expanded", "false");
          document.getElementById(other.getAttribute("aria-controls")).style.height = "0px";
        });
        btn.setAttribute("aria-expanded", String(!open));
        panel.style.height = open ? "0px" : panel.firstElementChild.offsetHeight + "px";
      });
    });
    window.addEventListener("resize", function () {
      accBtns.forEach(function (btn) {
        if (btn.getAttribute("aria-expanded") === "true") {
          var p = document.getElementById(btn.getAttribute("aria-controls"));
          p.style.height = p.firstElementChild.offsetHeight + "px";
        }
      });
    });
  }

  /* ---------- Modální okno s objednávkovým formulářem ---------- */
  var modal = document.getElementById("modal-form");
  if (modal) {
    var lastFocus = null;
    var openModal = function (typ) {
      lastFocus = document.activeElement;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      if (typ === "hygiena") { var h = document.getElementById("typ-hygiena"); if (h) h.checked = true; }
      if (typ === "lekar") { var l = document.getElementById("typ-lekar"); if (l) l.checked = true; }
      var first = modal.querySelector("input, select, textarea, button");
      if (first) first.focus();
    };
    var closeModal = function () {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    document.querySelectorAll("[data-modal-open]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(btn.getAttribute("data-modal-open"));
      });
    });
    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-modal-close]") || e.target.classList.contains("modal__bg")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- Rok v patičce ---------- */
  var rok = document.getElementById("rok");
  if (rok) rok.textContent = new Date().getFullYear();
})();
