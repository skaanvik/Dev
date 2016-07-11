var express = require('express');
var router = express.Router();

/**
 * @swagger
 * definition:
 *   User:
 *     properties:
 *       name:
 *         type: string
 *       pwd:
 *         type: string
 *      
 */


/**
 * @swagger
 * /authenticate:
 *   post:
 *     tags:
 *       - Authenticate
 *     description: Authenticate a users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: Successfully created
 */

function validUser(user) {
  if (!user) {
    return false;
  }
  if (user.name == 'mike') {
    if (user.pwd == 'test') {
      return true;
    }
  }
  return false;
}

router.post('/', function(req, res, next) {
  if (validUser(req.body)) {
    res.send('DetteErEnHemmeligToken');
  } else 
  {
    res.status(401).send('Unauthorized');
  }
  
});

module.exports = router;