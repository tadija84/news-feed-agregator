const Parser = require('rss-parser');
const parser = new Parser({
    headers: {
        'Accept': 'application/xhtml+xml,application/xml,application/rss+xml'
    }
});
const { radioNzUrls, stuffUrls, spinoffUrls, scoopUrls, interestUrls, odtUrls } = require('./feedUrls');


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
            image: null,
            date: item.isoDate,
            source: 'Radio NZ'
        })));
    });
    
    return articles;
};

const stuff = async () => {
    let articles = [];
    const rss = await requestRss(stuffUrls);

    rss.forEach(feed => {
        articles = articles.concat(feed.items.map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet,
            image: item.enclosure.url,
            date: item.isoDate,
            source: 'Stuff'
        })));
    });

    return articles;
};

const spinoff = async () => {
    let articles = [];
    const rss = await requestRss(spinoffUrls);
    
    rss.forEach(feed => {
        articles = articles.concat(feed.items.map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet,
            image: null,
            date: item.isoDate,
            source: 'The Spinoff'
        })));
    });

    return articles;
}

const scoop = async () => {
    let articles = [];
    const rss = await requestRss(scoopUrls);

    rss.forEach(feed => {
        articles = articles.concat(feed.items.map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet,
            image: null,
            date: item.isoDate,
            source: 'Scoop'
        })));
    });

    return articles;
};

const interest = async () => {
    let articles = [];
    const rss = await requestRss(interestUrls);

    rss.forEach(feed => {
        articles = articles.concat(feed.items.map(item => ({
            title: item.title,
            link: item.link,
            content: null,
            image: null,
            date: item.isoDate,
            source: 'Interest'
        })));
    });

    return articles;
};

const odt = async () => {
    let articles = [];
    const rss = await requestRss(odtUrls);

    rss.forEach(feed => {
        articles = articles.concat(feed.items.map(item => ({
            title: item.title,
            link: item.link,
            content: item.contentSnippet,
            image: null,
            date: item.isoDate,
            source: 'Otago Daily Times'
        })));
    });

    return articles;
};

module.exports = async () => {
    return [].concat.apply([], await Promise.all([radioNz(), stuff(), spinoff(), scoop(), interest(), odt()]));
};