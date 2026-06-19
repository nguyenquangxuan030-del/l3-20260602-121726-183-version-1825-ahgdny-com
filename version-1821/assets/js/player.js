(function () {
  var video = document.querySelector('[data-player-video]');
  var trigger = document.querySelector('[data-player-trigger]');

  if (!video) {
    return;
  }

  var stream = video.getAttribute('data-stream');
  var hlsInstance = null;

  function bindStream() {
    if (!stream || video.getAttribute('data-ready') === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      video.setAttribute('data-ready', '1');
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      video.setAttribute('data-ready', '1');
    }
  }

  function playVideo() {
    bindStream();
    video.controls = true;

    if (trigger) {
      trigger.classList.add('is-hidden');
    }

    var playPromise = video.play();

    if (playPromise && playPromise.catch) {
      playPromise.catch(function () {
        video.controls = true;
      });
    }
  }

  if (trigger) {
    trigger.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (!video.getAttribute('data-ready')) {
      playVideo();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
  });
})();
