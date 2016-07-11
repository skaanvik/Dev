var express = require('express');
var router = express.Router();



router.get('/', function(req, res, next) {
  res.render('index', { title: 'MinOk API v1.0' });
});

module.exports = router;
