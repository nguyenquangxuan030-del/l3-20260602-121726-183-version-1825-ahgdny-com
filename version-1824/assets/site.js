(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }

      function startTimer() {
        clearInterval(timer);
        timer = setInterval(function () {
          showSlide(index + 1);
        }, 5200);
      }

      if (slides.length > 0) {
        showSlide(0);
        startTimer();
      }

      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(index - 1);
          startTimer();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showSlide(index + 1);
          startTimer();
        });
      }

      dots.forEach(function (dot, dotIndex) {
        dot.addEventListener("click", function () {
          showSlide(dotIndex);
          startTimer();
        });
      });
    }

    var filterPanels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));

    filterPanels.forEach(function (panel) {
      var input = panel.querySelector("[data-search-input]");
      var select = panel.querySelector("[data-year-filter]");
      var targetSelector = panel.getAttribute("data-filter-panel");
      var target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      var cards = Array.prototype.slice.call(target.querySelectorAll("[data-card]"));

      function applyFilter() {
        var query = input ? input.value.trim().toLowerCase() : "";
        var yearValue = select ? select.value : "";

        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var year = card.getAttribute("data-year") || "";
          var textMatched = !query || text.indexOf(query) !== -1;
          var yearMatched = !yearValue || year === yearValue;
          card.classList.toggle("hidden-by-filter", !(textMatched && yearMatched));
        });
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }

      if (select) {
        select.addEventListener("change", applyFilter);
      }
    });
  });
})();
