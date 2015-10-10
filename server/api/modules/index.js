var router = require('express').Router();

var controller = require('./nodemodule.controller.js');

module.exports = router;

router.get('/', controller.newUser);

router.post('/', controller.create);
