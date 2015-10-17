var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var logger = require('morgan');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var fs = require('fs');


// aws service let's see how the fuck this works
var AWS = require('aws-sdk');
var keys = require('./development.js');
var shortId = require('shortid');

var bucketName = keys.AWS.bucketName;
// AWS.config.region = 'us-west-2';

AWS.config.update({
        accessKeyId: keys.AWS.clientID,
        secretAccessKey: keys.AWS.clientSecret
    });
    
var s3 = new AWS.S3();

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

//set up cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser({limit: '50mb'}));

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
    console.log("room in draw is: ", data.room);
    socket.to(data.room).broadcast.emit('newLine', data);
  });

  // Recieve notification of mouseup
  socket.on('mouseUp', function(data) {
    console.log("room in mouseUp is: ", data.room);
    socket.to(data.room).broadcast.emit('endLine', data);
  });
  
  socket.on('delete canvas', function(data){
    console.log("room is: ", data.room);
    socket.to(data.room).broadcast.emit('clear canvas');
  });
  
  socket.on('current image to new user', function(data){
    console.log("we are emitting the image to user: ", data.user, "from user: ", data.provider);
    socket.to(data.user).broadcast.emit('image to start', data);
  });

  socket.on('join room', function(data){
    console.log("we are recieving a request to join room: ", data.room, "from user: ", data.user);
    socket.join(data.room);
    socket.join(data.user);
    socket.to(data.room).broadcast.emit('get the current image', data);
  });

  socket.on('leave room', function(data){
    console.log("someone is leaving room", data.room);
    socket.leave(data.room);
  });

  socket.on('image to save', function(data){
    console.log(keys.AWS.bucketName);
    var parsedPhoto = data.image.match(/^(?:data:image\/)(\w{3,4})(?:;base64,)(.+)/).slice(1),
        base64Data = parsedPhoto[1],
        photoFileExt = '.' + parsedPhoto[0],
        photoBuffer = new Buffer(base64Data, 'base64'); // buffer-fied photo
    // req.body.photo = 'https://s3.amazonaws.com/' + bucketName + '/' + keyName;
    var keyName = "" + data.room +data.num + photoFileExt;
    console.log(data.room)
    var params = {
        Bucket: bucketName,
        Key: keyName,
        Body: photoBuffer
    };

    s3.putObject(params, function(err, data) {
      // console.log("Did it get into s3?")
        if (err) console.log(err);
        else {
            console.log("Successfully uploaded data to " + bucketName + "/" + params.Key);
            // Image.create(req.body, function(err, obj) {
            //     if (err) {
            //         console.log("Mongo error!");
            //         return handleError(err);
            //     }
            //     else res.json(obj);
            // });
        }
    });
    
    // fs.writeFile("./server/images/"+data.room+ data.num+ "Image.png", data.image,'base64', function (err) {
    //     if (err) return console.log(err);
    //     console.log('image saved!');
    //   })
  });

});

module.exports = server;

