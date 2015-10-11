var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var logger = require('morgan');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var fs = require('fs');

var clientPath = path.join(__dirname, '../client');
var buildPath = path.join(__dirname, '../client/build');
var browserImagePath = path.join(__dirname, '../client/pre-build/public');    // for gulped files
var indexHtmlPath = path.join(__dirname, './index.html');
var nodePath = path.join(__dirname, '../node_modules');
var bowerPath = path.join(__dirname, '../bower_components');
var imagePath = path.join(__dirname, './images');
/* 
Meaniscule doesn't use Bower by default. To use Bower,
uncomment the following line and the related `app.use` line below.
*/
// var bowerPath = path.join(__dirname, '../bower_components');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(clientPath));
app.use(express.static(buildPath));
app.use(express.static(browserImagePath));
app.use(express.static(nodePath));
app.use(express.static(bowerPath));
app.use(express.static(imagePath));
// app.use(express.static(bowerPath));

/* 
Provides a 404 for times 
Credit to `fsg` module for this one!
*/
app.use(function (req, res, next) {

  if (path.extname(req.path).length > 0) {
    res.status(404).end();
  } else {
    next(null);
  }

});

// Routes
//// APIs for AJAX

// Look up all route files/folders from directory
var directories = fs.readdirSync(path.join(__dirname, '/api/'));

// Require each route dynamically 
directories.forEach(function(dir) {
  // Prepend /api/ to all api routes
  app.use('/api/' + dir + '/', require('./api/' + dir));
});

//// Index/Home
app.use('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'));
});


// Errors
//// Not found
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//// Server issues
app.use(function(err, req, res, next) {
  res.sendStatus(err.status || 500);

});


io.on('connection', function(socket){

  // Recieve notification of drawn line
  socket.on('draw', function(data) {
    socket.broadcast.emit('newLine', data);
  });

  // Recieve notification of mouseup
  socket.on('mouseUp', function(data) {
    socket.broadcast.emit('endLine', data);
  });
  
  socket.on('delete canvas', function(){
    socket.broadcast.emit('clear canvas');
  });
  
  socket.on('user created need image', function(data){
    socket.emit('get the current image', data);
  });
  
  socket.on('current image to new user', function(data){
    socket.emit('image to start', data);
  });


});

module.exports = server;

