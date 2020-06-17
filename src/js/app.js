// js code here
const defaultHeight = "300px";
const openedHeight = "100%";
const readLess = `<svg width="34" height="17" viewBox="0 0 34 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 15.5833L16.2237 3.10933e-07H17.7763L34 15.5833L32.4863 17L17 4.47368L1.5137 17L0 15.5833Z" fill="#ffffff"/>
</svg>Read less`;
const readMore = `<svg width="34" height="18" viewBox="0 0 34 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M0.0771484 1.7592L16.2271 17.9092H17.7726L33.9226 1.7592L32.4158 0.291016L16.9999 13.2728L1.58397 0.291016L0.0771484 1.7592Z" fill="#ffffff" /></svg>Read more`;

var openButtons = document.querySelectorAll(".open-button");
for (i = 0; i < openButtons.length; i++) {
    openButtons[i].addEventListener("click", function () {
        var openMe = this.parentNode;
        openMe.classList.toggle("open");
        this.classList.toggle("open");
        console.log(this.classList);
        if (this.classList.contains("open")) {
            this.innerHTML = readLess;
        } else {
            this.innerHTML = readMore;
            openMe.scrollIntoView();
        }
    });
}

//spotifyPlayer
var Spotify = require("spotify-web-api-js");
var s = new Spotify();
const spotifyApi = new SpotifyWebApi();

spotifyApi.setAccessToken("6d110e414c7c4d3fa88761aad7d2e1d6");

spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', function (err, data) {
    if (err) console.error(err);
    else console.log('Artist albums', data);
});

// get Elvis' albums, using Promises through Promise, Q or when
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
    function (data) {
        console.log('Artist albums', data);
    },
    function (err) {
        console.error(err);
    }
);

// spotifyApi.searchTracks("Love").then(
//     function (data) {
//         console.log('Search by "Love"', data);

// var artistNames = document.querySelectorAll('[[selector]]');
// var player = document.querySelector('player');
//
// for(i = 0; i < artistNames.length; i++) {
//   if(data.track.artistname === artistNames[i]){
//     var tracklink = data.track.previewMP4;
//     player.src = tracklink;
//   }
// }
//     },
//     function (err) {
//         console.error(err);
//     }
// );

// playbutton.addEventlistner("click", function () {
// player.src = tracklink;
//
// if(!player[i].pause()){
//   player[i].play();
// } else {
//   player[i].pause()
// }
// });