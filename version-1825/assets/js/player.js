(function() {
    function bootPlayer(shell) {
        var video = shell.querySelector("video");
        var trigger = shell.querySelector(".play-overlay");
        var stream = shell.getAttribute("data-stream");
        var attached = false;
        var hls = null;

        if (!video || !stream) {
            return;
        }

        function attach() {
            if (attached) {
                return;
            }

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
                attached = true;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    maxBufferLength: 45,
                    enableWorker: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                attached = true;
                return;
            }

            video.src = stream;
            attached = true;
        }

        function play() {
            attach();
            shell.classList.add("is-playing");
            video.controls = true;
            var promise = video.play();
            if (promise && typeof promise.catch === "function") {
                promise.catch(function() {
                    shell.classList.remove("is-playing");
                });
            }
        }

        if (trigger) {
            trigger.addEventListener("click", play);
        }

        video.addEventListener("click", function() {
            if (video.paused) {
                play();
            }
        });

        video.addEventListener("play", function() {
            shell.classList.add("is-playing");
        });

        video.addEventListener("error", function() {
            if (hls) {
                hls.destroy();
                hls = null;
                attached = false;
            }
        });
    }

    document.querySelectorAll("[data-player]").forEach(bootPlayer);
})();
