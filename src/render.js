import mainTemplate from './src/templates/main.html!text'
import Mustache from 'mustache'
import rp from 'request-promise'

export function render() {
    return rp({
        uri: 'https://content.guardianapis.com/us-news/live/2020/feb/06/donald-trump-speech-impeachment-verdict-romney-buttigieg-sanders-biden-live-latest-news?format=json&api-key=teleporter-view&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all',
        json: true
    }).then((data) => {
        var newData = data.response.content;
        var html = Mustache.render(mainTemplate, newData);
        return html;
    });
}
