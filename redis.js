const { promisify } = require('util');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL || 6379);

exports.existsAsync = promisify(client.exists).bind(client);
exports.getAsync = promisify(client.get).bind(client);
exports.setAsync = promisify(client.set).bind(client);