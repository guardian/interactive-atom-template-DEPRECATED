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
  ankle.innerHTML = '<div class="ds-ankle-inner"><div class="ds-onward-one"><a href="https://gu.com/p/dvn6c"></a><img src="https://media.guim.co.uk/a4a14c05dd85b1b4aef449e76e8493690961d5e6/0_2457_4912_2944/1000.jpg"><h1>The mole man and me</h1><h3>For the artist Sue Webster, a derelict house tunnelled beneath by its former owner was a dream come true. Could architect David Adjaye help her transform it?</h3></div><div class="ds-onward-two"><a href="https://gu.com/p/dvjmd"></a><img src="https://media.guim.co.uk/edd30a44cce46ec60e64b8f79999399dd92fcc60/0_1224_8188_4915/1000.jpg"><h1>Gran designs</h1><h3>When it comes to retro style with a nod to the 80s, ask the expert</h3></div><div class="ds-onward-three"><a href="https://gu.com/p/dvnax"></a><img src="https://media.guim.co.uk/82f91895b647219ad79b6e87587cffb151b8ec24/0_4_5400_3240/1000.jpg"><h1>‘Art into nature, nature into art’</h1><h3>Fitting his architecture to its landscape, César Manrique turned Lanzarote into a living artwork of sun, sea and surprise</h3></div></div>'
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
