function checkLocation(){
    if (localStorage && localStorage.getItem('gu.geolocation')) {
      if (["GB"].includes(JSON.parse(localStorage.getItem('gu.geolocation') ).value)) {
        return 'uk';
      } else if(["US"].includes(JSON.parse(localStorage.getItem('gu.geolocation') ).value)) {
        return 'us';
      } else if (["AU"].includes(JSON.parse(localStorage.getItem('gu.geolocation') ).value)) {
        return 'aus'
      } else {
        return 'uk'
      }
    }
  }
checkLocation();  
  
  if(checkLocation() === 'uk'){
    document.querySelector('.regional').classList.add('uk');
  } else if(checkLocation() === 'us') {
    document.querySelector('.regional').classList.add('us');
  } else if (checkLocation() === 'aus') {
    document.querySelector('.regional').classList.add('aus');
  }