var mongoose = require('mongoose');
var NodeModule = require('./nodemodule.model');
var userCount = 0;

module.exports = {
  newUser: function (req, res) {
      userCount++;
      res.send({userID: userCount});
 },
 create: function(req, res, next) {
    NodeModule
      .create(req.body, function(err, nodeModule){
        if(err) return next(err);
        res.send(nodeModule);
      });
  } 
}

