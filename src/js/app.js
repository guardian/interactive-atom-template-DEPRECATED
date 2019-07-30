const wrapperEl = document.querySelector('.gv-timeline');

window.addEventListener('scroll', function(e) {
  const wrapperBBox = wrapperEl.getBoundingClientRect();
  const percentageScrolled = (wrapperBBox.top > 0) ? 0 : Math.abs(wrapperBBox.top) / wrapperBBox.height;

  if (percentageScrolled >= 0.5) {
    document.querySelector('.gv-photoblock__two').style.display="block";
    document.querySelector('.gv-photoblock__one').style.display="none";
  } else {
    document.querySelector('.gv-photoblock__two').style.display="none";
    document.querySelector('.gv-photoblock__one').style.display="block";
  }
});
