# Interactive atom template

```
npm install
```

### Running locally
```
npm start
```

Go to <http://localhost:8000>

### Deploying
Fill out `config.json`:
```json
{
    "title": "Title of your interactive",
    "docData": "Any associated external data",
    "path": "year/month/unique-title"
}
```

Then run
```
npm run deploy
```

#### Checking the deploy
You can check the deploy log by running
```
npm run log
```
<b>NOTE:</b> Updates can take up to 30 seconds to show in the logs

#### Embedding into Composer
Run the command below, copy the URL into Composer and click embed.
```
npm run url
```

## Usage guide
We use [SASS](http://sass-lang.com/) for better CSS, [Babel](https://babeljs.io/) for next
generation JavaScript and [Rollup](http://rollupjs.org/) for bundling.

Interactive atoms have three components:
- CSS - `src/css/main.scss`
- HTML - `src/render.js` should generate some HTML (by default returns the contents of `src/templates/main.html`)
- JS - `src/js/main.js`, by default this simply loads `src/js/app.js`

### Loading resources (e.g. assets)
Resources must be loaded with absolute paths, otherwise they won't work when deployed.
Use the template string `<%= path %>` in any CSS, HTML or JS, it will be replaced
with the correct absolute path.

```html
<img src="<%= path %>/assets/image.png" />
```

```css
.test {
    background-image: url('<%= path %>/assets/image.png');
}
```

```js
var url = '<%= path %>/assets/image.png';
```

### Atom size
Interactive atoms are baked into the initial page response so you need to be careful about
how much weight you are adding. While CSS and HTML are unlikely to ever be that large,
you should worry about the size of your JS.

The difference between `src/js/main.js` and `src/js/app.js` is that the former is baked into
the page and the latter is not. <b>Never</b> load large libraries (such as d3) in `src/js/main.js`.
In most cases, the majority of the work should happen in `src/js/app.js` and `src/js/main.js`
should be reserved for simple initialisation.

### Loading JSON
We have a ready-built component for loading JSON files. It uses the Fetch api and includes the necessary polyfills to work on most browsers. It is only designed to be used client-side.

For example:
```
import loadJson from '../components/load-json/'

loadJson("https://interactive.guim.co.uk/...)
      .then((data) => {
	  console.log(data);
      })
```

### Components
We're now starting to build a library of reusable components that can be dropped into any project. They're built using Svelte, which has a similar API to Ractive.

In order to use each component you'll need to import it into your app.js and initialise it. Below is example code for each component.

#### YouTube player
This is an autoplaying YouTube player with looping functionality.

In your app.js:
```
import YoutubePlayer from '../components/youtube-player/index.html'

const player = new YoutubePlayer({
    target: document.querySelector(".youtube-wrapper"),
    data: {
        video: "z4Vxy_pZ7gc", // video ID
    	loop: true
    }
})
```

#### Looping HTML5 video player
This takes video files from S3 and autoplays when the player is in the browser window.
It takes 3 file sizes (small, medium and large) which are used at different browser window sizes.

In your app.js
```
import AutoplayingVideo from '../components/autoplaying-video/index.html'

const el = document.querySelector(".video-wrapper");

const video = new AutoplayingVideo({
    target: el,
    data: {
        el: el,
        sources: {
            "small": "https://interactive.guim.co.uk/2017/09/irma/irma-Monday.mp4.ff.video-new.mp4",
            "medium": "https://interactive.guim.co.uk/2017/09/irma/irma-Monday.mp4.ff.video-new.mp4", 
            "large": "https://interactive.guim.co.uk/2017/09/irma/irma-Monday.mp4.ff.video-new.mp4"
        },
        poster: "" // the poster image displays before the video loads
    }
})
```

#### Interactive table
An searchable table that can be dropped in to any project. It's split into several different elements.

Its most basic usage takes a Google Sheet in the same format as the table tool we've used previously. Example here: https://docs.google.com/spreadsheets/d/13LO5K6LWSQvHAD83fOeDO7pSKGKD-tKEgeb0qhgggys/edit#gid=0

In your app.js:
```
import SpreadsheetToTable from '../components/interactive-table/index.html'

const el = document.querySelector('.table-wrapper');

const table = new SpreadsheetToTable({
    target: el,
    data: {
        sheet: "https://interactive.guim.co.uk/docsdata-test/17swcJIV-bGKvWApff2aRsazCOWK66lAZIVW9fUMAy6A.json",
        el: el,
        truncate: 10, // the number of rows to display before adding a 'Show More' button, set to false to disable
        collapseMobile: true // useful for wide tables with many columns, collapses it down to a more mobile-friendly view
    }
});
```

In more advanced projects you may want to pass in data to the table directly. The renderTable component can therefore be used on its own.

For example:
```
import InteractiveTable from '../components/interactive-table/render.html'

const el = document.querySelector('.table-wrapper');

const table = new InteractiveTable({
    target: el,
    data: {
        el: el,
        tableData: [], // an array with an array for each row. First element must be an array of the table headers
        tableTitle: "A title here",
        truncate: 10,
        collapseMobile: true
    }
});
```

There is also a way of pre-rendering the interactive table in the render.js script, this is useful if the table is the main element on the page.

For example, in your render.js:
```
const requireUncached = require('require-uncached');

import mainTemplate from './src/templates/main.html!text'
import rp from "request-promise"
import 'svelte/ssr/register'

const Table = requireUncached('../src/components/interactive-table/render.html')

export async function render() {
	let tableData = JSON.parse(await rp("https://interactive.guim.co.uk/docsdata-test/17swcJIV-bGKvWApff2aRsazCOWK66lAZIVW9fUMAy6A.json")).sheets.tableDataSheet;
    
    let html = Table.render({
    	tableTitle: "This is a test table",
        tableData: tableData,
        serverside: true,
        collapseMobile: true,
        truncate: 10
    });

    return `<div class="here">${html}</div>`;
}
```

#### Interactive Google map
Can display a basic series of markers on a map

In your app.js:
```
import GoogleMap from '../components/interactive-google-map/index.html'

const el = document.querySelector(".wrapper")

const map = new GoogleMap({
    target: el,
    data: {
        el: el,
        config: {
        	center: { lat: 30.7316306, lng: -94.9396368 }, // the starting centre point for the map
        	zoom: 3 // the default zoom level for the map
        },
        markers: [{
            "lat": 47.2655779,
            "lng": -68.59197619999999,
            "label": "A label"
        }], // an array of markers with a lat, lng and label (shown on click)
        markerConfig: {
        	markerSize: 20,
        	infoWindowWidth: 100
        },
        key: "" // Google maps api key - REQUIRED
    }
})
```
