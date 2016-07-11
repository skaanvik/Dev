var express = require('express');
var router = express.Router();
var swaggerJSDoc = require('swagger-jsdoc');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'application/json'); 
  res.send(swaggerSpec);
 // res.send('respond with a resource');
});

module.exports = router;
