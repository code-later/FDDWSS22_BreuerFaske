'use strict';

const Redis = require("ioredis");
const Feed = require('feed').Feed;

// Connect to Redis with REDIS_URL from ENV
const redis = new Redis(process.env.REDIS_URL);

exports.UserSignedUp = (email) => {
  const event = {
    timestamp: new Date().getTime(), // RFC 3339 format
    title: "UserSignedUp",
    url: `http://localhost/auth/events/UserSignedUp/${email}`,
    payload: {
      email: email
    }
  };

  redis.rpush('events', JSON.stringify(event));
};

async function generateFeed() {
  const feed = new Feed({
    title: "Auth Service Events",
    description: "Auth Service Events",
    id: "http://localhost/auth",
    link: "http://localhost/auth",
    copyright: "All rights reserved 2022, code-later",
    generator: "auth_service", // optional, default = 'Feed for Node.js'
    feedLinks: {
      atom: "http://localhost/auth/atom"
    },
    author: {
      name: "auth_service",
      email: "auth_service@example.com",
      link: "http://localhost/auth"
    }
  });

  await redis.lrange('events', 0, -1).then((events) => {
    events.forEach(eventJSON => {
      const event = JSON.parse(eventJSON);

      feed.addItem({
        title: event.title,
        id: event.url,
        link: event.url,
        content: JSON.stringify(event.payload),
        author: [
          {
            name: "auth_service",
            email: "auth_service@example.com",
            link: "http://localhost/auth"
          }
        ],
        date: new Date(event.timestamp)
      });
    });
  });

  return feed.atom1();
};

exports.generateFeed = generateFeed;
