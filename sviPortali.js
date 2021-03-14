const feeds = require("./feeds");

const getSources = async (feed) => {
  let source = { logo: feed.logoURL, name: feed.name };
  return source;
};

module.exports.portali = async () => {
  return [].concat.apply(
    [],
    await Promise.all(feeds.map((feed) => getSources(feed)))
  );
};
