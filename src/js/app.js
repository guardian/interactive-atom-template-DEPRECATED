import GoogleMap from '../components/interactive-google-map/index.html'

const el = document.querySelector(".here")

console.log(el);

const map = new GoogleMap({
    target: el,
    data: {
        el: el,
        config: {
        	center: { lat: 30.7316306, lng: -94.9396368 },
        	zoom: 3
        },
        markers: [{
            "lat": 47.2655779,
            "lng": -68.59197619999999,
            "label": "A label"
        }],
        markerConfig: {
        	markerSize: 20,
        	infoWindowWidth: 100
        },
        key: "AIzaSyBGZVyAXHJwoA4Ea-a3kuD1AsuZwbrnLlM"
    }
})