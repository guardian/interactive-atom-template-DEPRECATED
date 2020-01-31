import mainTemplate from './src/templates/main.html!text'
import Mustache from 'mustache'
import rp from 'request-promise'

export function render() {
    return rp({
        uri: 'https://interactive.guim.co.uk/docsdata-test/1GlbtduHKO486SoYd7QnX__F4Fph16mIP2q9sHet-w8A.json',
        json: true
    }).then((data) => {
        var sheets = data.sheets;
        var html = Mustache.render(mainTemplate, sheets);
        return html;
    });
}
