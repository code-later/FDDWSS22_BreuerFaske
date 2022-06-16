'use strict';

const express = require('express');
const Redis = require("ioredis");
const path = require('path');
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

// Connect to Redis with REDIS_URL from ENV
const redis = new Redis(process.env.REDIS_URL);

// Constants
const PORT = 8080;
const HOST = process.env.BINDING;

// App
var app = module.exports = express();

// Enable usage of Cookies
app.use(cookieParser());

// Parse requests of content-type - application/json
app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const verifyToken = (req, res, next) => {
  if (req.cookies && req.cookies._mau_mau_auth_JWT) {
    jwt.verify(req.cookies._mau_mau_auth_JWT, process.env.JWT_SECRET, function (err, decode) {
      if (err) req.user = undefined;

      redis.exists(decode.email, (err, result) => {
        if (err || result === 1) {
          req.user = decode.email;
          next();
        } else {
          req.user = undefined;
          next();
        }
      });
    });
  } else {
    req.user = undefined;
    next();
  }
};

app.get('/', verifyToken, (req, res) => {
  if (req.user) {
    res.render('welcome', { email: req.user });
  } else {
    res.render('new');
  }
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
        let authToken = jwt.sign({
          email: email
        }, process.env.JWT_SECRET, {
          expiresIn: 86400 // 24 hours
        });

        res.cookie('_mau_mau_auth_JWT', authToken);
        res.redirect('/auth');
      } else {
        res.render('error');
      }
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
