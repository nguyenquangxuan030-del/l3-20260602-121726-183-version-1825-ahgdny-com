(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = selectAll('[data-hero-slide]', hero);
    var dots = selectAll('[data-hero-dot]', hero);
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || '0'));
      });
    });

    setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterGrid = document.querySelector('[data-filter-grid]');

  if (filterInput && filterGrid) {
    var filterCards = selectAll('[data-card]', filterGrid);
    filterInput.addEventListener('input', function () {
      var keyword = filterInput.value.trim().toLowerCase();
      filterCards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-category')
        ].join(' ').toLowerCase();
        card.style.display = text.indexOf(keyword) > -1 ? '' : 'none';
      });
    });
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchCategory = document.querySelector('[data-search-category]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchTitle = document.querySelector('[data-search-title]');

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="./movie/' + escapeHtml(movie.file) + '">',
      '    <img src="./' + escapeHtml(movie.image) + '.jpg" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-badge">' + escapeHtml(movie.type || movie.category) + '</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h3><a href="./movie/' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-list">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('');
  }

  if (searchForm && searchInput && searchResults && window.MOVIE_INDEX) {
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var keyword = searchInput.value.trim().toLowerCase();
      var category = searchCategory ? searchCategory.value : '';
      var matches = window.MOVIE_INDEX.filter(function (movie) {
        var content = [
          movie.title,
          movie.year,
          movie.region,
          movie.genre,
          movie.category,
          movie.type,
          (movie.tags || []).join(' ')
        ].join(' ').toLowerCase();
        var keywordMatched = keyword ? content.indexOf(keyword) > -1 : true;
        var categoryMatched = category ? movie.category === category : true;
        return keywordMatched && categoryMatched;
      }).slice(0, 120);

      searchTitle.textContent = matches.length ? '搜索结果' : '未找到相关内容';
      searchResults.innerHTML = matches.map(cardTemplate).join('');
    });
  }
})();
