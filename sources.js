const Parser = require('rss-parser');
const parser = new Parser({
    headers: {
        'Accept': 'application/xhtml+xml,application/xml,application/rss+xml'
    }
});
const { radioNzUrls } = require('./feedUrls');


const requestRss = async (urls) => {
    return await Promise.all(urls.map(url => parser.parseURL(url)));
};

const radioNz = async () => {
    let articles = [];
    const rss = await requestRss(radioNzUrls);

    rss.forEach(feed => {
        articles = articles.concat(feed.items.map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet,
            date: item.isoDate
        })));
    });
    
    return articles;
};

(async () => {
    const rnz = await radioNz();
    console.log(rnz);
})();