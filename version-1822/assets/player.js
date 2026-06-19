(function () {
  function startPlayer(options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var hls = null;
    var attached = false;
    var shouldPlay = false;

    if (!video || !options.source) {
      return;
    }

    function hideOverlay() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    }

    function showOverlay() {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    }

    function playVideo() {
      var promise = video.play();
      if (promise && promise.catch) {
        promise.catch(function () {
          showOverlay();
        });
      }
    }

    function attachSource() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = options.source;
        if (shouldPlay) {
          playVideo();
        }
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(options.source);
        });
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          if (shouldPlay) {
            playVideo();
          }
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal && hls) {
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
            } else {
              hls.destroy();
            }
          }
        });
      } else {
        video.src = options.source;
        if (shouldPlay) {
          playVideo();
        }
      }
    }

    function begin() {
      shouldPlay = true;
      hideOverlay();
      attachSource();
      if (video.src || video.readyState > 0) {
        playVideo();
      }
    }

    if (overlay) {
      overlay.addEventListener('click', begin);
    }
    video.addEventListener('click', function () {
      if (!attached) {
        begin();
      }
    });
    video.addEventListener('play', hideOverlay);
    video.addEventListener('pause', function () {
      if (!video.currentTime) {
        showOverlay();
      }
    });
  }

  window.startPlayer = startPlayer;
})();
