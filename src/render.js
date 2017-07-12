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
