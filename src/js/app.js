// js code here

var headline = document.querySelector('.content__headline');
var split = headline.innerHTML.split(':');
headline.innerHTML = '<span class="kicker">'+ split[0] +'</span>' + '<span class="headline">'+ split[1] +'</span>';
console.log(headline);
console.log(split);
