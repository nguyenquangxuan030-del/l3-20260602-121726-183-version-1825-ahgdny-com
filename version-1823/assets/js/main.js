(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function show(target) {
        if (!slides.length) {
          return;
        }
        index = (target + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === index);
        });
      }

      function startTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5600);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          startTimer();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
          startTimer();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
          startTimer();
        });
      }

      show(0);
      startTimer();
    }

    var input = document.querySelector(".js-filter-input");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-type-filter]"));
    var activeType = "all";

    if (input && input.getAttribute("data-read-query")) {
      var params = new URLSearchParams(window.location.search);
      var queryName = input.getAttribute("data-read-query");
      if (params.get(queryName)) {
        input.value = params.get(queryName);
      }
    }

    function applyFilter() {
      var value = input ? input.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var haystack = (card.getAttribute("data-search") || "").toLowerCase();
        var type = card.getAttribute("data-type") || "";
        var matchesText = !value || haystack.indexOf(value) !== -1;
        var matchesType = activeType === "all" || type.indexOf(activeType) !== -1;
        card.classList.toggle("is-hidden", !(matchesText && matchesType));
      });
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeType = chip.getAttribute("data-type-filter") || "all";
        chips.forEach(function (other) {
          other.classList.toggle("active", other === chip);
        });
        applyFilter();
      });
    });

    applyFilter();
  });
})();
