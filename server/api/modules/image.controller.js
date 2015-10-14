var mongoose = require('mongoose');
var Image = require('./image.model');
var fs = require('fs');
module.exports = {
 
 create: function(req, res, next) {
   console.log("This is the body",req.body);
    Image
      .create(req.body, function(err, image){
        if(err) return next(err);
        console.log("got the post image")
        res.send(image);
      });
  },
  getImages: function(req,res,next){
	  Image.find().exec().then(function(images){
		  console.log("In images route");
		  res.send(images);
	  })
  } 
};

