var express = require('express');
var router = express.Router();
var Datalayer = require('../Datalayer/datalayer');

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - test
 *     description: show all users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.get('/', function (req, res) {

    var dl = new Datalayer();
    dl.test(function (result) {
        res.send('respond with a resource:' + result.Antall);
    });
   
});

module.exports = router;