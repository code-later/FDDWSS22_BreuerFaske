'use strict';

const express = require('express');
const cors = require('cors');
const path = require('path');

// Constants
const PORT = 8080;
const HOST = process.env.BINDING;

// App
var app = module.exports = express();

// Enable CORS for localhost origins
app.use(cors({ origin: /localhost/, credentials: true }));

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
  res.send('Herzlich Willkommen und viel Freude!');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
