var router = require('express').Router();

var controller = require('./nodemodule.controller.js');
var imageController = require('./image.controller.js');

module.exports = router;

router.get('/', controller.newUser);

router.post('/', controller.create);

router.get('/images', imageController.getImages);

router.post('/images', imageController.create);