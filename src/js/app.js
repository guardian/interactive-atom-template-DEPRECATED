var navigation = document.querySelector('.ds-navigation');
var header = document.querySelector('.ds-header');
var headerRight = document.querySelector('.ds-header-right');
var innerNav = document.querySelector('.ds-navigation-display');
var footer = document.querySelector('.l-footer');

function elementInViewport(el) {
  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    (top + 200) >= window.pageYOffset &&
    left >= window.pageXOffset &&
    (top + height - 200) <= (window.pageYOffset + window.innerHeight) &&
    (left + width) <= (window.pageXOffset + window.innerWidth)
  );
}

function insertLinks(footer){
var childNode = document.querySelector('.footer__primary');
var ankle = document.createElement('div');
ankle.classList.add('ds-ankle');
ankle.innerHTML = '<div class="ds-ankle-inner"><div class="ds-onward-one"><a href="https://gu.com/p/d799k"></a><img src="https://media.guim.co.uk/725576962d0c23ccb3345d777018f9ae19f52944/0_0_4100_2461/1000.jpg"><h1>Walk this way</h1><h3>Forget po-faced models stepping in straight lines down the catwalk. Sashaying, hip swaying, marching and dancing are in. Eilley Violet Bramley examines how a new generation are having fun on the runway.</h3></div><div class="ds-onward-two"><a href="https://gu.com/p/d79tb"></a><img src="https://media.guim.co.uk/297d992e55e03e785c13fb700e39897840d111ea/0_918_4480_2688/1000.jpg"><h1>Out there</h1><h3>Can their three decades together help Andreas Kronthaler distract Vivienne Westwood from saving the planet for long enough to prepare for Paris fashion week?</h3></div><div class="ds-onward-three"><a href="https://gu.com/p/d79te"></a><img src="https://media.guim.co.uk/46dc1748f10715e9d79209d72da9df9a3bee4130/0_246_5197_3118/1000.jpg"><h1>Horse & I</h1><h3>Gucci’s latest ad campaign stars them, Margiela’s last couture show was inspired by one. Fashion has a thing about horses and equine therapy is particularly hot to trot. Hannah Marriott does some field research </h3></div></div>'
footer.insertBefore(ankle, childNode);
}

function hoverNav(nav, innerNav){
  nav.addEventListener('mouseover', function(){
    console.log('mouseover');
    this.classList.add('mouseover');
    innerNav.classList.add('mouseover');
  });
  nav.addEventListener('mouseout', function(){
    console.log('mouseover');
    this.classList.remove('mouseover');
    innerNav.classList.remove('mouseover');
  });
}

function scroll(header){
  document.addEventListener('scroll', function(){
    console.log(header);
    var headerposition = header.getBoundingClientRect();
    var windowHeight = window.innerHeight;
    var percentage = (headerposition.bottom / windowHeight) * 100;
    var opacity = (percentage / 100);
    headerRight.style.opacity = opacity;

    var images = document.querySelectorAll('.element-image');

    for(var i=0; i < images.length; i++){
      if(elementInViewport(images[i])) {
        images[i].classList.add('inView');
      }else {
        images[i].classList.remove('inView');
      }
    }
  },header);
}

function init(){
  hoverNav(navigation, innerNav);
  scroll(header);
  insertLinks(footer);
};

init();
