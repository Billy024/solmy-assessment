var express = require('express');
var router = express.Router();
const mongoDB = require('../mongodb/mongo');

/* GET home page. */
router.get('/', function(req, res, next) {

  mongoDB.db.collection('myusers').countDocuments({}).then((c) => {
    res.render('index', { numberOfUsers: c });
  });

});

module.exports = router;
