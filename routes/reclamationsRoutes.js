var express = require('express');
var router = express.Router();
const Reclamation = require('../models/reclamation');
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', function(req, res, next) {
  const user = new User({ FullName: 'ali' });
  user.save().then(() => console.log('meow'));
  console.log(user.id)
  const reclamation = new Reclamation({ description : '123' , patient : user})
  reclamation.save().then(() => console.log('meow'));
  console.log(reclamation.patient.id)
});

module.exports = router;
