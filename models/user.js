var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    FullName : String,
    Phone : Number
});

module.exports = mongoose.model('users', User);