import Mustache from "mustache"
import immersiveHTML from "./src/templates/immersive-scaffolding/main.html!text"
import immersiveHeaderHTML from "./src/templates/immersive-scaffolding/header.html!text"
import rp from "request-promise"


const clean = async(immersiveData) => {
    const relatedContentLink = immersiveData.header.url.replace(/^(?:https:\/\/(www.)theguardian.com)/g, "")
    const relatedContent = await rp({uri: `https://api.nextgen.guardianapps.co.uk/related/${relatedContentLink}.json?exclude-tag=tone/advertisement-features&exclude-tag=guardian-professional/guardian-professional`, json: true});

    const cleanedBlocks = immersiveData.body.blocks.map(b => {
        if(b.type === "copy") {
            b.text = b.text.split("\r\n\r\n\r\n");
        }
        b[b.type] = true;
        return b;
    }); 

    immersiveData.body.blocks = cleanedBlocks;

    immersiveData.twitterLink = 'https://twitter.com/intent/tweet?text=' + encodeURI(immersiveData.header.shareText) + '&url=' + encodeURIComponent(immersiveData.header.url + '?CMP=share_btn_tw');
    immersiveData.facebookLink = 'https://www.facebook.com/dialog/share?app_id=180444840287&href=' + encodeURIComponent(immersiveData.header.url + '?CMP=share_btn_fb');
    immersiveData.emailLink = 'mailto:?subject=' + encodeURIComponent(immersiveData.header.shareText) + '&body=' + encodeURIComponent(immersiveData.header.url + '?CMP=share_btn_link');
    immersiveData.relatedContent = relatedContent.html;
    return immersiveData;
}
 
export async function render() {
    const data = await clean(await rp({uri: "https://interactive.guim.co.uk/docsdata-test/1hiZyqgeU6tuo8lAvYB4KDo3GbNt1ZvyD2-ifqlFRVx4.json", json: true}));
    
    return Mustache.render(immersiveHTML, data, {"header": immersiveHeaderHTML});
}     