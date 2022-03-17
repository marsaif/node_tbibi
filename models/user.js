var mongoose  = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    firstName : String,
    lastName : String,
    email : String,
    password : String,
    phone : Number,
    role : String,
    birthDate : Date ,
    sex : String , 
    Adress : String ,
    premium : Boolean , 
    speciality : String ,
});

module.exports = mongoose.model('users', User);