import mainTemplate from './src/templates/main.html!text'

import 'svelte/ssr/register'

import Table from '../src/components/interactive-table/render.html'

export async function render() {
    let html = Table.render({
        tableData: [
            [
                "Afghanistan",
                "32.5",
                "33",
                "57",
                "19",
                "43",
                "13"
            ]
        ]
    });

    return `<div class="here">${html}</div>`;
}
