// javascript goes here

import axios from 'axios'
import Handlebars from 'handlebars/dist/handlebars'
import listTemplate from "../templates/people.html"


var content = Handlebars.compile(
        listTemplate, {
            compat: true
        }
    );

function init() {
    axios.get(`https://interactive.guim.co.uk/docsdata-test/1zDAIt72gpuRZZrnj65DLlLP5xb0VtZN9LJkgdrjJvak.json`).then((resp) => {

        console.log(resp)
        var data = resp.data.sheets.Sheet1;

        console.log(data)

        var newHTML = content(data);

        document.querySelector(".interactive-wrapper").innerHTML = newHTML;

    });
}

init()
