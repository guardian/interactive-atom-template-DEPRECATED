import loadJson from '../components/load-json/'
import { App } from './modules/applet'


function getURLParams(paramName) {

	const params = window.parent.location.search.substring(1).split("&")

    for (let i = 0; i < params.length; i++) {
    	let val = params[i].split("=");
	    if (val[0] == paramName) {
	        return val[1];
	    }
	}
	return null;

}

const key = getURLParams('key') //"10k7rSn5Y4x0V8RNyQ7oGDfhLvDqhUQ2frtZkDMoB1Xk"

if ( key != null ) {

	loadJson(`https://interactive.guim.co.uk/docsdata/${key}.json`)
	      .then((data) => {
	      	let googledoc = data.sheets.data;
	      	new App(googledoc)
	      })

}





