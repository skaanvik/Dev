var express = require('express');
var router = express.Router();
var dataLayer = require('../dataLayer/datalayer');


router.get('/checkdb', function(req, res, next) {
   dataLayer.checkdb(function(result) {
       res.send(result);
   }
  );});

router.get('/connect', function(req, res, next) {
    dataLayer.checkDbConnection(function(result){
        res.send(result);
    })
  
});


module.exports = router;
