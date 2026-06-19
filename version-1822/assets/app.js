(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-mobile-toggle]');
    var panel = document.querySelector('[data-mobile-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-open');
      button.textContent = panel.classList.contains('is-open') ? '×' : '☰';
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero-carousel]');
    if (!root) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', root);
    var dots = selectAll('[data-hero-dot]', root);
    var prev = root.querySelector('[data-hero-prev]');
    var next = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        start();
      });
    }
    show(0);
    start();
  }

  function setupCatalogFilter() {
    var grid = document.querySelector('[data-catalog-grid]');
    if (!grid) {
      return;
    }
    var cards = selectAll('.movie-card', grid);
    var searchInput = document.querySelector('[data-catalog-search]');
    var yearSelect = document.querySelector('[data-catalog-year]');
    var typeSelect = document.querySelector('[data-catalog-type]');
    var empty = document.querySelector('[data-catalog-empty]');

    function norm(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var keyword = norm(searchInput && searchInput.value);
      var year = norm(yearSelect && yearSelect.value);
      var type = norm(typeSelect && typeSelect.value);
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.dataset.title,
          card.dataset.year,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.region
        ].join(' ').toLowerCase();
        var ok = (!keyword || haystack.indexOf(keyword) !== -1) &&
          (!year || norm(card.dataset.year) === year) &&
          (!type || norm(card.dataset.type) === type);
        card.style.display = ok ? '' : 'none';
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    [searchInput, yearSelect, typeSelect].forEach(function (item) {
      if (item) {
        item.addEventListener('input', apply);
        item.addEventListener('change', apply);
      }
    });
  }

  function movieCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + movie.url + '">' +
      '<img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-glow"></span><span class="play-badge">▶</span>' +
      '</a>' +
      '<div class="movie-info">' +
      '<div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
      '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
      '<p>' + escapeHtml(movie.oneLine) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '</div>' +
      '</article>';
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function setupSearchPage() {
    var results = document.querySelector('[data-search-results]');
    var input = document.querySelector('[data-site-search-input]');
    var form = document.querySelector('[data-site-search-form]');
    if (!results || !input || !form || !window.MOVIES) {
      return;
    }
    var title = document.querySelector('[data-search-title]');
    var empty = document.querySelector('[data-search-empty]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    input.value = query;

    function norm(value) {
      return String(value || '').trim().toLowerCase();
    }

    function render(value) {
      var q = norm(value);
      var movies = window.MOVIES.filter(function (movie) {
        var haystack = [movie.title, movie.year, movie.type, movie.region, movie.genre, movie.category, (movie.tags || []).join(' '), movie.oneLine].join(' ').toLowerCase();
        return !q || haystack.indexOf(q) !== -1;
      }).slice(0, 96);
      results.innerHTML = movies.map(movieCard).join('');
      if (title) {
        title.textContent = q ? '搜索结果' : '精选推荐';
      }
      if (empty) {
        empty.classList.toggle('is-visible', movies.length === 0);
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var q = input.value.trim();
      var nextUrl = q ? 'search.html?q=' + encodeURIComponent(q) : 'search.html';
      history.replaceState(null, '', nextUrl);
      render(q);
    });

    selectAll('[data-search-tag]').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = button.dataset.searchTag;
        form.dispatchEvent(new Event('submit'));
      });
    });

    input.addEventListener('input', function () {
      render(input.value);
    });

    render(query);
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupCatalogFilter();
    setupSearchPage();
  });
})();
