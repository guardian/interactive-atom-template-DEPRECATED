import SpreadsheetToTable from '../components/interactive-table/index.html'

let el = document.querySelector('.here');
// el.innerHTML = "";

const table = new SpreadsheetToTable({
    target: el,
    data: {
        sheet: "https://interactive.guim.co.uk/docsdata-test/17swcJIV-bGKvWApff2aRsazCOWK66lAZIVW9fUMAy6A.json",
    	el: el
    }
});