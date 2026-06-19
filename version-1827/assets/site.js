(() => {
  const menuButton = document.querySelector('[data-menu-button]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    const prev = hero.querySelector('[data-hero-prev]');
    const next = hero.querySelector('[data-hero-next]');
    let active = 0;
    let timer = null;

    const show = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === active));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === active));
    };

    const play = () => {
      clearInterval(timer);
      timer = setInterval(() => show(active + 1), 5200);
    };

    if (prev) {
      prev.addEventListener('click', () => {
        show(active - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        show(active + 1);
        play();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        show(i);
        play();
      });
    });

    show(0);
    play();
  }

  const input = document.querySelector('[data-filter-input]');
  const year = document.querySelector('[data-filter-year]');
  const region = document.querySelector('[data-filter-region]');
  const cards = Array.from(document.querySelectorAll('[data-card]'));

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get('q');

  if (input && queryValue) {
    input.value = queryValue;
  }

  const filter = () => {
    const keyword = input ? input.value.trim().toLowerCase() : '';
    const yearValue = year ? year.value : '';
    const regionValue = region ? region.value : '';

    cards.forEach((card) => {
      const haystack = (card.getAttribute('data-search') || '').toLowerCase();
      const cardYear = card.getAttribute('data-year') || '';
      const cardRegion = card.getAttribute('data-region') || '';
      const matchedKeyword = !keyword || haystack.includes(keyword);
      const matchedYear = !yearValue || cardYear === yearValue;
      const matchedRegion = !regionValue || cardRegion === regionValue;
      card.classList.toggle('is-hidden', !(matchedKeyword && matchedYear && matchedRegion));
    });
  };

  if (input || year || region) {
    if (input) {
      input.addEventListener('input', filter);
    }
    if (year) {
      year.addEventListener('change', filter);
    }
    if (region) {
      region.addEventListener('change', filter);
    }
    filter();
  }
})();
