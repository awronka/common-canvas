var mongoose = require('mongoose');


var Image = new mongoose.Schema({
	imageUrl: String,
	room: String
	
});

var ImageModel = mongoose.model("Image",Image);

module.exports = ImageModel;