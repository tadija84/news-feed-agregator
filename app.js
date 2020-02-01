const fastify = require('fastify')({ logger: true });

fastify.get('/', (req, res) => {
    res.send('Hello World');
});

fastify.listen(3000, (err, addr) => {
    console.log('Server running on ' + addr);
});