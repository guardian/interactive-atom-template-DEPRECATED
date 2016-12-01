import mainTemplate from './src/templates/main.html!text'
import headerTemplate from './src/templates/header.html!text'
import Mustache from 'mustache'
import rp from 'request-promise'

var partialTemplates = {
	"header": headerTemplate
};

export function render() {
    return rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/1zP92hwgF1S3hHbj5va9Qo9PADtuwjU72mkHyLDrAUqo.json',
        json: true
    }).then((data) => {
        var sheets = data.sheets;
        var html = Mustache.render(mainTemplate, sheets, partialTemplates);
        return html;
    });
}

// alternatively, you can do this using an async function and 'await' - only in render.js, not in main.js or app.js (slightly cleaner code):
// export async function render() {
//     var data = await rp({
//         uri: 'https://interactive.guim.co.uk/docsdata-test/1zP92hwgF1S3hHbj5va9Qo9PADtuwjU72mkHyLDrAUqo.json',
//         json: true
//     });

//     var sheets = data.sheets;
//     var html = Mustache.render(mainTemplate, sheets);
//     return html;
// }

// you can only use request-promise (rp) in render.js (not main.js or app.js) as it's built specifically to run in Node rather than in the browser. 
// in app.js and main.js you can use something like reqwest or xr, which are made to run in the browser rather than in Node