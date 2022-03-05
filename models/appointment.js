var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var Appointment = new Schema({
    DateAppointment : String,
});

module.exports = mongoose.model('appointments', Appointment);