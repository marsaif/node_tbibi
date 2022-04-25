var mongoose  = require('mongoose');
var Schema = mongoose.Schema;
const jwt = require('jsonwebtoken')

var User = new Schema({
    firstName : String,
    lastName : String,
    email: {
        type: "string",
        trim: true,
        unique: true,
      },
    password : String,
    phone : Number,
    role : String,
    birthDate : Date ,
    sex : String , 
    adress : String ,
    premium : Boolean , 
    speciality : String ,
    verified: {
      type: Boolean,
      required: true,
      default: false
  },
  image :{
    type: String,
    default: ""
  } ,
  resetpassword : String,
  accepted:{
    type: Boolean,
    default: false
  } 
});

User.methods.generateVerificationToken = function () {
  const user = this;
  const verificationToken = jwt.sign(
      { ID: user._id },
      process.env.USER_VERIFICATION_TOKEN_SECRET,
      { expiresIn: "7d" }
  );
  return verificationToken;
};

module.exports = mongoose.model('users', User);