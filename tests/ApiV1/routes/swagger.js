var express = require('express');
var router = express.Router();
var swaggerJSDoc = require('swagger-jsdoc');

/* GET users listing. */
router.get('/', function(req, res, next) {
//  res.send('respond with a swagger');
   res.setHeader('Content-Type', 'application/json'); 
  res.send(swaggerSpec);

});

module.exports = router;
