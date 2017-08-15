const requireUncached = require('require-uncached');

import mainTemplate from './src/templates/main.html!text'
import rp from "request-promise"
import 'svelte/ssr/register'

const Table = requireUncached('../src/components/interactive-table/render.html')

export async function render() {
    return `<div class="here"></div>`;
}
