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
        //console.log("this is esensial ",requests[j]);
        toReturn.push(requests[j]);
      }
    }
    return toReturn;
  } catch (e) {
    console.error("ERROR IS in sources.js",e);
  }
};

const getArticles = async (feed, reqLinks) => {
  let articles = [];
  const rss = await requestRss(feed[reqLinks]);
  rss.forEach((rssFeed) => {
    rssFeed.items.forEach((item) => {
      let imageLink = null;
      if (typeof item.enclosure !== "undefined") {
        imageLink = item.enclosure.url;
      }
      // let category=[];
      // if (item.category){
      //   category.push(item.category);
      // }
      if (
        articles.filter(
          (article) =>
            article.title === item.title && article.source === feed.name
        ).length === 0
      ) {    
        let contentToShow;
        let content;
        if(item.contentSnippet){
          contentToShow=item.contentSnippet.slice(0, 180)+"...";
          content=item.contentSnippet;
        } else{
           contentToShow="...";
           content="...";
        }
        articles.push({
          title: item.title,
          link: item.link,
          content:content,
          image: imageLink,
          date: item.isoDate,
          source: feed.name,
          logo:feed.logoURL,
          drzava: feed.drzava,
          contentToShow: contentToShow
        });
      }
    });
  });  
  return articles;
};

module.exports.source = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "links")))
  );
};
module.exports.politika = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "politika")))
  );
};
module.exports.drustvo = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "drustvo")))
  );
};
module.exports.hronika = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "hronika")))
  );
};
module.exports.vesti = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "vesti")))
  );
};
module.exports.kultura = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "kultura")))
  );
};
module.exports.zanimljivosti = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "zanimljivosti")))
  );
};
module.exports.sport = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getArticles(feed, "sport")))
  );
};