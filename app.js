const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const { existsAsync, setAsync, getAsync } = require('./redis');
const sources = require('./sources');
const moment = require('moment-timezone');
const fnv1a = require('@sindresorhus/fnv1a');

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
    let articlesHash = null;

    if (await existsAsync('articles') === 1) {
        articlesHash = await getAsync('hash');
        if (req.headers['if-none-match'] === `"${articlesHash}"`) {
            res.status(304);
            res.res.end();

            res.sent = true;
            return res;
        }
        articles = JSON.parse(await getAsync('articles'));
    } else {
        articles = await sources();
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        const articlesString = JSON.stringify(articles);
        articlesHash = fnv1a(articlesString);
        
        await setAsync('articles', articlesString, 'EX', 1800);
        await setAsync('hash', articlesHash, 'EX', 1800);
    };

    res.header('ETag', `"${articlesHash}"`);
    res.view('index.ejs', { articles, moment });
    return res;
});

fastify.listen(process.env.PORT || 3000, (err, addr) => {
    console.log('Server running on ' + addr);
});