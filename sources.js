const Parser = require('rss-parser');
const parser = new Parser({
    headers: {
        'Accept': 'application/xhtml+xml,application/xml,application/rss+xml'
    }
});
const feeds = require('./feeds');


const requestRss = async (urls) => {
    return await Promise.all(urls.map(url => parser.parseURL(url)));
};

const getArticles = async (feed) => {
    let articles = [];
    const rss = await requestRss(feed.links);

    rss.forEach(rssFeed => {
        rssFeed.items.forEach(item => {
            let imageLink = null;
            if (typeof item.enclosure !== 'undefined') {
                imageLink = item.enclosure.url;
            }

            if (articles.filter(article => (article.title === item.title) && (article.source === feed.name)).length === 0) {
                articles.push({
                    title: item.title,
                    link: item.link,
                    content: item.contentSnippet,
                    image: imageLink,
                    date: item.isoDate,
                    source: feed.name
                });
            }
        });
    });

    return articles;
};

module.exports = async () => {
    return [].concat.apply([], await Promise.all(feeds.map(feed => getArticles(feed))));
};