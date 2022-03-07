var express = require('express');
const res = require('express/lib/response');
const app = require('../app');
const Appointment = require('../models/appointment');
var router = express.Router();

router.get('/', function(req, res, next) {
    Appointment.find({}, function(err, appointments) {
    res.send(appointments)
    });
});

router.post("/",function(req, res, next) {
  
  const appo = new Appointment({ DateAppointment: req.body.name });
  appo.save().then(() => console.log('meow'));
  res.send('nice');
});

router.delete('/',function(req, res, next) {
  id = req.body.id
  Appointment.findByIdAndDelete(id,(err,data) => {
    res.send("data deleted"+data) ;
  }) ;
}) ;

router.put("/",function(req, res, next) {
  id = req.body.id
  Appointment.findByIdAndUpdate(id,{ DateAppointment: 'foo' },(err,data) => {
    res.send("data updated") ;
  }) ;
}) ;


module.exports = router;
