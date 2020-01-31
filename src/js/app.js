var wrapper = document.querySelector('.bj_wrapper');
var borisClicker = document.querySelector('.bj_progress_boris');
var arrow = document.querySelector('.bj_content_arrow');
var contentStart = document.querySelector('#content-start');
var count = 0;


var options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.5
}

var observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('animate');
    } else {
      entry.target.classList.remove('animate');
    }
  });
}, options);

//scrolling animations
var els = document.querySelectorAll('.tug, .garden, .bike, .rugby, .annoyed');
els.forEach(el => observer.observe(el));


/* We define our function 🕹 */
function replaceVerticalScrollByHorizontal(event) {
  if (event.deltaY != 0) {
    // manually scroll horizonally instead
    window.scroll(window.scrollX + event.deltaY * 5, window.scrollY);

    // prevent vertical scroll
    event.preventDefault();
  }
  return;
}

window.addEventListener('wheel', replaceVerticalScrollByHorizontal);


window.addEventListener('scroll', function(){
  var width = document.querySelector('.bj_content_flex');
  var boris = document.querySelector('.bj_progress_boris');
  var scrollPercentage = 100 * this.scrollX / (width.offsetWidth - window.innerWidth);
  boris.setAttribute('style', 'left:'+scrollPercentage+'%');
  if(scrollPercentage >= 1) {
    boris.classList.add('active');
  } else {
    boris.classList.remove('active');
  }
})

borisClicker.addEventListener('click', function(){
  console.log(count);
  this.classList.add('shake');
  count ++;
  if(count === 6) {
    this.classList.add('fall');
    setTimeout(function(){
      borisClicker.classList.remove('fall');
      count = 0;
    }, 5000);
    setTimeout(function(){
      borisClicker.classList.add('putback');
    }, 5000);
    setTimeout(function(){
      borisClicker.classList.remove('putback');
    }, 6500);
  }
  setTimeout(function(){
    borisClicker.classList.remove('shake');
  }, 2000);
});

arrow.addEventListener('click', function(){
  var position = contentStart.getBoundingClientRect();
  console.log(position);
  window.scroll({
  top: 0,
  left: position.left - 20,
  behavior: 'smooth'
});
});
