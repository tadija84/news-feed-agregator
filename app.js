const express = require('express');
const app = express();
const path = require('path');
const { existsAsync, setAsync, getAsync } = require('./redis');
const sources = require('./sources');
const moment = require('moment-timezone');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    let articles = null;

    if (await existsAsync('articles') === 1) {
        articles = JSON.parse(await getAsync('articles'));
    } else {
        articles = await sources();
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        await setAsync('articles', JSON.stringify(articles), 'EX', 1800);
    };

    return res.render('index', { articles, moment });
});

app.listen(process.env.PORT || 3000);