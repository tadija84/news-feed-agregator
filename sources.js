const Parser = require("rss-parser");
const parser = new Parser({
  headers: {
    Accept: "application/xhtml+xml,application/xml,application/rss+xml",
  },
});
const feeds = require("./feeds");

const requestRss = async (urls) => {
  try {
    const feedLinks = urls.map((url) => parser.parseURL(url));
    //ovde je i dalje array
    //const requests =await Promise.race(feedLinks); //ovde je umesto Promise.race bio Promise.allSetled
    const requests = [];
    for (let i = 0; i < feedLinks.length; i++) {
      let newFeed = await (feedLinks[i]);
      requests.push(newFeed);
    }
   // console.log("requests su ovde "+requests[0].title);//ovde je niz objekata
    //const toReturn = requests.filter((request) => request.status === "fulfilled").map((request) => request.value);
    const toReturn = [];
    for(let j=0;j<requests.length; j++){
      if(requests[j]){
        toReturn.push(requests[j])
      }
    }
    return toReturn;
  } catch (e) {
    console.error("ERROR IS",e);
  }
};

const getArticles = async (feed) => {
  let articles = [];

  const rss = await requestRss(feed.links);
  rss.forEach((rssFeed) => {
    rssFeed.items.forEach((item) => {
      let imageLink = null;
      if (typeof item.enclosure !== "undefined") {
        imageLink = item.enclosure.url;
      }
      if (
        articles.filter(
          (article) =>
            article.title === item.title && article.source === feed.name
        ).length === 0
      ) {
        articles.push({
          title: item.title,
          link: item.link,
          content: item.contentSnippet,
          image: imageLink,
          date: item.isoDate,
          source: feed.name,
        });
      }
    });
  });  
  return articles;
 
};

module.exports = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed)))
  );
};
