const express = require('express');
const app = express();
const path = require('path');
const { existsAsync, setAsync, getAsync } = require('./redis');
const sources = require('./sources');
const moment = require('moment-timezone');

const PORT = process.env.PORT || 5000;



app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

 app.get('/', async (req, res) => {
    let articles = null;

    if (await existsAsync('articles') === 1) {
        
        articles = JSON.parse(await getAsync('articles'));
       
    } else {
        //
        articles = await sources();
        
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
         //console.log("this are the sources ",articles[1].title);
       await setAsync('articles', 1800, JSON.stringify(articles));
    };

    return res.render('index', { articles, moment, title: "Home" });
 });

 app.get('/politika', async (req, res)=>{
     res.render('politika', {title: "Politika"});
 });
 app.get('/aktuelno', async (req, res)=>{
    res.render('aktuelno', {title: "Aktuelno"});
});
app.get('/drustvo', async (req, res)=>{
    res.render('drustvo', {title: "Drustvo"});
});
app.get('/kultura', async (req, res)=>{
    res.render('kultura', {title: "Kultura"});
});
app.get('/sport', async (req, res)=>{
    res.render('sport', {title: "Sport"});
});
app.get('/zabava', async (req, res)=>{
    res.render('zabava', {title: "Zabava"});
});


app.get('/selected/', async (req, res)=>{
    let linkPath=req.query.articleLink;
   //console.log("req.params.articleLink "+linkPath);
 
    res.render('selected', {linkPath, title: "Selected"});
});


app.use((req,res)=>{
     res.status(404).render('404', {title: "404"});
 });

 app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});
// app.listen(process.env.PORT || 3000);