import templateHTML from "./src/templates/main.html!text"
import Handlebars from 'handlebars/dist/handlebars'

export async function render() {
    // this function just has to return a string of HTML
    // you can generate this using js, e.g. using Mustache.js

    return templateHTML;
}
