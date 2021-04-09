const express = require("express");
const app = express();
const path = require("path");
var bodyParser = require("body-parser");

const Datastore = require("nedb");

const MiniSearch = require('minisearch')
const { transliter } = require('transliter');
const convert = require('cyrillic-to-latin')

const { existsAsync, setAsync, getAsync } = require("./redis");
const {
  source,
  politika,
  drustvo,
  vesti,
  kultura,
  zanimljivosti,
  sport,
  ljubimci,
  putovanja,
  cryptocurrency,
  hitech
} = require("./sources");
const { portali } = require("./sviPortali");
const moment = require("moment-timezone");
var cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 5000;
const database = new Datastore("database.db");
database.loadDatabase();


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
  articles.forEach((article) => {
    if(article.category){
      console.log("category is", article.category)
    }
  });
  return res.render("index", { articles, moment, title: "Home", timelapseint });
});

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
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let linkPath = req.query.articleLink;
  console.log("putanja je ", linkPath);
  res.render("selected", { linkPath, title: "Selected",timelapseint });
});
app.get("/ljubimci", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let articles = null;
  if ((await existsAsync("ljubimci")) === 1) {
    articles = JSON.parse(await getAsync("ljubimci"));
  } else {
    articles = await ljubimci();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    await setAsync("ljubimci", 1800, JSON.stringify(articles));
  }
  res.render("index", { articles, moment, title: "Ljubimci", timelapseint });
});
app.get("/putovanja", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let articles = null;
  if ((await existsAsync("putovanja")) === 1) {
    articles = JSON.parse(await getAsync("putovanja"));
  } else {
    articles = await putovanja();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    await setAsync("putovanja", 1800, JSON.stringify(articles));
  }
  res.render("index", { articles, moment, title: "Putovanja", timelapseint });
});
app.get("/kripto", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let articles = null;
  if ((await existsAsync("kripto")) === 1) {
    articles = JSON.parse(await getAsync("kripto"));
  } else {
    articles = await cryptocurrency();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    await setAsync("kripto", 1800, JSON.stringify(articles));
  }
  res.render("index", { articles, moment, title: "Cryptocurrency", timelapseint });
});
app.get("/hitech", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let articles = null;
  if ((await existsAsync("hitech")) === 1) {
    articles = JSON.parse(await getAsync("hitech"));
  } else {
    articles = await hitech();
    articles.sort((a, b) => new Date(b.date) - new Date(a.date)); 
    await setAsync("hitech", 1800, JSON.stringify(articles));
  }
  res.render("index", { articles, moment, title: "HiTech", timelapseint });
});
app.get("/dodatno", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  res.render("dodatno", { title: "Dodatno", timelapseint });
});
app.get("/portali", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let portals = await portali();
  res.render("portali", { title: "Medijski portali koje vi birate", portals , timelapseint});
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
  return res.render("portal-arts", {
    articles,
    moment,
    title: portName,
    timelapseint,
  });
});

// app.post("/showarticle", async (req, res) => {
//   const data = req.body;
//   let article = {
//     title: data.title,
//     link: data.link,
//     content: data.content,
//     logo: data.logo,
//     source: data.source,
//     image: data.image,
//   };
//   var myJSON = JSON.stringify(article);
//   res.cookie("context", myJSON);
  //console.log(article)

  //res.render("preview", { article, moment, title: "Pregled vesti" });
  // try{
  //   const feedLink = await parser.parseURL( req.query.articleLink);
  //   console.log("link je ",feedLink);
  // }catch (e) {
  //   console.error("ERROR IS",e);
  // }
  // console.log("cookie set");
  //res.cookie('cookie', 'monster');
  //res.send({ redirectTo: '/checking' })
  // res.redirect("/checking");
  //res.send('');
// });


app.get("/preview/:title/:content/:source/", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let article = {
    title: req.params.title,
    content: req.params.content,
    source: req.params.source,
    link: req.query.articleLink,
    logo: req.query.sourceLogo,
    image: req.query.artImage,
  };
  saveAsRead(article);
  res.render("preview", { article, moment, title: "Pregled vesti",timelapseint });
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
      let newNumberOfVisits = result[0].numberOfVisits + 1;
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
    link: data.link
  };
  let articles = [];

  let cookie = await req.cookies["balkannewssavedarticles"];
  if (cookie !== undefined && cookie.includes(article.link) !== true) {
    articles = JSON.parse(cookie);
    articles.push(article);
    let myJSON = JSON.stringify(articles);
    res.cookie("balkannewssavedarticles", myJSON);
    res.send("");
  } else {
    articles.push(article);
    let myJSON = JSON.stringify(articles);
    res.cookie("balkannewssavedarticles", myJSON);
    res.send("");
  }
});

app.get("/sacuvane-vesti", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  let articles = null;
  let cookie = await req.cookies["balkannewssavedarticles"];
  console.log("sacuvane su",articles)
  if(cookie){
    articles = JSON.parse(cookie);
  }
  res.render("sacuvane-vesti", {
    articles,
    moment,
    title: "Pregled sačuvanih vesti",
    timelapseint
  });
});

app.get("/period", async (req, res) => {
  let timelapseint = await req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
    res.cookie("timelapseint", timelapseint);
  }
  res.render("period", { moment, title: "Vremenski period", timelapseint });
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
app.get("/smperiod168", async (req, res) => {
  let timelapseint = 604800000;
  res.cookie("timelapseint", timelapseint);
  res.redirect('back');
});
app.get("/smperiod72", async (req, res) => {
  let timelapseint = 259200000;
  res.cookie("timelapseint", timelapseint);
  res.redirect('back');
});
app.get("/smperiod24", async (req, res) => {
  let timelapseint = 86400000;
  res.cookie("timelapseint", timelapseint);
  res.redirect('back');
});
app.get("/smperiod12", async (req, res) => {
  let timelapseint = 43200000;
  res.cookie("timelapseint", timelapseint);
  res.redirect('back');
});
app.get("/najcitanije", async (req, res) => {
  timelapseint = 604800000;
  database.find({}, (err, result) => {
    let articles = result;

    articles.sort(function (a, b) {
      return b.numberOfVisits - a.numberOfVisits;
    });
    res.render("najcitanije", {
      articles,
      moment,
      title: "Najčitanije vesti u regionu",
      timelapseint,
    });
  });
});

// function cirToLat(y){
//   // console.log("cirilicno", y)
//   let cirillic=["а","б","в","г","д","ђ","е","ж","з","и","ј","к","л","љ","м","н","њ","о","п","р","с","т","ћ","у","ф","х","ц","ч","џ","ш","А","Б","В","Г","Д","Ђ","Е","Ж","З","И","Ј","К","Л","Љ","М","Н","Њ","О","П","Р","С","Т","Ћ","У","Ф","Х","Ц","Ч","Џ","Ш","Ѓ","ѓ","Ќ","ќ","Ѕ","ѕ"];
//   let latinic=["a","b","v","g","d","đ","e","ž","z","i","j","k","l","lj","m","n","nj","o","p","r","s","t","ć","u","f","h","c","č","dž","š","a","b","v","g","d","đ","e","ž","z","i","j","k","l","lj","m","n","nj","o","p","r","s","t","ć","u","f","h","c","č","dž","š","Đ","đ","Ć","ć","DZ","dz"];
//   for(let index=0; index<cirillic.length; index++){
//     y=y.replace(cirillic[index],latinic[index])
//   }
//   // console.log("latinicno", y)
//   return y
// }
function oneToAnother(x){
    const serLat=["č","ć","ž","đ","š"];
  const engLat=["c","c","z","dj","s"];
  for(let ind=0; ind<serLat.length; ind++){
    x=x.replace(serLat[ind],engLat[ind])
  }
  return x
}
app.get("/search", async (req, res) => {
    timelapseint = 127604800000;  
  let { term } = req.query;
  let translitTerm=oneToAnother(convert(term));
  let convertTerm=convert(term);
  console.log("ovo je","nesto", term);
  let allArticles = await source();
  let miniSearch = new MiniSearch({
    idField: 'link', 
    fields: ['title', 'content','source'], // fields to index for full-text search
     storeFields: ['title', 'content','source','link','image','date','logo','drzava','contentToShow','category'] // fields to return with search results
  })
  miniSearch.addAll(allArticles);
  let articles = miniSearch.search(term)

   console.log("new term", articles)
  // let articles = [];
  // let allArticles = await source();
  // allArticles.forEach((article) => {
  //   if (
  //     oneToAnother(cirToLat(article.title)).toLowerCase().includes(oneToAnother(cirToLat(term)).toLowerCase()) == true ||
  //     oneToAnother(cirToLat(article.content)).toLowerCase().includes(oneToAnother(cirToLat(term)).toLowerCase()) == true ||
  //     oneToAnother(cirToLat(article.source)).toLowerCase().includes(oneToAnother(cirToLat(term)).toLowerCase()) == true
  //   ) {
  //     console.log("new term", article.title, article.date)
  //     articles.push(article);
  //   }
  // });
  res.render("searched", { articles, moment, title: "Rezultat pretrage",timelapseint });
});

app.use((req, res) => {
  let timelapseint = req.cookies["timelapseint"];
  if (!timelapseint||timelapseint=="undefined") {
    timelapseint = 604800000;
  }
  res.status(404).render("404", { title: "404", timelapseint });
});

app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});

