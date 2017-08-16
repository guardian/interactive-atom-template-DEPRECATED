let scrollPos = 0;

const pTags = [].slice.apply(document.querySelectorAll(".interactive-seabed__text"));

const videoEl = document.querySelector(".interactive-seabed__video video");

const timings = [3, 14, 20, 40, 44];

const checkTags = () => {
    if (window.pageYOffset !== scrollPos) {
        scrollPos = window.pageYOffset;
        let passedPs = [];

        pTags.forEach((p, i) => {
            const bbox = p.getBoundingClientRect();

            if(bbox.top < 0) {
                passedPs.push(p);
            }
        });

        const timingToAimFor = timings[passedPs.length - 1];

        if(timingToAimFor > videoEl.currentTime) {
            videoEl.play();

            shouldPauseVideo(timingToAimFor);
        }

    }
    requestAnimationFrame(checkTags);
}

const shouldPauseVideo = (timingToAimFor) => {
    if(timingToAimFor > videoEl.currentTime) {
        requestAnimationFrame(() => {
            shouldPauseVideo(timingToAimFor);
        });
    } else {
        videoEl.pause();
    }
}

checkTags()