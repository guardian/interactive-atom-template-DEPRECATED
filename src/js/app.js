import GoogleMap from '../components/interactive-google-map/index.html'
import AutoplayingVideo from '../components/interactive-autoplaying-video/index.html'

const el = document.querySelector(".here")

// const map = new GoogleMap({
//     target: el,
//     data: {
//         el: el,
//         config: {
//             center: { lat: 30.7316306, lng: -94.9396368 },
//             zoom: 3
//         },
//         markers: [{
//             "lat": 47.2655779,
//             "lng": -68.59197619999999,
//             "label": "A label"
//         }],
//         markerConfig: {
//             markerSize: 20,
//             infoWindowWidth: 100
//         },
//         key: "AIzaSyBGZVyAXHJwoA4Ea-a3kuD1AsuZwbrnLlM"
//     }
// })

const vid = new AutoplayingVideo({
    target: el,
    data: {
        el: el,
        poster: "http://cdn.theguardian.tv/interactive/2015/08/25/150825TwickenhamCarPark_768k_H264_poster.jpg",
        sources: {
            "small": "https://cdn.theguardian.tv/interactive/2015/08/25/150825TwickenhamCarPark_768k_H264.mp4",
            "medium": "https://cdn.theguardian.tv/interactive/2015/08/25/150825TwickenhamCarPark_2M_H264.mp4",
            "large": "https://cdn.theguardian.tv/interactive/2015/08/25/150825TwickenhamCarPark_4M_H264.mp4"
        }
    }
})

