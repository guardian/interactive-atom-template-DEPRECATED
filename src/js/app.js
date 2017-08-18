let scrollPos = 0;

function featureTest(property, value, noPrefixes) {
    var prop = property + ':',
        el = document.createElement('test'),
        mStyle = el.style;

    if (!noPrefixes) {
        mStyle.cssText = prop + ['-webkit-', '-moz-', '-ms-', '-o-', ''].join(value + ';' + prop) + value + ';';
    } else {
        mStyle.cssText = prop + value;
    }
    return mStyle[property];
}

const pTags = [].slice.apply(document.querySelectorAll(".interactive-seabed__text"));

const videoElContainer = document.querySelector(".interactive-seabed__container");

const videoElParent = videoElContainer.querySelector(".interactive-seabed__video");

const videoEl = videoElParent.querySelector("video");

const timings = [1, 3.8, 6];

const supportsSticky = featureTest('position', 'sticky') || featureTest('position', '-webkit-sticky');

if(!supportsSticky) {
    document.body.classList.add("no-sticky");
} else {
    document.body.classList.add("has-sticky");
}

//just caching some selectors incase the browser doesn't support position: sticky

const checkTags = () => {
    let passedPs = [];

    pTags.forEach((p, i) => {
        const bbox = p.getBoundingClientRect();

        if (bbox.top < 0) {
            passedPs.push(p);
        }
    });

    const timingToAimFor = timings[passedPs.length - 1];

    if (timingToAimFor > videoEl.currentTime) {
        videoEl.play();

        shouldPauseVideo(timingToAimFor);
    }
}

const shouldPauseVideo = (timingToAimFor) => {
    if (timingToAimFor > videoEl.currentTime) {
        requestAnimationFrame(() => {
            shouldPauseVideo(timingToAimFor);
        });
    } else {
        videoEl.pause();
    }
}

const doScrollyThings = () => {
    if (window.pageYOffset !== scrollPos) {
        scrollPos = window.pageYOffset;

        checkTags();

        if (!supportsSticky) {
            fixOrUnfix();
        }
    }

    requestAnimationFrame(doScrollyThings);
}

const fixOrUnfix = () => {    const containerBBox = videoElContainer.getBoundingClientRect();
    const containerTop = containerBBox.top;

    if(containerBBox.bottom < window.innerHeight) {
        videoElParent.style.position = "";
        videoElParent.style.top = "auto";
        videoElParent.style.bottom = 0;
    } else if (videoElContainer.getBoundingClientRect().top <= 0) {
        videoElParent.style.top = "0";
        videoElParent.style.bottom = "auto";
        videoElParent.style.position = "fixed";
    } else {
        videoElParent.style.top = "0";
        videoElParent.style.bottom = "auto";
        videoElParent.style.position = "";
    }
}

doScrollyThings();