"use strict";
var express = require('express');
var router = express.Router();

var Datalayer = require('../Datalayer/datalayer');

/**
 * @swagger
 * /utils/dbcheck:
 *   get:
 *     tags:
 *       - Utilities 
 *     description: checks all database tables
 *     produces:
 *       - text/plain; charset=utf-8
 *     parameters:
 *    
 *     responses:
 *       200:
 *         description: table status
 */
router.get('/dbcheck', function (req, res) {
    var dl = new Datalayer();
    dl.updateDbToDatamodel(function (feedback) {
        res.send(feedback);
    });
});

module.exports = router;