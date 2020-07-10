# news-feed

A simple New Zealand news aggregator built with Express, Redis and the Bulma CSS framework. It works by fetching and parsing the RSS feeds of multiple news sources and temporarily caching them in Redis, and then serves the cached content to users using an EJS template.

## Setup

### To install dependencies:

```bash
npm install
```

### Starting a local Redis server with Docker:

```bash
docker run --name news-feed-redis -p 6379:6379 -d redis
```

### Starting the app:

```bash
npm start
```

The app will now be accessible on port 3000.
