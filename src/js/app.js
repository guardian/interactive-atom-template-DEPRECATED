// js code here
import Swiper from "swiper";

var fastSpeed = 400;
var slowSpeed = 12000;

var swiper = new Swiper('.swiper-container-2', {
    slidesPerView: 3,
    centeredSlides: false,
    spaceBetween: 1,
    loop: true,
    // grabCursor: true,
    // freeMode: true,
    roundLengths: true,
    autoplay: {
        delay: 0,
        disableOnInteraction: true
    },
    breakpoints: {
        320: {
            slidesPerView: 1.2,
            spaceBetween: 1
        },
        660: {
            slidesPerView: 1.6,
            spaceBetween: 1
        },
        980: {
            slidesPerView: 2.1,
            spaceBetween: 1
        }
    },
    speed: slowSpeed
});

var i = 0;

swiper.forEach(swipe => {
    var index = i;
    swiper[index].on('touchStart', function (e) {
        onSliderTouchStart(index);
    });
    swiper[index].on('touchEnd', function (e) {
        onSliderTouchEnd(index);
    });
    swiper[index].on('slideChangeTransitionEnd', function (e) {
        onSliderTransitionEnd(index);
    });
    i++;
});

function onSliderTransitionEnd(ind) {
    swiper[ind].autoplay.start();
    swiper[ind].params.speed = slowSpeed;
}

function onSliderTouchStart(ind) {
    swiper[ind].autoplay.stop();
    swiper[ind].params.speed = fastSpeed;
}

function onSliderTouchEnd(ind) {

    var spd;

    if (swiper[ind].touches.diff > 0) {
        //swiper[ind].slideToClosest(300);
        spd = 450;
        //swiper[ind].slideNext();
    } else {
        spd = 350;
        swiper[ind].autoplay.start();

    }
    swiper[ind].params.speed = spd;
    swiper[ind].el.classList.add("ease");
    //console.log(swiper[ind]);


    setTimeout(function () {
        updateSliderTransitions(ind);
    }, (spd - 10));

}

function updateSliderTransitions(ind) {
    //console.log("fired2");
    swiper[ind].params.speed = slowSpeed;
    swiper[ind].el.classList.remove("ease");
    swiper[ind].autoplay.start();
}



if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {

    i = 0;

    swiper.forEach(swipe => {
        var index = i;
        swiper[index].wrapperEl.addEventListener("touchstart", function () {
            window.GuardianJSInterface.registerRelatedCardsTouch(true);
        });
        swiper[index].wrapperEl.addEventListener("touchend", function () {
            window.GuardianJSInterface.registerRelatedCardsTouch(false);
        });
        i++;
    });
}