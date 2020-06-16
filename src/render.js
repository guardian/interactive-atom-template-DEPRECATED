// import templateHTML from "./src/templates/main.html!text"

// export async function render() {
//     // this function just has to return a string of HTML
//     // you can generate this using js, e.g. using Mustache.js

//     return templateHTML;
// }



import mainTemplate from './src/templates/main.html!text'
import Mustache from 'mustache'
import rp from 'request-promise'

export function render() {
    return rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/19EgJWnDc_zEKgPj3C-jjNio58yVPuDdJpMIar0qEe3o.json',
        json: true
    }).then((data) => {
        var sheets = data.sheets;
        console.log(sheets);
        var html = Mustache.render(mainTemplate, sheets);
        return html;
    });
}