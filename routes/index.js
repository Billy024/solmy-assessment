var express = require("express");
var router = express.Router();
const mongoDB = require("../mongodb/mongo");
const authenticateToken = require("../middleware/auth");

/* GET home page. */
router.get("/", authenticateToken, function (req, res, next) {
  mongoDB.db
    .collection("myusers")
    .countDocuments({})
    .then((c) => {
      res.render("index", { numberOfUsers: c });
    });
});

module.exports = router;
