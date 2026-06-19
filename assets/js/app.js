(function() {
    var toggle = document.querySelector(".mobile-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", function() {
            mobileNav.classList.toggle("open");
        });
    }

    var hero = document.querySelector(".hero");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dots button"));
        var prev = hero.querySelector(".hero-prev");
        var next = hero.querySelector(".hero-next");
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function() {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function() {
                show(current - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                show(current + 1);
                start();
            });
        }

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                show(index);
                start();
            });
        });

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function normalize(value) {
        return (value || "").toString().toLowerCase().trim();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function(scope) {
        var container = scope.parentElement || document;
        var cards = Array.prototype.slice.call(container.querySelectorAll(".movie-card, .rank-row"));
        var searchInput = scope.querySelector(".js-search-input");
        var filters = Array.prototype.slice.call(scope.querySelectorAll(".js-filter"));

        function apply() {
            var query = normalize(searchInput ? searchInput.value : "");
            var selected = {};
            filters.forEach(function(filter) {
                selected[filter.getAttribute("data-filter")] = normalize(filter.value);
            });

            cards.forEach(function(card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.textContent
                ].join(" "));
                var ok = !query || haystack.indexOf(query) !== -1;

                Object.keys(selected).forEach(function(key) {
                    if (selected[key] && normalize(card.getAttribute("data-" + key)) !== selected[key]) {
                        ok = false;
                    }
                });

                card.hidden = !ok;
            });
        }

        if (searchInput) {
            searchInput.addEventListener("input", apply);
        }

        filters.forEach(function(filter) {
            filter.addEventListener("change", apply);
        });
    });
})();
