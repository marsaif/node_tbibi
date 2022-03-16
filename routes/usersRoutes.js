var express = require('express');
var router = express.Router();
const User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users) {
    res.send(users)
    });
});

router.post('/', function(req, res, next) {

  const user = new User(
    { 
      firstName: req.body.firstName ,
      lastName: req.body.lastName ,
      email: req.body.email ,
      password : req.body.password,
      phone: req.body.phone ,
      role: req.body.role ,
      birthDate: req.body.birthDate ,
      sex: req.body.sex ,
    }
    );
  user.save().then();
  res.send('user saved');
});


router.get("/:id",function(req, res, next) {
  id = req.params.id ;
  console.log(id) ; 
  User.findById(id,(err,data) => 
  {
    console.log(data)
    res.send(data)
  }
  );
}) ;

router.put("/:id",function(req, res, next) {
  id = req.params.id ;
  firstName = req.body.firstName
  User.findByIdAndUpdate(id,{ firstName: firstName },(err,data) => {
    res.send("data updated") ;
  }) ;
}) ;

router.delete('/:id',function(req, res, next) {
  id = req.params.id ;
  User.findByIdAndDelete(id,(err,data) => {
    res.send("data deleted"+data) ;
  }) ;
}) ;

module.exports = router;
