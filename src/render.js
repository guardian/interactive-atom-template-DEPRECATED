import templateHTML from "./src/templates/main.html!text"

export async function render() {
    // this function just has to return a string of HTML
    // you can generate this using js, e.g. using Mustache.js

    return '<div id="gd-timeline" style="background-color:white;">&nbsp;</div>';
}



// export async function render() {
//     // this function just has to return a string of HTML
//     // you can generate this using js, e.g. using Mustache.js

//     return templateHTML;
// }