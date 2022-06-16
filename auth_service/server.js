'use strict';

const express = require('express');
const Redis = require("ioredis");
const path = require('path');
const bcrypt = require("bcrypt");

// Connect to Redis with REDIS_URL from ENV
const redis = new Redis(process.env.REDIS_URL);

// Constants
const PORT = 8080;
const HOST = process.env.BINDING;

// App
var app = module.exports = express();

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
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

  redis.exists(email, (err, result) => {
    if (err || result === 1) {
      res.render('error');
    } else {
      redis.set(email, bcrypt.hashSync(password, 8));

      res.redirect('/auth/login');
    }
  });
});

app.get('/login', function(req, res){
  res.render('login');
});

app.post('/login', function(req, res){
  const email = req.body.email;
  const given_password = req.body.password;

  redis.get(email, (err, password) => {
    if (err) {
      res.render('error');
    } else {

      if (bcrypt.compareSync(given_password, password)) {
        res.render('welcome', { email: email });
      } else {
        res.render('error');
      }
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
