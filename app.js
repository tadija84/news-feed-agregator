const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const Datastore = require("nedb");

const { existsAsync, setAsync, getAsync } = require("./redis");
const {
  source,
  politika,
  drustvo,
  vesti,
  kultura,
  zanimljivosti,
  sport,
} = require("./sources");
const { portali } = require("./sviPortali");
const moment = require("moment-timezone");
var cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;
const database = new Datastore("database.db");
database.loadDatabase();

// const Parser = require("rss-parser");
// const parser = new Parser({
//   headers: {
//     Accept: "application/xhtml+xml,application/xml,application/rss+xml",
//   },
// });

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.get("/", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
 
  let articles = null;
  if ((await existsAsync("articles")) === 1) {
    articles = JSON.parse(await getAsync("articles"));
  } else {
    articles = await source();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    await setAsync("articles", 1800, JSON.stringify(articles));
  }
  // articles.forEach((article) => {
  // console.log("category is", article.category)});
  return res.render("index", { articles, moment, title: "Home", timelapseint });
});
// app.get("/", async (req, res) => {
//   let timelapseint = await req.cookies["timelapseint"];
//   if (!timelapseint) {
//    timelapseint = 604800000;
//  }
//   let articles = await source();
//   articles.sort((a, b) => new Date(b.date) - new Date(a.date));
//   await setAsync("articles", 1800, JSON.stringify(articles));
//   return res.render("index", {
//     articles,
//     moment,
//     title: "Home",
//     timelapseint,
//   });
// });
app.get("/najnovije", async (req, res) => {
  let articles = await source();
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  await setAsync("articles", 1800, JSON.stringify(articles));
  return res.render("index", {
    articles,
    moment,
    title: "Najnovije vesti",
    timelapseint: 43200000,
  });
});

app.get("/srbija", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let articles = null;
  if ((await existsAsync("articles")) === 1) {
    articles = JSON.parse(await getAsync("articles"));
  } else {
    articles = await source();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("articles", 1800, JSON.stringify(articles));
  }
  res.render("srbija", {
    articles,
    moment,
    title: "Srbija",
    subpath: "srbija",
    timelapseint,
  });
});

app.get("/crna-gora", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let articles = null;
  articles = await source();
  res.render("crna-gora", {
    articles,
    moment,
    title: "Crna Gora",
    subpath: "crna-gora",
    timelapseint,
  });
});

app.get("/bosna-i-hercegovina", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    console.log("this is timelapseint",timelapseint)
    timelapseint = 604800000;
  }
  let articles = null;
  articles = await source();
  res.render("bosna-i-hercegovina", {
    articles,
    moment,
    title: "BiH",
    subpath: "bosna-i-hercegovina",
    timelapseint,
  });
});

app.get("/hrvatska", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let articles = null;
  articles = await source();
  res.render("hrvatska", {
    articles,
    moment,
    title: "Hrvatska",
    subpath: "hrvatska",
    timelapseint,
  });
});
app.get("/makedonija", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let articles = null;
  articles = await source();
  res.render("makedonija", {
    articles,
    moment,
    title: "Makedonija",
    subpath: "makedonija",
    timelapseint,
  });
});

app.get("/politika/:countrypath/:countrytitle", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let subpath = req.params.countrypath;
  let title = req.params.countrytitle;
  let articles = null;
  if ((await existsAsync("politika")) === 1) {
    articles = JSON.parse(await getAsync("politika"));
  } else {
    articles = await politika();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("politika", 1800, JSON.stringify(articles));
  }

  res.render("politika", { articles, moment, title, subpath, timelapseint });
});

app.get("/aktuelno/:countrypath/:countrytitle", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let subpath = req.params.countrypath;
  let title = req.params.countrytitle;
  let articles = null;
  if ((await existsAsync("aktuelno")) === 1) {
    articles = JSON.parse(await getAsync("aktuelno"));
  } else {
    articles = await vesti();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("aktuelno", 1800, JSON.stringify(articles));
  }
  res.render("aktuelno", { articles, moment, title, subpath, timelapseint });
});

app.get("/drustvo/:countrypath/:countrytitle", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let subpath = req.params.countrypath;
  let title = req.params.countrytitle;
  let articles = null;
  if ((await existsAsync("drustvo")) === 1) {
    articles = JSON.parse(await getAsync("drustvo"));
  } else {
    articles = await drustvo();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("drustvo", 1800, JSON.stringify(articles));
  }

  res.render("drustvo", { articles, moment, title, subpath, timelapseint });
});

app.get("/kultura/:countrypath/:countrytitle", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let subpath = req.params.countrypath;
  let title = req.params.countrytitle;
  let articles = null;
  if ((await existsAsync("kultura")) === 1) {
    articles = JSON.parse(await getAsync("kultura"));
  } else {
    articles = await kultura();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("kultura", 1800, JSON.stringify(articles));
  }

  res.render("kultura", { articles, moment, title, subpath, timelapseint });
});

app.get("/sport/:countrypath/:countrytitle", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let subpath = req.params.countrypath;
  let title = req.params.countrytitle;
  let articles = null;
  if ((await existsAsync("sport")) === 1) {
    articles = JSON.parse(await getAsync("sport"));
  } else {
    articles = await sport();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("sport", 1800, JSON.stringify(articles));
  }

  res.render("sport", { articles, moment, title, subpath, timelapseint });
});

app.get("/zabava/:countrypath/:countrytitle", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let subpath = req.params.countrypath;
  let title = req.params.countrytitle;
  let articles = null;
  if ((await existsAsync("zabava")) === 1) {
    articles = JSON.parse(await getAsync("zabava"));
  } else {
    articles = await zanimljivosti();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    await setAsync("zabava", 1800, JSON.stringify(articles));
  }

  res.render("zabava", { articles, moment, title, subpath, timelapseint });
});

app.get("/selected/", async (req, res) => {
  let linkPath = req.query.articleLink;
  console.log("putanja je ", linkPath);
  res.render("selected", { linkPath, title: "Selected" });
});

app.get("/dodatno", async (req, res) => {
  console.log("dodatno je aktivno");
  res.render("dodatno", { title: "Dodatno" });
});
// app.post("/showarticle", (req, res) => {
//   const data = req.body;

//  console.log("data is", data);
//   let article = {
//     title: data.title,
//     link: data.link,
//     content: data.content,
//     logo: data.logo,
//     source: data.source,
//     image: data.image,
//   };
//   res.render("showarticle", { article, moment, title: "Pregled vesti" });
// });
app.get("/portali", async (req, res) => {
  let portals = await portali();
  res.render("portali", { title: "Medijski portali koje vi birate", portals });
});
app.get("/portal/:portName", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  let portName = req.params.portName;
  allArticles = await source();
  let articles = [];
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  for (let i = 0; i < allArticles.length; i++) {
    if (allArticles[i].source == portName) {
      articles.push(allArticles[i]);
    }
  }
  //console.log("izdvajamo", articles)
  return res.render("index", {
    articles,
    moment,
    title: portName,
    timelapseint,
  });
});

app.post("/showarticle", async (req, res) => {
  const data = req.body;
  let article = {
    title: data.title,
    link: data.link,
    content: data.content,
    logo: data.logo,
    source: data.source,
    image: data.image,
  };

  var myJSON = JSON.stringify(article);
  res.cookie("context", myJSON);
  //console.log(article)

  //res.render("preview", { article, moment, title: "Pregled vesti" });
  // try{
  //   const feedLink = await parser.parseURL( req.query.articleLink);
  //   console.log("link je ",feedLink);
  // }catch (e) {
  //   console.error("ERROR IS",e);
  // }
  console.log("cookie set");
  //res.cookie('cookie', 'monster');
  //res.send({ redirectTo: '/checking' })
  res.redirect("/checking");
  //res.send('');
});
app.get("/checking", async (req, res) => {
  //console.log(req.cookies['context'])
  //console.log("sta god.")
  const articleJson = await req.cookies["balkannewssavedarticles"];
  let article = JSON.parse(articleJson);
  // let linkPath=article.link;
  // res.clearCookie("context");
  console.log("sta god.", article);
  //res.status(404).render("404", { title: "404" });
  // res.status(200).render("selected", { linkPath, title: "Selected" }, function (err, html) {
  // ...
  //});
  //res.send('');
});

app.get("/preview/:title/:content/:source/", async (req, res) => {
  let article = {
    title: req.params.title,
    content: req.params.content,
    source: req.params.source,
    link: req.query.articleLink,
    logo: req.query.sourceLogo,
    image: req.query.artImage,
  };
  saveAsRead(article);
  console.log("article.logo is line 377 ",req.params )
  console.log("article.logo is line 378 ",req.query )
  console.log("article.logo is line 379 ",article )
  res.render("preview", { article, moment, title: "Pregled vesti" });
  // const articleJson = await req.cookies["context"];
  // let article = JSON.parse(articleJson)
  // console.log("podaci su", "article");
  //   res.clearCookie("context", { httpOnly: true });
  // res.render("selected", { linkPath : "https://www.codota.com/code/javascript/functions/express/Response/render", title: "Selected" });
});

function saveAsRead(article) {
  let date = new Date();
  let time = date.getTime();
  let week = time - 604800000;
  database.remove(
    { timeOfSaving: { $lt: week } },
    { multi: true },
    function (err, numRemoved) {
      console.log("Number of old articles removed ", numRemoved);
    }
  );
  database.find({ link: article.link }, (err, result) => {
    console.log("result is", result.length);
    if (result.length == 0) {
      let data = {
        title: article.title,
        content: article.content,
        source: article.source,
        link: article.link,
        logo: article.logo,
        image: article.image,
        numberOfVisits: 1,
        date: time,
      };
      database.insert(data);
    } else {
      console.log("this is else");
      // let allAnswers = result[0].answers;
      // let linkedArticle = result[0];
      let newNumberOfVisits = result[0].numberOfVisits + 1;
      // allAnswers.push(newAnswer);
      database.update(
        { _id: result[0]._id },
        { $set: { numberOfVisits: newNumberOfVisits } },
        { multi: true },
        function (err, numReplaced) {}
      );
    }
  });
}

app.post("/savearticle", async (req, res) => {
  const data = req.body;
  let article = {
    title: data.title,
    link: data.link,
    // content: data.content,
    // logo: data.logo,
    // source: data.source,
    // image: data.image,
  };
  let articles = [];

  let cookie = await req.cookies["balkannewssavedarticles"];
  console.log("cookie is ", cookie);
  //res.clearCookie("balkannewssavedarticles");
  if (cookie !== undefined && cookie.includes(article.link) !== true) {
    articles = JSON.parse(cookie);
    articles.push(article);
    console.log("artikles are", articles);
    let myJSON = JSON.stringify(articles);
    res.cookie("balkannewssavedarticles", myJSON);
    res.send("");
  } else {
    articles.push(article);
    console.log("artikles are", articles);
    let myJSON = JSON.stringify(articles);
    res.cookie("balkannewssavedarticles", myJSON);
    res.send("");
    console.log("this is else if as. article already exist");
  }
  // res.redirect("/checking");
  // var myJSON = JSON.stringify(article);
  //
  // res.cookie("balkannewssavedarticles12345", "isthisforreal4");
  //var myJSON = JSON.stringify(article);
  // res.cookie("context", myJSON, { httpOnly: true });
});

app.get("/sacuvane-vesti", async (req, res) => {
  let articles = null;
  let cookie = await req.cookies["balkannewssavedarticles"];
  articles = JSON.parse(cookie);
  //   // if ((await existsAsync("articles")) === 1) {
  //   //   console.log("redis smeta")
  //   //   articles = JSON.parse(await getAsync("articles"));
  //   // } else {

  //     // articles.sort((a, b) => new Date(b.date) - new Date(a.date));
  //     await setAsync("articles", 1800, JSON.stringify(articles));
  //   // }
  res.render("sacuvane-vesti", {
    articles,
    moment,
    title: "Pregled sačuvanih vesti",
  });
});

app.get("/period", async (req, res) => {
  res.render("period", { moment, title: "Vremenski period" });
});

app.get("/period168", async (req, res) => {
  let timelapseint = 604800000;
  res.cookie("timelapseint", timelapseint);
  res.redirect("/");
});
app.get("/period72", async (req, res) => {
  let timelapseint = 259200000;
  res.cookie("timelapseint", timelapseint);
  res.redirect("/");
});
app.get("/period24", async (req, res) => {
  let timelapseint = 86400000;
  res.cookie("timelapseint", timelapseint);
  res.redirect("/");
});
app.get("/period12", async (req, res) => {
  let timelapseint = 43200000;
  res.cookie("timelapseint", timelapseint);
  res.redirect("/");
});

app.get("/najcitanije", async (req, res) => {
  timelapseint = 604800000;

  console.log("ovo je najcitanije");
  database.find({}, (err, result) => {
    let articles = result;

    articles.sort(function (a, b) {
      return b.numberOfVisits - a.numberOfVisits;
    });
    //articles.sort((a, b) => new Date(b.date) - new Date(a.date));
    //setAsync("articles", 1800, JSON.stringify(articles));
    console.log("najcitanije su", articles.length);
    res.render("najcitanije", {
      articles,
      moment,
      title: "Najčitanije vesti u regionu",
      timelapseint,
    });
  });
});
app.get("/search", async (req, res) => {
 
    timelapseint = 604800000;
  
  const { term } = req.query;
  console.log(term);
  let articles = [];
  let allArticles = await source();
  allArticles.forEach((article) => {
    if (
      article.title.toLowerCase().includes(term.toLowerCase()) == true ||
      //article.content.toLowerCase().includes(term.toLowerCase()) == true ||
      article.source.toLowerCase().includes(term.toLowerCase()) == true
    ) {
      articles.push(article);
    }
  });
  console.log(articles[1]);
  res.render("searched", { articles, moment, title: "Rezultat pretrage",timelapseint });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});

