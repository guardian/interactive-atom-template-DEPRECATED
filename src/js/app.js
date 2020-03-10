import 'ophan-tracker-js';
import template from './../templates/main.html';
import replace from 'gulp-replace';

//inject HTML for AMP fix
document.getElementById('gd-timeline').innerHTML = template;


//sets position timeline is at on load
document.querySelector('.scroll-wrapper').scrollTo(200, 0);


// Window resizer
setTimeout(() => {
    if (window.resize) {
        const html = document.querySelector("html");
        const body = document.querySelector("body");
        html.style.overflow = "hidden";
        html.style.margin = "0px";
        html.style.padding = "0px";
        body.style.overflow = "hidden";
        body.style.margin = "0px";
        body.style.padding = "0px";
        window.resize();
    }
}, 100);



//scroll left and right on iframe
const scrollWrapper = document.getElementById('gd-timeline');
const mq = window.matchMedia("(min-width: 600px)");

if (mq.matches) {
    (function () {
        function scrollHorizontally(e) {
            e = window.event || e;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            scrollWrapper.scrollLeft -= (delta * 10); // Multiplied by 40
            e.preventDefault();
        }
        if (scrollWrapper.addEventListener) {
            // IE9, Chrome, Safari, Opera
            scrollWrapper.addEventListener("mousewheel", scrollHorizontally, false);
            // Firefox
            scrollWrapper.addEventListener("DOMMouseScroll", scrollHorizontally, false);
        } else {
            // IE 6/7/8
            scrollWrapper.attachEvent("onmousewheel", scrollHorizontally);
        }
    })();
}






// /thanks for feedback message
const feedbackBtn = document.querySelectorAll(".atom__button");
const feedbackBox = document.querySelector(".atom--snippet__feedback");

feedbackBtn.forEach(feedbackBtn => {
    feedbackBtn.addEventListener("click", () => {
        feedbackBox.classList.add("submitted");
    });
});



//Add url to datalake
var urlGetter = window.parent.location;
var thumbsUp = document.querySelector(".js-thumbs-up");
var thumbsDown = document.querySelector(".js-thumbs-down");
thumbsUp.setAttribute(
    "data-link-name",
    "us election timeline : thumbs-up : " + urlGetter
);
thumbsDown.setAttribute(
    "data-link-name",
    "us election timeline : thumbs-down : " + urlGetter
);
console.log(urlGetter);


// scroll timeline to show next future event
document.getElementById('gd-timeline').scrollTo(240 * 6, 0);


// disable swipe on android touch
var isAndroidApp = window.parent.document.querySelector('.android');
if (isAndroidApp) {
    document.addEventListener('touchstart', () => window.GuardianJSInterface.registerRelatedCardsTouch(true))
    document.addEventListener('touchend', () => window.GuardianJSInterface.registerRelatedCardsTouch(false))
}



console.log("v1.9");