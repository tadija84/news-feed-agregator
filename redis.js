const { promisify } = require('util');
const redis = require('redis');

// const express = require("express");
// const app = express();

const REDIS_PORT =  process.env.PORT || 6379;
const client = redis.createClient(REDIS_PORT);

exports.existsAsync = promisify(client.exists).bind(client);
exports.getAsync = promisify(client.get).bind(client);
exports.setAsync = promisify(client.setex).bind(client);

