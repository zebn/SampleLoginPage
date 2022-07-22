var application_root = __dirname;
var express = require("express");
var path = require("path");
var session = require('express-session');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var multer = require('multer');
var logger = require('morgan');
var favicon = require('serve-favicon');
var mongojs = require('mongojs');

var app = express();
var databaseUrl = "mongodb://localhost:27017/server1";
var collections = ["things"];
var db = mongojs(databaseUrl, collections);




app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(application_root, "public")));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(express.static(path.join(__dirname, 'static')));



app.get('/', function(req, res) {
  res.sendfile(path.join(__dirname + '/login.html'));
});


app.post('/auth', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  if (username && password) {
    db.things.findOne({
      "username": username,
      "password": password
    }, function(err, result) {
      if (err || !result) console.log("No users found");
      if (result) {
        req.session.loggedin = true;
        req.session.user = result.username;
        res.redirect('/home');
      } else {
        res.send('Incorrect Username and/or Password!');
      }
      res.end();
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
});

app.get('/home', function(req, res) {
  if (req.session.user) {
    res.send('Welcome back, ' + JSON.stringify(req.session.user) + '!');
  } else {
    res.send('Please login to view this page!');
  }
  res.end();
});






app.listen(1212);
