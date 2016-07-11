
var express = require('express');
var router = express.Router();

var Datalayer = require('../Datalayer/datalayer');


/**
 * @swagger
 * definition:
 *   Category:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       parentId:
 *         type: string
 *       ignore:
 *         type: integer
 *       categoryType:
 *         type: integer
 *       sort:
 *         type: string
 *       budget:
 *         type: double
 */

/**
 * @swagger
 * /category:
 *   post:
 *     tags:
 *       - category
 *     description: Creates a category
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: category
 *         description: Category object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Category'
 *     responses:
 *       200:
 *         description: Successfully created
 *       500:
 *         description: sql error
 */
router.post('/', function (req, res) {
    dl = new Datalayer();
    dl.createCategory(req.body, function (success, message) {
        if (success) {
            res.send(message);
        }
        else {
            res.status(500).send(message);
        }
    });
});

/**
 * @swagger
 * /category:
 *   get:
 *     tags:
 *       - category
 *     description: Gets all categories
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: sql error
 */
router.get('/', function (req, res) {
    dl = new Datalayer();
    dl.getAllCategories(function (success, message) {
        if (success) {
            res.send(message);
        }
        else {
            res.status(500).send(message);
        }
    });
});

module.exports = router;