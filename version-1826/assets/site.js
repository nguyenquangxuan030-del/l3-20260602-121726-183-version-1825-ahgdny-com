(() => {
  const menuButton = document.querySelector('.mobile-menu-button');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      mobileNav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  let activeSlide = 0;
  let slideTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    activeSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  function startSlides() {
    if (slides.length < 2) {
      return;
    }

    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => {
      showSlide(activeSlide + 1);
    }, 6200);
  }

  document.querySelectorAll('[data-hero-prev]').forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(activeSlide - 1);
      startSlides();
    });
  });

  document.querySelectorAll('[data-hero-next]').forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(activeSlide + 1);
      startSlides();
    });
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startSlides();
    });
  });

  showSlide(0);
  startSlides();

  const params = new URLSearchParams(window.location.search);
  const queryValue = params.get('q') || '';
  const scopes = Array.from(document.querySelectorAll('.filter-scope'));

  scopes.forEach((scope) => {
    const input = scope.querySelector('.js-filter-input');
    const year = scope.querySelector('.js-filter-year');
    const type = scope.querySelector('.js-filter-type');
    const cards = Array.from(document.querySelectorAll('.movie-card[data-title]'));
    const empty = document.querySelector('.empty-filter');

    if (input && queryValue) {
      input.value = queryValue;
    }

    function applyFilter() {
      const q = input ? input.value.trim().toLowerCase() : '';
      const y = year ? year.value : '';
      const t = type ? type.value : '';
      let visible = 0;

      cards.forEach((card) => {
        const haystack = [
          card.dataset.title || '',
          card.dataset.region || '',
          card.dataset.type || '',
          card.dataset.tags || ''
        ].join(' ').toLowerCase();
        const yearMatch = !y || card.dataset.year === y;
        const typeMatch = !t || (card.dataset.type || '').includes(t) || (card.dataset.tags || '').includes(t);
        const queryMatch = !q || haystack.includes(q);
        const show = yearMatch && typeMatch && queryMatch;

        card.style.display = show ? '' : 'none';

        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    [input, year, type].forEach((control) => {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  });

  window.initMoviePlayer = function initMoviePlayer(source) {
    const video = document.querySelector('.player-video');
    const cover = document.querySelector('.player-cover');
    const button = document.querySelector('.player-start');
    const status = document.querySelector('.player-status');
    let attached = false;
    let hls = null;

    if (!video || !source) {
      return;
    }

    function setStatus(text) {
      if (status) {
        status.textContent = text;
      }
    }

    function attachSource() {
      if (attached) {
        return Promise.resolve();
      }

      attached = true;
      setStatus('正在载入');

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return Promise.resolve();
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        return new Promise((resolve) => {
          hls.on(window.Hls.Events.MANIFEST_PARSED, resolve);
          hls.on(window.Hls.Events.ERROR, () => {
            setStatus('视频暂时无法播放');
          });
        });
      }

      video.src = source;
      return Promise.resolve();
    }

    function playVideo() {
      attachSource()
        .then(() => video.play())
        .then(() => {
          if (cover) {
            cover.classList.add('is-hidden');
          }
          setStatus('');
        })
        .catch(() => {
          setStatus('视频暂时无法播放');
        });
    }

    function toggleVideo() {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (cover) {
      cover.addEventListener('click', playVideo);
    }

    video.addEventListener('click', toggleVideo);
    video.addEventListener('play', () => {
      if (cover) {
        cover.classList.add('is-hidden');
      }
      setStatus('');
    });

    video.addEventListener('ended', () => {
      if (cover) {
        cover.classList.remove('is-hidden');
      }
    });

    window.addEventListener('beforeunload', () => {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
