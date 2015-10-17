var router = require('express').Router();
var mongoose = require('mongoose');
var controller = require('./nodemodule.controller.js');
var imageController = require('./image.controller.js');
var Image = mongoose.model('Image');
var AWS = require('aws-sdk');
var shortId = require('shortid');
var s3 = new AWS.S3();
var bucketName = 'commoncanvas';

module.exports = router;

router.get('/', controller.newUser);

router.post('/', controller.create);

router.get('/images', imageController.getImages);

router.post('/images', imageController.create);

// router.post('/images', function(req, res, next) {

//     var parsedPhoto = req.body.photo.match(/^(?:data:image\/)(\w{3,4})(?:;base64,)(.+)/).slice(1),
//         base64Data = parsedPhoto[1],
//         photoFileExt = '.' + parsedPhoto[0],
//         photoBuffer = new Buffer(base64Data, 'base64'); // buffer-fied photo

//     //the shortId generates a unique string of characters each time
//     var keyName = "" + shortId.generate() + photoFileExt;
//     req.body.photo = 'https://s3.amazonaws.com/' + bucketName + '/' + keyName;
//     var params = {
//         Bucket: bucketName,
//         Key: keyName,
//         Body: photoBuffer
//     };

//     s3.putObject(params, function(err, data) {
//         if (err) console.log(err);
//         else {
//             console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
//             Image.create(req.body, function(err, obj) {
//                 if (err) {
//                     console.log("Mongo error!");
//                     return handleError(err);
//                 }
//                 else res.json(obj);
//             });
//         }
//     });
// });