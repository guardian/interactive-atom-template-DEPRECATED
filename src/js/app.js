import xr from 'xr'
import blocksTemplate from '../templates/blocks.html'
import Mustache from 'mustache'

// load the docs data
xr.get('https://interactive.guim.co.uk/docsdata-test/1zP92hwgF1S3hHbj5va9Qo9PADtuwjU72mkHyLDrAUqo.json').then((resp) => {
    var sheets = resp.data.sheets;

    // render just the html for the blocks
    var html = Mustache.render(blocksTemplate, sheets);

    // inject that rendered html into the empty div we declared in main.html
    document.querySelector(".interactive-blocks").innerHTML = html;
});
