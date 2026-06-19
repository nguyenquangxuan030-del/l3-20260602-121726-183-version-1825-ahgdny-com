(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    if (!window.playerConfig) {
      return;
    }

    var config = window.playerConfig;
    var video = document.getElementById(config.videoId);
    var button = document.getElementById(config.buttonId);
    var hlsInstance = null;
    var prepared = false;

    if (!video || !button || !config.source) {
      return;
    }

    function attachStream() {
      if (prepared) {
        return;
      }
      prepared = true;

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 90
        });
        hlsInstance.loadSource(config.source);
        hlsInstance.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.source;
      } else {
        video.src = config.source;
      }
    }

    function playVideo() {
      attachStream();
      button.classList.add("hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          button.classList.remove("hidden");
        });
      }
    }

    button.addEventListener("click", playVideo);
    video.addEventListener("click", function () {
      if (video.paused) {
        playVideo();
      }
    });
    video.addEventListener("play", function () {
      button.classList.add("hidden");
    });
    video.addEventListener("pause", function () {
      if (!video.ended) {
        button.classList.remove("hidden");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  });
})();
