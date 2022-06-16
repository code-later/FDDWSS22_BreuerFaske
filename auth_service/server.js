'use strict';

const express = require('express');
const Redis = require("ioredis");
const path = require('path');

// Connect to Redis with REDIS_URL from ENV
const redis = new Redis(process.env.REDIS_URL);

// Constants
const PORT = 8080;
const HOST = process.env.BINDING;

// App
var app = module.exports = express();


// Read form data
app.use(express.urlencoded({ extended: false }));

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.redirect('/auth/signup');
});

app.get('/signup', function(req, res){
  res.render('signup');
});

app.post('/signup', function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  redis.set(email, password); // NEVER store plain text passwords!

  res.redirect('/auth/login');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  redis.get(email, (err, result) => {
    if (err) {
      res.render('failed');
    } else {

      if (result === password) {
        res.render('welcome', { email: email });
      } else {
        res.render('failed');
      }
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
