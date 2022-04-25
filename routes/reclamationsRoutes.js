var express = require('express');
var router = express.Router();
const Reclamation = require('../models/reclamation');
const User = require('../models/user');

/* GET recla listing. */
router.get('/', function(req, res, next) {
  Reclamation.find({}, function (err, users) {
    res.send(users)
  });
});

router.post('/', function(req, res, next) {
  const { details, doctor ,patient} = req.body.data
  console.log(req.body.data)
  User.findById(doctor, (err, data) => {

    User.findById(patient, (err, data2) => {
      const reclamation = new Reclamation({ description : details , doctor : data,date:new Date(),patient:data2})
      reclamation.save().then(() => console.log('recla saved'));
    }
    );


  }
  );

});

module.exports = router;
