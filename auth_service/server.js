'use strict';

const express = require('express');
const Redis = require("ioredis");
const cors = require('cors');
const path = require('path');

// Connect to Redis with REDIS_URL from ENV
const redis = new Redis(process.env.REDIS_URL);

// Constants
const PORT = 8080;
const HOST = process.env.BINDING;

// App
var app = module.exports = express();

// Enable CORS for localhost origins
app.use(cors({ origin: /localhost/, credentials: true }));

// Read form data
app.use(express.urlencoded({ extended: false }));

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.redirect('/signup');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  redis.set(email, password); // NEVER store plain text passwords!

  res.redirect('/login');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  redis.get(email, (err, result) => {
    if (err) {
      res.send('Das hat nicht geklappt.');
    } else {

      if (result === password) {
        res.send(`Herzlich Willkommen "${email}" und viel Freude!`);
      } else {
        res.send('Das hat nicht geklappt.');
      }
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
