var express = require('express');
var router = express.Router();
const mongoDB = require('../mongodb/mongo');

router.post('/sign-up', function (req, res) {

  let { username, password } = req.body;

  mongoDB.db.collection('myusers_count').findOne({ key: 'user_id' }).then((d) => {

    let number = 1;
    if(d != null) {
      number = d.number;
    }

    mongoDB.db.collection('myusers').insertOne({ number: number, username, password }).then(i => {
      if(i.acknowledged) {
        mongoDB.db.collection('myusers_count').updateOne({ key: 'user_id' }, { $set: { number: number + 1 } }, { upsert: true }).then();
        res.json({ msg: 'ok' });
      }
      else res.json({ msg: 'err' });
    });

  });

});

router.post('/sign-in', function(req, res) {

  let { username, password } = req.body;
  mongoDB.db.collection('myusers').findOne({ username, password }).then(d => {
    if(d) res.json({ msg: 'ok', number: d.number });
    else res.status(403).json({ msg: 'err', error: 'unauthorized' });
  }).then();

});

module.exports = router;
