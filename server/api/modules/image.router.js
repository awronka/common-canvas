'use strict'

var router = require('express').Router();
var	_ = require('lodash');
var mongoose = require('mongoose');
var Image = mongoose.model('Image');


router.get('/images', function(req,res,next){
	console.log("image in images")
	Image.find().exec().then(function(images){
		console.log(images)
		res.send(images)
	})
});

router.post('/images', function(req,res,next){
	Image.create(req.body).exec().then(function(image){
		console.log("image saved", image);
		res.send(image);
	}).then(null, next);
	
})


module.exports = router;