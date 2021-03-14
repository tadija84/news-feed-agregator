const feeds = require("./feeds");

const getArticles = async (feed) => {
    let source = [feed.logoURL, feed.name];

    return source;
}
module.exports.portali = async () => {
    return [].concat.apply(
      [],
      await Promise.all(feeds.map((feed) => getArticles(feed)))
    );
  };