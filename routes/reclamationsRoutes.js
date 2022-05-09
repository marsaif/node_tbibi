var express = require('express');
var router = express.Router();
const Reclamation = require('../models/reclamation');
const User = require('../models/user');

/* GET recla listing. */
router.get('/', function(req, res, next) {
 
  Reclamation.find({read:false}, function (err, users) {
    res.send(users)
    console.log(users)
  }).populate('doctor').populate('patient');;
});


router.get('/recl/allReclamationsForDashboard', function(req, res, next) {
 
  Reclamation.find({}, function (err, users) {
    res.send(users)
    console.log(users)
  }).populate('doctor').populate('patient');;
});

router.put("/:id", function (req, res, next) {
  id = req.params.id;
  
  Reclamation.findByIdAndUpdate(id, { read: true }, (err, data) => {
    res.send("data updated");
  });
});

router.put("/updateReclamationDescription/:id", function (req, res, next) {
  console.log(req.body.description)
  id = req.params.id;


  Reclamation.findByIdAndUpdate(id, { description: req.body.description }, (err, data) => {
    res.send("data updated");
  }); 
});


router.delete('/:id', function (req, res, next) {
  id = req.params.id;
  Reclamation.findByIdAndDelete(id, (err, data) => {
    res.send("data deleted" + data);
  });
});


router.post('/', function(req, res, next) {
  const { details, doctor ,patient} = req.body.data
  console.log(req.body.data)
  User.findById(doctor, (err, data) => {

    User.findById(patient, (err, data2) => {
      const reclamation = new Reclamation({ description : details , doctor : data,date:new Date(),patient:data2,read:false})
      reclamation.save().then(() => console.log('recla saved'));
    }
    );


  }
  );

});

module.exports = router;
