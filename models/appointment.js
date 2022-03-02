var mongoose  = require('mongoose');
const User = require('./user');
var Schema = mongoose.Schema;

var Appointment = new Schema({
    DateAppointment : String,
    user:User
});

module.exports = mongoose.model('appointments', Appointment);