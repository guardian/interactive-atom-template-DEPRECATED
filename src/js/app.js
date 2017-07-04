import Table from '../components/interactive-table/index.html'

let el = document.querySelector('.here');
// el.innerHTML = "";

const table = new Table({
    target: el,
    data: {
        name: 'test',
        sheet: "https://interactive.guim.co.uk/docsdata-test/17swcJIV-bGKvWApff2aRsazCOWK66lAZIVW9fUMAy6A.json"
    }
});
