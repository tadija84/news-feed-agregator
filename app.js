const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const { existsAsync, setAsync, getAsync } = require('./redis');
const sources = require('./sources');
const moment = require('moment-timezone');
fastify.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    }
});

fastify.get('/favicon.ico', async (req, res) => {
    const stream = fs.createReadStream('./favicon.ico');
    res.type('image/x-icon').send(stream);
    return res;
});

fastify.get('/', async (req, res) => {
    let articles = null;
    if (await existsAsync('articles') === 1) {
        console.log('Articles exist');
        articles = JSON.parse(await getAsync('articles'));
    } else {
        console.log('Articles do not exist');
        articles = await sources();
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        await setAsync('articles', JSON.stringify(articles), 'EX', 1800);
    };
    res.view('index.ejs', { articles, moment });
    return res;
});

fastify.listen(3000, (err, addr) => {
    console.log('Server running on ' + addr);
});